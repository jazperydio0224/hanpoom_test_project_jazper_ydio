import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Items } from 'src/entities/items.entity';
import { OrderFulfillmentProducts } from 'src/entities/order-fulfillment-products.entity';
import { Orders } from 'src/entities/orders.entity';
import { PickingSlipDates } from 'src/entities/picking-slip-dates.entity';
import { PickingSlipItems } from 'src/entities/picking-slip-items.entity';
import { PickingSlips } from 'src/entities/picking-slips.entity';
import { Stocks } from 'src/entities/stocks.entity';
import { validate } from 'class-validator';

// DTO's
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { CreateOrderFulfillmentProductDto } from './dto/create-order-fulfillment-products.dto';
import { CreateStockDto } from './dto/create-stock.dto';
import { CreatePickingSlipDto } from './dto/create-picking-slip.dto';
import { CreatePickingSlipDateDto } from './dto/create-picking-slip-date.dto';
import { CreatePickingSlipItemDto } from './dto/create-picking-slip-item.dto';

@Injectable()
export class MigrationService {
  constructor(
    @InjectRepository(PickingSlips)
    private readonly pickingSlipsRepository: Repository<PickingSlips>,
    @InjectRepository(PickingSlipItems)
    private readonly pickingSlipItemsRepository: Repository<PickingSlipItems>,
    @InjectRepository(PickingSlipDates)
    private readonly pickingSlipDatesRepository: Repository<PickingSlipDates>,
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
    @InjectRepository(Items)
    private readonly itemsRepository: Repository<Items>,
    @InjectRepository(Stocks)
    private readonly stocksRepository: Repository<Stocks>,
    @InjectRepository(OrderFulfillmentProducts)
    private readonly orderFulfillmentProductsRepository: Repository<OrderFulfillmentProducts>,
  ) {}
  async migrateData() {
    const queryRunner =
      this.pickingSlipsRepository.manager.connection.createQueryRunner();

    // Start transaction
    await queryRunner.startTransaction();
    try {
      // // Disable foreign key checks
      // await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');

      // await this.resetTables();

      // // Enable foreign key checks
      // await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');

      // 1. orders
      const orders = await this.readCsvFromFile(
        path.join(
          __dirname,
          '..',
          'data',
          'hanpoom warehouse data - orders.csv',
        ),
        'idOnly',
      );
      const { valid: validOrders, invalid: invalidOrders } =
        await this.validateAndFilter(orders, CreateOrderDto);

      const orderInstances = validOrders.map((order) => new Orders(order));
      await queryRunner.manager.save(orderInstances);

      // 2. items
      const items = await this.readCsvFromFile(
        path.join(
          __dirname,
          '..',
          'data',
          'hanpoom warehouse data - items.csv',
        ),
        'idOnly',
      );
      const { valid: validItems, invalid: invalidItems } =
        await this.validateAndFilter(items, CreateItemDto);

      const itemInstances = validItems
        .filter((item) => item.id > 0)
        .map((item) => {
          return new Items(item);
        });
      await queryRunner.manager.save(itemInstances);

      // 3. order fulfillment products
      const orderFulfillmentProducts = await this.readCsvFromFile(
        path.join(
          __dirname,
          '..',
          'data',
          'hanpoom warehouse data - order_fulfillment_products.csv',
        ),
        'idOnly',
      );
      const {
        valid: validFulfillmentProducts,
        invalid: invalidFulfillmentProducts,
      } = await this.validateAndFilter(
        orderFulfillmentProducts,
        CreateOrderFulfillmentProductDto,
      );

      const fulfillmentProductInstances = validFulfillmentProducts.map(
        (fulfillmentProduct) =>
          new OrderFulfillmentProducts(fulfillmentProduct),
      );
      await queryRunner.manager.save(fulfillmentProductInstances);

      // 4. stocks
      const stocks = await this.readCsvFromFile(
        path.join(
          __dirname,
          '..',
          'data',
          'hanpoom warehouse data - stocks.csv',
        ),
        'idOnly',
      );
      const { valid: validStocks, invalid: invalidStocks } =
        await this.validateAndFilter(stocks, CreateStockDto);
      invalidStocks.forEach(({ data, errors }) => {
        console.warn('Invalid Stock Skipped:', data, errors);
      });
      const stockInstances = validStocks.map((stock) => new Stocks(stock));
      await queryRunner.manager.save(stockInstances);

      // 5. picking slips
      const pickingSlips = await this.readCsvFromFile(
        path.join(
          __dirname,
          '..',
          'data',
          'hanpoom warehouse data - picking_slips.csv',
        ),
        'pickingSlips',
      );
      const { valid: validPickingSlips, invalid: invalidPickingSlips } =
        await this.validateAndFilter(pickingSlips, CreatePickingSlipDto);

      const pickingSlipInstances = [];

      for (const validPickingSlip of validPickingSlips) {
        const orderEntity = orders.find(
          (order) => order.id === validPickingSlip.orderId,
        );

        if (orderEntity) {
          const instance = new PickingSlips({
            ...validPickingSlip,
            orders: orderEntity,
          });

          pickingSlipInstances.push(instance);
        }
      }
      await queryRunner.manager.save(pickingSlipInstances);

      // 6. picking slip dates
      const pickingSlipDates = await this.readCsvFromFile(
        path.join(
          __dirname,
          '..',
          'data',
          'hanpoom warehouse data - picking_slip_dates.csv',
        ),
        'pickingSlipDates',
      );
      const { valid: validPickingSlipDates, invalid: invalidPickingSlipDates } =
        await this.validateAndFilter(
          pickingSlipDates,
          CreatePickingSlipDateDto,
        );

      const pickingSlipDateInstances = [];

      for (const validPickingSlipDate of validPickingSlipDates) {
        const pickingSlipEntity = pickingSlips.find(
          (pickingSlip) =>
            pickingSlip.id === validPickingSlipDate.pickingSlipId,
        );

        if (pickingSlipEntity) {
          const instance = new PickingSlipDates({
            ...validPickingSlipDate,
            pickingSlip: pickingSlipEntity,
          });
          pickingSlipDateInstances.push(instance);
        }
      }
      await queryRunner.manager.save(pickingSlipDateInstances);

      // 7. picking slip items
      const pickingSlipItems = await this.readCsvFromFile(
        path.join(
          __dirname,
          '..',
          'data',
          'hanpoom warehouse data - picking_slip_items.csv',
        ),
        'pickingSlipItems',
      );

      const { valid: validPickingSlipItems, invalid: invalidPickingSlipItems } =
        await this.validateAndFilter(
          pickingSlipItems,
          CreatePickingSlipItemDto,
        );

      const pickingSlipItemInstances = [];

      for (const validPickingSlipItem of validPickingSlipItems) {
        const pickingSlipsEntity = pickingSlips.find(
          (pickingSlip) =>
            pickingSlip.id === validPickingSlipItem.pickingSlipId,
        );

        const itemsEntity = items.find(
          (item) => item.id === validPickingSlipItem.itemId,
        );

        const stocksEntity = stocks.find(
          (stock) => stock.id === validPickingSlipItem.stockId,
        );

        const orderFulfillmentProductsEntity = orderFulfillmentProducts.find(
          (orderFulfillmentProduct) =>
            orderFulfillmentProduct.id ===
            validPickingSlipItem.orderFulfillmentProductId,
        );

        if (itemsEntity.id === 0) {
          continue;
        }

        if (
          pickingSlipsEntity &&
          itemsEntity &&
          orderFulfillmentProductsEntity
        ) {
          const instance = new PickingSlipItems({
            ...validPickingSlipItem,
            pickingSlip: pickingSlipsEntity,
            item: itemsEntity,
            stock: stocksEntity || null,
            orderFulfillmentProduct: orderFulfillmentProductsEntity,
          });
          pickingSlipItemInstances.push(instance);
        }
      }
      await queryRunner.manager.save(pickingSlipItemInstances);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async readCsvFromFile(
    filePath: string,
    tableType: string,
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];

      // Create a readable stream from the file
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          switch (tableType) {
            case 'idOnly':
              results.push({ id: data?.id ? parseInt(data.id, 10) : null });
              break;
            case 'pickingSlips':
              results.push({
                id: data?.id && data.id !== '' ? parseInt(data.id, 10) : null,
                orderId:
                  data?.order_id && data.order_id !== ''
                    ? parseInt(data.order_id, 10)
                    : null,
                orderFulfillmentOrderId:
                  data?.order_fulfillment_order_id &&
                  data.order_fulfillment_order_id !== ''
                    ? parseInt(data.order_fulfillment_order_id, 10)
                    : null,
                isContainedSingleProduct:
                  data?.is_contained_single_product &&
                  data.is_contained_single_product !== ''
                    ? parseInt(data.is_contained_single_product, 10)
                    : null,
                createdAt:
                  data?.created_at && data.created_at !== ''
                    ? new Date(data.created_at)
                    : null,
              });
              break;
            case 'pickingSlipDates':
              results.push({
                id: data?.id && data.id !== '' ? parseInt(data.id, 10) : null,
                pickingSlipId:
                  data?.picking_slip_id && data.picking_slip_id !== ''
                    ? parseInt(data.picking_slip_id, 10)
                    : null,
                printedUsername:
                  data?.printed_username && data.printed_username !== ''
                    ? data.printed_username
                    : null,
                inspectedUsername:
                  data?.inspected_username && data.inspected_username !== ''
                    ? data.inspected_username
                    : null,
                packedUsername:
                  data?.packed_username && data.packed_username !== ''
                    ? data.packed_username
                    : null,
                shippedUsername:
                  data?.shipped_username && data.shipped_username !== ''
                    ? data.shipped_username
                    : null,
                heldUsername:
                  data?.held_username && data.held_username !== ''
                    ? data.held_username
                    : null,
                cancelledUsername:
                  data?.cancelled_username && data.cancelled_username !== ''
                    ? data.cancelled_username
                    : null,
                refundedUsername:
                  data?.refunded_username && data.refunded_username !== ''
                    ? data.refunded_username
                    : null,
                confirmedUsername:
                  data?.confirmed_username && data.confirmed_username !== ''
                    ? data.confirmed_username
                    : null,
                printedAt:
                  data?.printed_at && data.printed_at !== ''
                    ? new Date(data.printed_at)
                    : null,
                inspectedAt:
                  data?.inspected_at && data.inspected_at !== ''
                    ? new Date(data.inspected_at)
                    : null,
                packedAt:
                  data?.packed_at && data.packed_at !== ''
                    ? new Date(data.packed_at)
                    : null,
                shippedAt:
                  data?.shipped_at && data.shipped_at !== ''
                    ? new Date(data.shipped_at)
                    : null,
                deliveredAt:
                  data?.delivered_at && data.delivered_at !== ''
                    ? new Date(data.delivered_at)
                    : null,
                returnedAt:
                  data?.returned_at && data.returned_at !== ''
                    ? new Date(data.returned_at)
                    : null,
                canceledAt:
                  data?.cancelled_at && data.cancelled_at !== ''
                    ? new Date(data.cancelled_at)
                    : null,
                refundedAt:
                  data?.refunded_at && data.refunded_at !== ''
                    ? new Date(data.refunded_at)
                    : null,
                heldAt:
                  data?.held_at && data.held_at !== ''
                    ? new Date(data.held_at)
                    : null,
                confirmedAt:
                  data?.confirmed_at && data.confirmed_at !== ''
                    ? new Date(data.confirmed_at)
                    : null,
                heldReason:
                  data?.held_reason && data.held_reason !== ''
                    ? data.held_reason
                    : null,
              });
              break;
            case 'pickingSlipItems':
              results.push({
                id: data?.id && data.id !== '' ? parseInt(data.id, 10) : null,
                quantity:
                  data?.quantity && data.quantity !== ''
                    ? parseInt(data.quantity, 10)
                    : null,
                refundedQuantity:
                  data?.refunded_quantity && data.refunded_quantity !== ''
                    ? parseInt(data.refunded_quantity, 10)
                    : null,
                locationId:
                  data?.location_id && data.location_id !== ''
                    ? parseInt(data.location_id, 10)
                    : null,
                locationCode:
                  data?.location_code && data.location_code !== ''
                    ? data.location_code
                    : null,
                isPreOrder:
                  data?.is_pre_order && data.is_pre_order !== ''
                    ? parseInt(data.is_pre_order, 10)
                    : null,
                isSalesOnly:
                  data?.is_sales_only && data.is_sales_only !== ''
                    ? parseInt(data.is_sales_only, 10)
                    : null,
                preOrderShippingAt:
                  data?.pre_order_shipping_at &&
                  data.pre_order_shipping_at !== ''
                    ? new Date(data.pre_order_shipping_at)
                    : null,
                preOrderDeadlineAt:
                  data?.pre_order_deadline_at &&
                  data.pre_order_deadline_at !== ''
                    ? new Date(data.pre_order_deadline_at)
                    : null,
                createdAt:
                  data?.created_at && data.created_at !== ''
                    ? new Date(data.created_at)
                    : null,
                updatedAt:
                  data?.updated_at && data.updated_at !== ''
                    ? new Date(data.updated_at)
                    : null,
                itemId:
                  data?.item_id && data.item_id !== ''
                    ? parseInt(data.item_id, 10)
                    : null,
                stockId:
                  data?.stock_id && data.stock_id !== ''
                    ? parseInt(data.stock_id, 10)
                    : null,
                orderFulfillmentProductId:
                  data?.order_fulfillment_product_id &&
                  data.order_fulfillment_product_id !== ''
                    ? parseInt(data.order_fulfillment_product_id, 10)
                    : null,
                pickingSlipId:
                  data?.picking_slip_id && data.picking_slip_id !== ''
                    ? parseInt(data.picking_slip_id, 10)
                    : null,
              });
          }
        })
        .on('end', () => resolve(results))
        .on('error', (err) => reject(`Error reading CSV file: ${err.message}`));
    });
  }

  private async validateAndFilter<T extends object>(
    data: object[],
    dtoClass: new () => T,
  ): Promise<{ valid: T[]; invalid: { data: object; errors: any[] }[] }> {
    const valid: T[] = [];
    const invalid: { data: object; errors: any[] }[] = [];

    for (const item of data) {
      const dtoInstance = plainToInstance(dtoClass, item);
      const errors = await validate(dtoInstance);

      if (errors.length === 0) {
        valid.push(dtoInstance);
      } else {
        invalid.push({ data: item, errors });
      }
    }

    return { valid, invalid };
  }

  private async resetTables() {
    await this.pickingSlipsRepository.clear();
    await this.pickingSlipItemsRepository.clear();
    await this.pickingSlipDatesRepository.clear();
    await this.ordersRepository.clear();
    await this.itemsRepository.clear();
    await this.stocksRepository.clear();
    await this.orderFulfillmentProductsRepository.clear();
  }
}
