# Sustainable Product Rating Extension

SDG Goal: Responsible Consumption and Production (SDG 12)

Our app helps online shoppers make eco-friendly choices by rating products based on sustainability factors like materials, packaging, and ethical production. Each product gets an eco-score, guiding users to buy responsibly and support sustainable consumption.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
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
| POST | `/api/users/admin/getUserByEmail` | Get user by email | Admin only |
| GET | `/api/users/admin/getAllUsers` | Get all registered users | Admin only |

## 2. Product Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/products` | Create a new product with images | Admin only |
| GET | `/api/products` | Get all products (supports pagination) | Public |
| GET | `/api/products/search?q={query}` | Search products by name/brand/category | Public |
| GET | `/api/products/:id` | Get single product details | Public |
| PUT | `/api/products/:id` | Update product information | Admin only |
| DELETE | `/api/products/:id` | Delete a product | Admin only |

## 3. Review Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/reviews` | Create a product review | Customer only |
| GET | `/api/reviews/product/:productId` | Get approved reviews for a product | Public |
| GET | `/api/reviews/my-reviews` | Get current user's reviews | Customer |
| GET | `/api/reviews/pending` | Get all pending reviews | Admin only |
| PATCH | `/api/reviews/:id/approve` | Approve a pending review | Admin only |
| PATCH | `/api/reviews/:id/reject` | Reject a review with reason | Admin only |
| DELETE | `/api/reviews/:id` | Delete a review | Customer/Admin |

## 4. Blog Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/blogs` | Create new blog (PENDING status) | Required |
| GET | `/api/blogs` | Get all published blogs | Public |
| GET | `/api/blogs/:id` | Get blog by ID | Public/Required* |
| GET | `/api/blogs/admin/list` | Get all blogs (any status) | Admin only |
| PATCH | `/api/blogs/admin/:id/approve` | Approve and publish a blog | Admin only |
| PATCH | `/api/blogs/admin/:id/reject` | Reject a blog with reason | Admin only |
| POST | `/api/blogs/generate-education-guide` | Generate AI sustainability guide | Public |
| PUT | `/api/blogs/:id` | Update blog (legacy) | Admin only |
| DELETE | `/api/blogs/:id` | Delete blog (legacy) | Admin only |

*Public for published blogs, authentication required for pending/rejected blogs (author/admin only)

## 5. Comparison Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/comparisons/items` | Create AI-powered product comparison | Required |
| GET | `/api/comparisons/items` | Get user's comparison history | Required |
| GET | `/api/comparisons/items/:id` | Get comparison details | Required |
| GET | `/api/comparisons/quick?product1={name}&product2={name}` | Quick compare by product names | Public |
| GET | `/api/comparisons/stats` | Get comparison statistics | Admin only |
| PUT | `/api/comparisons/items/:id` | Update a comparison | Required |
| DELETE | `/api/comparisons/items/:id` | Delete a specific comparison | Required |
| DELETE | `/api/comparisons/items` | Clear user's comparison history | Required |

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

## Support

For issues and questions, please contact the development team or create an issue in the repository.


---

**Last Updated:** 27 th February 2026
