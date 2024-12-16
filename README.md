# NestJS Application

This is a **NestJS** application developed as part of an interview assignment.

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Using the API](#using-the-api)

---

## Getting Started

Follow the instructions below to clone the repository, set up the application, and test the API.

---

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v22 or higher)
- [npm](https://www.npmjs.com/) (v10.9 or higher) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (optional, for running the database and the application together in a container)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jazperydio0224/hanpoom_test_project_jazper_ydio
   cd hanpoom_test_project_jazper_ydio
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and configure the required environment variables:
   ```env
      MYSQL_ROOT_PASSWORD=root_password
      MYSQL_DATABASE=database
      MYSQL_HOST=host
      MYSQL_TCP_PORT=port
      MYSQL_USER=user
      MYSQL_PASSWORD=user_password
   ```

4. If using Docker, you can start the development container:
   ```bash
   docker compose -f docker-compose.yml up --build 
   ```

5. Run database migrations:
   ```bash
   npm run migration:generate
   npm run migration:run
   # other options in package.json
   ```

6. Data population
   ```bash
   # if using Docker
   docker exec -it <docker-container-name> bash 
   npm run populate

   # else
   npm run populate
   ```
---

## Running the Application

To start the server:

```bash
docker compose -f docker-compose.yml up
# or
npm run start:dev
# or
yarn start:dev
```

The API will be available at `http://localhost:3000` (or the port specified in the `.env` file).

---

## Using the API

### API Documentation

1. Start the application.
2. Navigate to `http://localhost:3000/api/slips`.

### Example API Endpoints

#### Slips Endpoint
- **GET** `/api/slips`
  - Description: Fetch a paginated and filtered list of slips.
  - Query Parameters:
    - `page` (required): The page number for pagination. Default is `1`.
    - `size` (required): The number of items per page. Default is `3`.
    - `filter` (required): Filter criteria. For example, `status:pr` filters slips by status.
  - Status Values:
    - `pr`: Printed
    - `np`: Not Printed
    - `he`: Held
  - Example Request:
    ```
    GET /api/slips?page=1&size=3&filter=status:pr
    ```
  - Example Response:
    ```json
    {
    "totalItems": 30,
    "items": [
    {
      "order_id": 1447,
      "picking_slip_id": 2855,
      "has_pre_order_item": 1,
      "status": "printed"
    },
    {
      "order_id": 1426,
      "picking_slip_id": 2824,
      "has_pre_order_item": 1,
      "status": "printed"
    },
    {
      "order_id": 1382,
      "picking_slip_id": 2733,
      "has_pre_order_item": 1,
      "status": "printed"
    }
    ],
    "page": 1,
    "size": 3
    }
    ```
