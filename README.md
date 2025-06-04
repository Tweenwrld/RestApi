# Express.js RESTful API for Product Management

## Overview

I developed a RESTful API using Express.js as part of the Week 2 assignment for the MERN Specialization course. This project implements a product management system with full CRUD operations, custom middleware, robust error handling, and advanced features like filtering, pagination, and search. The API is designed to handle product data with fields such as `id`, `name`, `description`, `price`, `category`, and `inStock`, using an in-memory store for simplicity. Below, I outline the project details, challenges faced, solutions implemented, tools used, and instructions to run the application.

## Features

- **RESTful Endpoints**: Supports CRUD operations for products:
  - `GET /api/products`: List all products with optional filtering, pagination, and search.
  - `GET /api/products/:id`: Retrieve a specific product by ID.
  - `POST /api/products`: Create a new product (requires API key).
  - `PUT /api/products/:id`: Update a product (requires API key).
  - `DELETE /api/products/:id`: Delete a product (requires API key).
  - `GET /api/products/stats`: Get product statistics (e.g., count by category).
- **Middleware**:
  - Custom logger middleware to log request method, URL, and timestamp.
  - JSON body parsing using `body-parser`.
  - Authentication middleware to validate an API key via the `x-api-key` header.
  - Validation middleware to ensure product data integrity for POST and PUT requests.
- **Error Handling**: Global error middleware with custom error classes (`NotFoundError`, `ValidationError`) for consistent error responses.
- **Advanced Features**:
  - Filtering by category (`?category=electronics`).
  - Pagination (`?page=1&limit=10`).
  - Search by name (`?search=laptop`).
  - Product statistics endpoint.
- **Root Endpoint**: `GET /` returns a "Hello World" message.

## Project Structure

```
express-api/
├── src/
│   ├── config/
│   │   └── config.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── loggerMiddleware.js
│   │   └── validateProduct.js
│   ├── routes/
│   │   └── productRoutes.js
│   ├── errors/
│   │   ├── NotFoundError.js
│   │   └── ValidationError.js
│   ├── utils/
│   │   └── asyncHandler.js
│   └── server.js
├── .env.example
├── README.md
├── package.json
└── .gitignore
```

## Challenges and Solutions

During development, I encountered several challenges, which I resolved systematically:

1. **MODULE_NOT_FOUND Errors**:
   - **Problem**: Initial attempts to run `npm start` resulted in errors like `Cannot find module 'index.js'` or `Cannot find module './routes/productRoutes'`, indicating missing files or incorrect `package.json` scripts.
   - **Solution**: I verified the project structure, ensuring `src/server.js` existed and was referenced correctly in `package.json` (`"start": "node src/server.js"`). I created missing files (e.g., `src/routes/productRoutes.js`) and ensured all dependencies (`express`, `body-parser`, `uuid`, `dotenv`) were installed via `npm install`.

2. **TypeError: app.use() requires a middleware function**:
   - **Problem**: This error occurred when `app.use('/api/products', productRoutes)` was called, suggesting `productRoutes` was not a valid Express router, likely due to a missing or incorrect `module.exports` in `productRoutes.js`.
   - **Solution**: I confirmed that `productRoutes.js` exported the router correctly (`module.exports = router;`). I also verified that all middleware files (`loggerMiddleware.js`, `errorMiddleware.js`) exported valid functions, resolving the issue.

3. **ReferenceError: req is not defined**:
   - **Problem**: A `ReferenceError` occurred in `productRoutes.js` at line 17 (`name: req.body.name`), indicating `req` was referenced outside a route handler, likely from an incorrect static `products` array initialization.
   - **Solution**: I corrected `productRoutes.js` to initialize `products` as an empty array (`let products = [];`) and ensured `req.body` was only used within route handlers (e.g., POST, PUT), restoring proper functionality.

4. **Invalid or Missing API Key Error**:
   - **Problem**: When testing the POST endpoint with PowerShell (`Invoke-RestMethod`), I received a `400 Bad Request` error due to a malformed command omitting the `x-api-key` header.
   - **Solution**: I fixed the PowerShell command to include the correct headers and body, ensuring `x-api-key` matched the `.env` `API_KEY`. I also verified the `.env` file and `authMiddleware.js` for consistency.

These challenges taught me the importance of careful file management, proper module exports, and precise API testing.

## Tools Used

- **Node.js (v22.16.0)**: Runtime environment for executing JavaScript server-side.
- **Express.js**: Web framework for building the RESTful API.
- **Dependencies**:
  - `express`: Core framework.
  - `body-parser`: Middleware for parsing JSON bodies.
  - `uuid`: Generates unique product IDs.
  - `dotenv`: Loads environment variables from `.env`.
  - `nodemon` (dev): Auto-restarts server during development.
- **Development Tools**:
  - **VS Code**: Code editor for writing and debugging.
  - **Git**: Version control for tracking changes.
  - **GitHub Classroom**: Submission platform.
- **Testing Tools**:
  - **Postman**: GUI tool for testing API endpoints.
  - **curl**: Command-line tool for sending HTTP requests.
  - **PowerShell**: Used for testing with `Invoke-RestMethod`.
- **Operating System**: Windows (for running the project and tests).

## Prerequisites

To run this project, ensure you have:
- Node.js (v18 or higher, tested with v22.16.0) installed. Download from [nodejs.org](https://nodejs.org/).
- Git installed for cloning the repository.
- A terminal (e.g., PowerShell, Command Prompt, or Git Bash).
- Postman or curl for testing API endpoints.

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd express-api
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   This installs `express`, `body-parser`, `uuid`, `dotenv`, and `nodemon`.

3. **Configure Environment Variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     copy .env.example .env
     ```
   - Open `.env` and set the `API_KEY` (default: `my-secret-key-123`):
     ```
     PORT=3000
     API_KEY=my-secret-key-123
     ```

4. **Run the Server**:
   - Start the server:
     ```bash
     npm start
     ```
     Or use `nodemon` for development:
     ```bash
     npm run dev
     ```
   - The server runs on `http://localhost:3000` (or the port specified in `.env`).

5. **Test the API**:
   Use Postman, curl, or PowerShell to test endpoints. See the API documentation below for details.

## API Documentation

### Base URL
`http://localhost:3000`

### Endpoints

| Method | Endpoint                | Description                          | Headers                     | Body Example                                                                 |
|--------|-------------------------|--------------------------------------|-----------------------------|------------------------------------------------------------------------------|
| GET    | `/`                     | Returns "Hello World"                | None                        | None                                                                         |
| GET    | `/api/products`         | List products (filter, paginate, search) | None                        | None                                                                         |
| GET    | `/api/products/:id`     | Get product by ID                    | None                        | None                                                                         |
| POST   | `/api/products`         | Create a product                     | `x-api-key`, `Content-Type` | `{"name":"Laptop","description":"High-performance laptop","price":999.99,"category":"electronics","inStock":true}` |
| PUT    | `/api/products/:id`     | Update a product                     | `x-api-key`, `Content-Type` | `{"name":"Updated Laptop","description":"Updated description","price":1099.99,"category":"electronics","inStock":false}` |
| DELETE | `/api/products/:id`     | Delete a product                     | `x-api-key`                 | None                                                                         |
| GET    | `/api/products/stats`   | Get product statistics               | None                        | None                                                                         |

### Query Parameters (GET /api/products)
- `category`: Filter by category (e.g., `?category=electronics`).
- `page`: Page number for pagination (e.g., `?page=1`).
- `limit`: Items per page (e.g., `?limit=10`).
- `search`: Search by product name (e.g., `?search=laptop`).

### Example Requests

#### GET / (Hello World)
```bash
curl http://localhost:3000
```
**Response**:
```json
{"message":"Hello World"}
```

#### POST /api/products (Create Product)
```bash
curl -X POST http://localhost:3000/api/products \
-H "Content-Type: application/json" \
-H "x-api-key: my-secret-key-123" \
-d '{"name":"Laptop","description":"High-performance laptop","price":999.99,"category":"electronics","inStock":true}'
```
**Response** (201):
```json
{
  "id": "some-uuid",
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "category": "electronics",
  "inStock": true,
  "createdAt": "2025-06-04T13:45:00.000Z"
}
```

#### GET /api/products?category=electronics (Filter)
```bash
curl http://localhost:3000/api/products?category=electronics
```
**Response**:
```json
{
  "data": [
    {
      "id": "some-uuid",
      "name": "Laptop",
      "description": "High-performance laptop",
      "price": 999.99,
      "category": "electronics",
      "inStock": true,
      "createdAt": "2025-06-04T13:45:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 10
  }
}
```

#### PowerShell Example (POST)
```powershell
$headers = @{
    "Content-Type" = "application/json"
    "x-api-key" = "my-secret-key-123"
}
$body = @{
    "name" = "Laptop"
    "description" = "High-performance laptop"
    "price" = 999.99
    "category" = "electronics"
    "inStock" = $true
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method Post -Headers $headers -Body $body
```

### Error Responses
- **404 Not Found** (e.g., GET /api/products/invalid-id):
  ```json
  {
    "error": {
      "message": "Product not found",
      "status": 404,
      "name": "NotFoundError"
    }
  }
  ```
- **400 Bad Request** (e.g., missing API key or invalid data):
  ```json
  {
    "error": {
      "message": "Invalid or missing API key",
      "status": 400,
      "name": "ValidationError"
    }
  }
  ```

## Running Tests

To verify functionality, I tested all endpoints using:
- **Postman**: Configured requests for each endpoint, including headers and query parameters.
- **curl**: Sent HTTP requests via Git Bash or Command Prompt.
- **PowerShell**: Used `Invoke-RestMethod` for scripted tests.

Example test sequence:
1. Start server: `npm start`.
2. Test GET /: `curl http://localhost:3000`.
3. Create product: POST /api/products with valid headers and body.
4. List products: GET /api/products with query parameters.
5. Get, update, delete product using the created product’s ID.
6. Check statistics: GET /api/products/stats.
7. Test error cases (invalid ID, missing API key, invalid data).


## Conclusion

This project implements a RESTful API with middleware, error handling, and advanced features. Overcoming challenges like module errors and API key issues enhanced my understanding of Express.js, middleware design, and API testing. The API is ready for use and further extension, such as integrating a database for persistent storage.

---

### Instructions for Use
- **Save the File**: Save this content as `README.md` in your project root (`C:\Users\ADMIN\Desktop\PLP SOFTWARE ENGINEERING\MERN-SPECIALIZATION\express-api\README.md`).
- **Verify Content**: Ensure the `API_KEY` in examples matches your `.env` file.
- **Test Endpoints**: Use the provided curl or PowerShell commands to confirm functionality.
- **Push to GitHub**:
  ```powershell
  git add README.md
  git commit -m "Add professional README.md"
  git push origin main
  ```
