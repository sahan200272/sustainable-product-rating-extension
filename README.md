# Sustainable Product Rating Extension

SDG Goal: Responsible Consumption and Production (SDG 12)

Our app helps online shoppers make eco-friendly choices by rating products based on sustainability factors like materials, packaging, and ethical production. Each product gets an eco-score, guiding users to buy responsibly and support sustainable consumption.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Deployment Documentation](#deployment-documentation)
- [Testing Instruction Report](#testing-instruction-report)
- [Environment Variables](#environment-variables)

## Features

- **Product Management**: CRUD operations for sustainable products with image uploads
- **AI-Powered Analysis**: Sustainability scoring using Google Gemini AI
- **Review System**: User reviews with AI-based content moderation
- **Blog Platform**: Content creation with approval workflow
- **Product Comparison**: Side-by-side comparison of sustainability metrics
- **User Authentication**: JWT-based authentication with role-based access control

## Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **AI Integration**: Google Generative AI (Gemini)
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **UI Libraries**: React Icons, React Hot Toast

---

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Cloudinary account (for image hosting)
- Google AI API key (for Gemini AI features)
- Perspective API key (for content moderation)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sahan200272/sustainable-product-rating-extension.git
   cd sustainable-product-rating-extension
   ```

2. **Navigate to backend directory**
   ```bash
   cd backend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Create environment file**
   
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database
   MONGODB_URL=mongodb://localhost:27017/sustainable-products

   # Authentication
   JWT_SECRET=your_jwt_secret_key_here

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Google AI Configuration
   GOOGLE_API_KEY=your_google_gemini_api_key
   GEMINI_API_KEY=your_google_gemini_api_key

   # Content Moderation
   PERSPECTIVE_API_KEY=your_perspective_api_key
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

   The backend server will start at `http://localhost:3000`

## API Documentation

Base URL: `http://localhost:3000/api`

### Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

### API Endpoints

## 1. User Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/users/register` | Register a new user account | Public |
| POST | `/api/users/login` | Login and receive JWT token | Public |
| GET | `/api/users/getUser` | Get current user profile | Required |

#### Example: User Registration
**POST** `/api/users/register`
- **Request Body**:
```json
{
  "name": "Sahan Perera",
  "email": "sahan@example.com",
  "password": "Password123!",
  "role": "Customer"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": { "id": "65e...", "name": "Sahan Perera", "email": "sahan@example.com" }
}
```

## 2. Product Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/products` | Create a new product with images | Admin only |
| GET | `/api/products` | Get all products (supports pagination) | Public |
| GET | `/api/products/:id` | Get single product details | Public |

#### Example: Create Product (Admin Only)
**POST** `/api/products` (Multipart Form Data)
- **Fields**: `name`, `brand`, `category`, `description`, `sustainabilityScore`
- **Files**: `images` (Max 5)
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { "name": "Eco Bottle", "sustainabilityScore": 85, ... }
}
```

## 3. Review Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/reviews` | Create a product review | Customer only |
| GET | `/api/reviews/product/:productId` | Get approved reviews for a product | Public |

#### Example: Submit Review
**POST** `/api/reviews`
- **Request Body**:
```json
{
  "productId": "65e...",
  "comment": "Great product, very sustainable!",
  "rating": 5
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Review submitted for moderation",
  "review": { "comment": "Great product...", "status": "PENDING" }
}
```

---

## Deployment Documentation

This section provides details on the deployment platforms, setup steps, and environment configuration for both the backend and frontend.

### 1. Backend Deployment

- **Platform**: [Render](https://render.com) (Recommended) or Railway / Heroku
- **Setup Steps**:
  1.  **Connect Repository**: Link the GitHub repository and set the root directory to `backend`.
  2.  **Runtime Configuration**: Use `Node.js` with the build command `npm install` and start command `npm start`.
  3.  **Environment Variables**: Configure the variables listed in the [Environment Variables](#backend-environment-variables) section in the Render/Platform dashboard.
  4.  **Database Connection**: Ensure the `MONGODB_URL` points to a live MongoDB Atlas instance.
  5.  **Log Monitoring**: Verify successful startup via the deployment logs.

### 2. Frontend Deployment

- **Platform**: [Vercel](https://vercel.com) (Recommended) or Netlify
- **Setup Steps**:
  1.  **Connect Repository**: Link the GitHub repository and set the root directory to `frontend`.
  2.  **Build Settings**:
      - Framework Preset: `Vite`
      - Build Command: `npm run build`
      - Output Directory: `dist`
  3.  **Environment Variables**: Add `VITE_API_URL` pointing to the deployed backend API.
  4.  **Deploy**: Trigger the deployment and verify the live site.

### 3. LIVE URLs

- **Deployed Backend API**: [https://your-backend-api.onrender.com/api](https://your-backend-api.onrender.com/api)
- **Deployed Frontend Application**: [https://your-sustainable-app.vercel.app](https://your-sustainable-app.vercel.app)

### 4. Deployment Evidence

| Evidence Type | Description | Placeholder |
| ------------- | ----------- | ----------- |
| **Backend Deployment** | Successful API startup | ![Backend Evidence](./screenshots/backend-deploy.png) |
| **Frontend Deployment** | Successful UI build | ![Frontend Evidence](./screenshots/frontend-deploy.png) |
| **Database Connection** | MongoDB Atlas cluster status | ![Database Evidence](./screenshots/mongodb-atlas.png) |

---

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URL=mongodb://localhost:27017/sustainable-products
MONGODB_URL_TEST=mongodb://localhost:27017/sustainable-products-test

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here_min_32_characters

# Cloudinary Configuration (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google AI Configuration (Gemini)
GOOGLE_API_KEY=your_google_gemini_api_key
GEMINI_API_KEY=your_google_gemini_api_key

# Perspective API (Content Moderation)
PERSPECTIVE_API_KEY=your_perspective_api_key
```

### Environment Variable Details

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Server port number | Yes | `5000` |
| `NODE_ENV` | Environment mode | No | `development` or `production` |
| `MONGODB_URL` | MongoDB connection string | Yes | `mongodb://localhost:27017/dbname` |
| `MONGODB_URL_TEST` | Test database URL | For testing | `mongodb://localhost:27017/test-db` |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | Min 32 characters |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name | Yes | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes | From Cloudinary dashboard |
| `GOOGLE_API_KEY` | Google Gemini API key | Yes | From Google AI Studio |
| `GEMINI_API_KEY` | Alternative Gemini key | Yes | Same as GOOGLE_API_KEY |
| `PERSPECTIVE_API_KEY` | Google Perspective API key | Yes | From Google Cloud Console |

### Getting API Keys

**Cloudinary:**
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Navigate to Dashboard
3. Copy Cloud Name, API Key, and API Secret

**Google Gemini AI:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the generated key

**Perspective API:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Perspective Comment Analyzer API
3. Create credentials and copy the API key



---

## Project Structure

```
sustainable-product-rating-extension/
├── backend/
│   ├── src/
│   │   ├── config/           # Configuration files (DB, Cloudinary)
│   │   ├── controllers/      # Request handlers
│   │   ├── middlewares/      # Auth, error handling, file upload
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Business logic & AI services
│   │   ├── utils/            # Helper functions
│   │   ├── tests/            # Unit & integration tests
│   │   └── server.js         # Express app entry point
│   ├── package.json
│   └── jest.config.js
│
├── frontend/
│   ├── src/
│   │   ├── assets/           # Images, icons
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React Context (Auth)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components
│   │   ├── routes/           # Route configuration
│   │   ├── services/         # API integration
│   │   ├── utils/            # Helper functions
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # React entry point
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## HTTP Status Codes

| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| 200 | OK | Successful request |
| 201 | Created | Resource successfully created |
| 400 | Bad Request | Invalid request body, missing required fields |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Insufficient permissions for the requested action |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate entry (e.g., email already exists) |
| 500 | Server Error | Server-side error, check logs |

---

## License

This project is licensed under the ISC License.

---

## Testing Instruction Report

This report outlines the testing strategies, environment configuration, and execution steps for unit, integration, and performance testing.

### 1. Testing Environment Configuration

- **Database**: A dedicated test database `sustainable-products-test` is used to avoid data corruption in the development/production database.
- **Environment Variables**: Managed via `.env.test` file in the `backend` directory.
- **Tools**: 
  - **Jest**: Test runner and assertion library.
  - **Supertest**: Library for testing HTTP endpoints.

### 2. How to Run Unit Tests

Backend logic (utils, services) are covered by unit tests.
```bash
cd backend
npm test
```

### 3. Integration Testing Setup and Execution

Integration tests verify the communication between API endpoints and the database.
- **Setup**: Ensure MongoDB is running and `.env.test` has the correct `MONGODB_URL_TEST`.
- **Execution**: Run the integration test suite:
```bash
cd backend
node --experimental-vm-modules node_modules/jest/bin/jest.js
```

### 4. Performance Testing

Performance testing evaluates system responsiveness and stability under load.
- **Tool**: [Artillery](https://www.artillery.io/) or [Postman Runner](https://learning.postman.com/docs/collections/running-collections/intro-to-collection-runs/)
- **Setup**: 
  1. Install artillery: `npm install -g artillery`
  2. Create a test configuration file.
- **Execution**: Run a load test against the search endpoint:
```bash
artillery quick --count 10 -n 20 http://localhost:3000/api/products/search?q=bottle
```

---

## Support

For issues and questions, please contact the development team or create an issue in the repository.

---

**Last Updated:** 10 th April 2026
