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

Base URL: `http://localhost:3000/`

### Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Status Codes Reference
| Status Code | Meaning |
|-------------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request body or missing fields |
| 401 | Unauthorized - Missing or invalid JWT token |
| 403 | Forbidden - Insufficient permissions or access denied |
| 404 | Not Found - Resource does not exist |
| 409 | Conflict - Duplicate entry (e.g., email already exists) |
| 500 | Server Error - Internal server error |

---

## 1. User Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/users/register` | Register a new user account | Public |
| POST | `/api/users/login` | Login and receive JWT token | Public |
| POST | `/api/users/google-login` | Login using Google OAuth | Public |
| GET | `/api/users/getUser` | Get current user profile | Required |
| POST | `/api/users/send-otp` | Send OTP to user email | Required |
| POST | `/api/users/verify-otp` | Verify email with OTP | Required |
| POST | `/api/users/admin/getUserByEmail` | Get user by email (Admin only) | Admin |
| GET | `/api/users/admin/getAllUsers` | Get all users (Admin only) | Admin |
| PATCH | `/api/users/admin/block-user/:email` | Block/unblock user (Admin only) | Admin |

#### Example 1: User Registration
**POST** `/api/users/register`
- **Request Body**:
```json
{
  "firstName": "Sahan",
  "lastName": "Perera",
  "email": "sahan@example.com",
  "password": "Password123!",
  "phone": "0771234567",
  "role": "Customer"
}
```
- **Response (201 Created)**:
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "65e7a1b2c3d4e5f6g7h8i9j0",
    "firstName": "Sahan",
    "lastName": "Perera",
    "email": "sahan@example.com",
    "role": "Customer",
    "emailVerified": false
  }
}
```

#### Example 2: User Login
**POST** `/api/users/login`
- **Request Body**:
```json
{
  "email": "sahan@example.com",
  "password": "Password123!"
}
```
- **Response (200 OK)**:
```json
{
  "message": "Login Successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65e7a1b2c3d4e5f6g7h8i9j0",
    "firstName": "Sahan",
    "email": "sahan@example.com",
    "role": "Customer"
  }
}
```

#### Example 3: Get Current User
**GET** `/api/users/getUser`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "user": {
    "_id": "65e7a1b2c3d4e5f6g7h8i9j0",
    "firstName": "Sahan",
    "email": "sahan@example.com",
    "role": "Customer",
    "emailVerified": true,
    "isBlocked": false
  }
}
```

#### Example 4: Send OTP
**POST** `/api/users/send-otp`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Request Body**: (empty)
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "OTP sent to email successfully"
}
```

#### Example 5: Verify OTP
**POST** `/api/users/verify-otp`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Request Body**:
```json
{
  "otp": "123456"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Email verified successfully",
  "user": { "emailVerified": true }
}
```

---

## 2. Product Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/products` | Create a new product with images | Public (no auth required) |
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/search?name=keyword` | Search products by name | Public |
| GET | `/api/products/top` | Get top-rated products | Public |
| GET | `/api/products/:id` | Get single product details | Public |
| PUT | `/api/products/:id` | Update product (Admin only) | Admin |
| DELETE | `/api/products/:id` | Delete product (Admin only) | Admin |

#### Example 1: Create Product
**POST** `/api/products` (Multipart/Form-Data)
- **Fields**:
  - `name` (string, required): Product name
  - `brand` (string, required): Brand name
  - `category` (string, required): Product category
  - `description` (string, required): Product description
  - `sustainability` (JSON string, required): Sustainability factors
  - `images` (files, max 5): Product images
- **Request Body Example**:
```
name: Eco Water Bottle
brand: EcoFlow
category: Household
description: Sustainable water bottle made from recycled materials
sustainability: {"materials": "80", "packaging": "75", "production": "85"}
images: [file1.jpg, file2.jpg]
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "65e7a1b2c3d4e5f6g7h8i9j0",
    "name": "Eco Water Bottle",
    "brand": "EcoFlow",
    "category": "Household",
    "sustainabilityScore": 80,
    "images": ["https://cloudinary.com/image1.jpg"],
    "rating": 0,
    "reviewCount": 0
  }
}
```

#### Example 2: Get All Products
**GET** `/api/products`
- **Query Parameters** (optional):
  - `limit`: Number of products per page
  - `page`: Page number
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "_id": "65e7a1b2c3d4e5f6g7h8i9j0",
      "name": "Eco Water Bottle",
      "brand": "EcoFlow",
      "sustainabilityScore": 80,
      "rating": 4.5,
      "reviewCount": 12
    }
  ]
}
```

#### Example 3: Search Products
**GET** `/api/products/search?name=bottle`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Found 5 product(s) matching \"bottle\"",
  "count": 5,
  "data": [
    {
      "_id": "65e7a1b2c3d4e5f6g7h8i9j0",
      "name": "Eco Water Bottle",
      "sustainabilityScore": 80
    }
  ]
}
```

#### Example 4: Get Top Products
**GET** `/api/products/top`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Top products retrieved successfully",
  "data": [
    {
      "_id": "65e7a1b2c3d4e5f6g7h8i9j0",
      "name": "Eco Water Bottle",
      "sustainabilityScore": 95,
      "rating": 4.8
    }
  ]
}
```

#### Example 5: Get Single Product
**GET** `/api/products/:id`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "_id": "65e7a1b2c3d4e5f6g7h8i9j0",
    "name": "Eco Water Bottle",
    "brand": "EcoFlow",
    "category": "Household",
    "description": "Sustainable water bottle made from recycled materials",
    "sustainabilityScore": 80,
    "images": ["https://cloudinary.com/image1.jpg"],
    "rating": 4.5,
    "reviewCount": 12,
    "sustainability": {
      "materials": "80",
      "packaging": "75",
      "production": "85"
    }
  }
}
```

#### Example 6: Update Product (Admin Only)
**PUT** `/api/products/:id` (Multipart/Form-Data)
- **Headers**: `Authorization: Bearer <admin_jwt_token>`
- **Fields**: Same as create product (all optional)
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": { "name": "Updated Product Name", ... }
}
```

#### Example 7: Delete Product (Admin Only)
**DELETE** `/api/products/:id`
- **Headers**: `Authorization: Bearer <admin_jwt_token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 3. Review Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/reviews` | Create a product review | Customer |
| GET | `/api/reviews/product/:productId` | Get approved reviews for a product | Public |
| GET | `/api/reviews/my-reviews` | Get all reviews by logged-in user | Required |
| GET | `/api/reviews/pending` | Get pending reviews (Admin only) | Admin |
| GET | `/api/reviews/recent` | Get recent approved reviews globally | Public |
| PATCH | `/api/reviews/:id/approve` | Approve a review (Admin only) | Admin |
| PATCH | `/api/reviews/:id/reject` | Reject a review (Admin only) | Admin |
| DELETE | `/api/reviews/:id` | Delete a review | Customer/Admin |

#### Example 1: Create Review
**POST** `/api/reviews`
- **Headers**: `Authorization: Bearer <customer_jwt_token>`
- **Request Body**:
```json
{
  "productId": "65e7a1b2c3d4e5f6g7h8i9j0",
  "rating": 5,
  "comment": "Excellent sustainable product! Great quality and eco-friendly."
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Review submitted and approved",
  "data": {
    "_id": "65e7a2b2c3d4e5f6g7h8i9j1",
    "productId": "65e7a1b2c3d4e5f6g7h8i9j0",
    "userId": "65e7a0b2c3d4e5f6g7h8i9j0",
    "rating": 5,
    "comment": "Excellent sustainable product!",
    "status": "APPROVED",
    "createdAt": "2024-04-12T10:30:00Z"
  }
}
```

#### Example 2: Get Approved Reviews for Product
**GET** `/api/reviews/product/:productId`
- **Response (200 OK)**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "65e7a2b2c3d4e5f6g7h8i9j1",
      "userId": "65e7a0b2c3d4e5f6g7h8i9j0",
      "rating": 5,
      "comment": "Excellent sustainable product!",
      "status": "APPROVED",
      "createdAt": "2024-04-12T10:30:00Z"
    }
  ]
}
```

#### Example 3: Get My Reviews
**GET** `/api/reviews/my-reviews`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "65e7a2b2c3d4e5f6g7h8i9j1",
      "productId": "65e7a1b2c3d4e5f6g7h8i9j0",
      "rating": 5,
      "comment": "Excellent product",
      "status": "APPROVED"
    },
    {
      "_id": "65e7a2b2c3d4e5f6g7h8i9j2",
      "productId": "65e7a1b2c3d4e5f6g7h8i9j1",
      "rating": 3,
      "comment": "Average",
      "status": "REJECTED",
      "rejectionReason": "Contains inappropriate language"
    }
  ]
}
```

#### Example 4: Get Pending Reviews (Admin Only)
**GET** `/api/reviews/pending`
- **Headers**: `Authorization: Bearer <admin_jwt_token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "65e7a2b2c3d4e5f6g7h8i9j3",
      "productId": "65e7a1b2c3d4e5f6g7h8i9j0",
      "userId": "65e7a0b2c3d4e5f6g7h8i9j0",
      "rating": 4,
      "comment": "Good product",
      "status": "PENDING",
      "createdAt": "2024-04-12T11:00:00Z"
    }
  ]
}
```

#### Example 5: Approve Review (Admin Only)
**PATCH** `/api/reviews/:id/approve`
- **Headers**: `Authorization: Bearer <admin_jwt_token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Review approved successfully",
  "data": { "status": "APPROVED" }
}
```

#### Example 6: Reject Review (Admin Only)
**PATCH** `/api/reviews/:id/reject`
- **Headers**: `Authorization: Bearer <admin_jwt_token>`
- **Request Body**:
```json
{
  "rejectionReason": "Contains inappropriate language"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Review rejected successfully",
  "data": { "status": "REJECTED", "rejectionReason": "Contains inappropriate language" }
}
```

#### Example 7: Delete Review
**DELETE** `/api/reviews/:id`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

---

## 4. Blog Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/blogs` | Create a new blog post | Required |
| GET | `/api/blogs` | Get all published blogs | Public |
| GET | `/api/blogs/:id` | Get single blog post | Public/Auth |
| GET | `/api/blogs/my-blogs` | Get current user's all blogs | Required |
| GET | `/api/blogs/admin/list` | Get all blogs for moderation (Admin only) | Admin |
| PATCH | `/api/blogs/admin/:id/approve` | Approve a blog (Admin only) | Admin |
| PATCH | `/api/blogs/admin/:id/reject` | Reject a blog (Admin only) | Admin |
| POST | `/api/blogs/generate-education-guide` | Generate an education guide using AI | Public |
| GET | `/api/blogs/admin/test-ai` | Test AI connection (Admin only) | Admin |
| POST | `/api/blogs/:id/like` | Like a blog post | Required |
| POST | `/api/blogs/:id/unlike` | Unlike a blog post | Required |
| PUT | `/api/blogs/:id` | Update blog (Admin only) | Admin |
| DELETE | `/api/blogs/:id` | Delete blog (Admin only) | Admin |

#### Example 1: Create Blog Post
**POST** `/api/blogs` (Multipart/Form-Data)
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Fields**:
  - `title` (string, required): Blog title
  - `content` (string, required): Blog content
  - `category` (string, required): Blog category
  - `tags` (array, optional): Tags for the blog
  - `images` (files, optional): Blog images
- **Request Body Example**:
```
title: Sustainable Living Guide
content: Learn how to reduce your carbon footprint...
category: Lifestyle
tags: sustainability, eco-friendly, tips
images: [file1.jpg]
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Blog created successfully",
  "blog": {
    "_id": "65e7a3b2c3d4e5f6g7h8i9j0",
    "title": "Sustainable Living Guide",
    "content": "Learn how to reduce your carbon footprint...",
    "category": "Lifestyle",
    "tags": ["sustainability", "eco-friendly", "tips"],
    "author": "65e7a0b2c3d4e5f6g7h8i9j0",
    "status": "PENDING",
    "likes": 0,
    "createdAt": "2024-04-12T10:30:00Z"
  }
}
```

#### Example 2: Get All Published Blogs
**GET** `/api/blogs?page=1&limit=10&category=Lifestyle`
- **Query Parameters** (optional):
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `category`: Filter by category
  - `search`: Search blogs by title
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "65e7a3b2c3d4e5f6g7h8i9j0",
      "title": "Sustainable Living Guide",
      "content": "Learn how to reduce your carbon footprint...",
      "category": "Lifestyle",
      "author": { "firstName": "Sahan", "email": "sahan@example.com" },
      "status": "PUBLISHED",
      "likes": 25,
      "createdAt": "2024-04-12T10:30:00Z"
    }
  ],
  "page": 1,
  "pages": 5
}
```

#### Example 3: Get Single Blog
**GET** `/api/blogs/:id`
- **Response (200 OK)**:
```json
{
  "blog": {
    "_id": "65e7a3b2c3d4e5f6g7h8i9j0",
    "title": "Sustainable Living Guide",
    "content": "Learn how to reduce your carbon footprint...",
    "category": "Lifestyle",
    "tags": ["sustainability", "eco-friendly"],
    "author": { "firstName": "Sahan", "email": "sahan@example.com" },
    "status": "PUBLISHED",
    "likes": 25,
    "images": ["https://cloudinary.com/image1.jpg"],
    "createdAt": "2024-04-12T10:30:00Z"
  }
}
```

#### Example 4: Get My Blogs
**GET** `/api/blogs/my-blogs`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "blogs": [
    {
      "_id": "65e7a3b2c3d4e5f6g7h8i9j0",
      "title": "Sustainable Living Guide",
      "status": "PUBLISHED",
      "likes": 25
    },
    {
      "_id": "65e7a3b2c3d4e5f6g7h8i9j1",
      "title": "Eco-Friendly Products",
      "status": "PENDING",
      "likes": 0
    }
  ]
}
```

#### Example 5: Get All Blogs for Moderation (Admin Only)
**GET** `/api/blogs/admin/list`
- **Headers**: `Authorization: Bearer <admin_jwt_token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "65e7a3b2c3d4e5f6g7h8i9j1",
      "title": "Eco-Friendly Products",
      "author": { "firstName": "John", "email": "john@example.com" },
      "status": "PENDING",
      "createdAt": "2024-04-12T11:00:00Z"
    }
  ]
}
```

#### Example 6: Approve Blog (Admin Only)
**PATCH** `/api/blogs/admin/:id/approve`
- **Headers**: `Authorization: Bearer <admin_jwt_token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Blog approved successfully",
  "blog": { "status": "PUBLISHED" }
}
```

#### Example 7: Reject Blog (Admin Only)
**PATCH** `/api/blogs/admin/:id/reject`
- **Headers**: `Authorization: Bearer <admin_jwt_token>`
- **Request Body**:
```json
{
  "rejectionReason": "Content needs revision"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Blog rejected successfully",
  "blog": { "status": "REJECTED", "rejectionReason": "Content needs revision" }
}
```

#### Example 8: Generate Education Guide (AI-Powered)
**POST** `/api/blogs/generate-education-guide`
- **Request Body**:
```json
{
  "topic": "Sustainable Fashion",
  "targetAudience": "General"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Education guide generated successfully",
  "guide": {
    "title": "Sustainable Fashion Guide",
    "content": "...generated AI content...",
    "generatedAt": "2024-04-12T12:00:00Z"
  }
}
```

#### Example 9: Like a Blog
**POST** `/api/blogs/:id/like`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Blog liked successfully",
  "likes": 26
}
```

#### Example 10: Unlike a Blog
**POST** `/api/blogs/:id/unlike`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Blog unliked successfully",
  "likes": 25
}
```

---

## 5. Product Comparison Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/comparisons/items` | Compare two products | Optional |
| GET | `/api/comparisons/items` | Get user's comparison history | Required |
| GET | `/api/comparisons/items/:id` | Get single comparison by ID | Required |
| PUT | `/api/comparisons/items/:id` | Update a comparison | Required |
| DELETE | `/api/comparisons/items/:id` | Delete a comparison | Required |
| DELETE | `/api/comparisons/items` | Clear user's comparison history | Required |
| GET | `/api/comparisons/quick` | Quick compare by product name | Public |
| GET | `/api/comparisons/stats` | Get comparison statistics (Admin only) | Admin |

#### Example 1: Compare Two Products
**POST** `/api/comparisons/items`
- **Headers**: `Authorization: Bearer <jwt_token>` (optional)
- **Request Body**:
```json
{
  "productId1": "65e7a1b2c3d4e5f6g7h8i9j0",
  "productId2": "65e7a1b2c3d4e5f6g7h8i9j1"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "_id": "65e7a4b2c3d4e5f6g7h8i9j0",
    "products": [
      {
        "_id": "65e7a1b2c3d4e5f6g7h8i9j0",
        "name": "Eco Bottle A",
        "sustainabilityScore": 85,
        "rating": 4.5,
        "reviewCount": 12
      },
      {
        "_id": "65e7a1b2c3d4e5f6g7h8i9j1",
        "name": "Eco Bottle B",
        "sustainabilityScore": 80,
        "rating": 4.2,
        "reviewCount": 8
      }
    ],
    "comparisonScore": {
      "product1Score": 85,
      "product2Score": 80,
      "winner": "65e7a1b2c3d4e5f6g7h8i9j0",
      "scoreDifference": 5
    }
  }
}
```

#### Example 2: Get Comparison History
**GET** `/api/comparisons/items`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "65e7a4b2c3d4e5f6g7h8i9j0",
      "product1": { "name": "Eco Bottle A", "sustainabilityScore": 85 },
      "product2": { "name": "Eco Bottle B", "sustainabilityScore": 80 },
      "createdAt": "2024-04-12T10:30:00Z"
    }
  ]
}
```

#### Example 3: Get Single Comparison
**GET** `/api/comparisons/items/:id`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "_id": "65e7a4b2c3d4e5f6g7h8i9j0",
    "products": [
      { "name": "Eco Bottle A", "sustainabilityScore": 85 },
      { "name": "Eco Bottle B", "sustainabilityScore": 80 }
    ],
    "comparisonScore": {
      "product1Score": 85,
      "product2Score": 80,
      "winner": "65e7a1b2c3d4e5f6g7h8i9j0",
      "scoreDifference": 5
    }
  }
}
```

#### Example 4: Update Comparison
**PUT** `/api/comparisons/items/:id`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Request Body**:
```json
{
  "productId1": "65e7a1b2c3d4e5f6g7h8i9j2",
  "productId2": "65e7a1b2c3d4e5f6g7h8i9j3"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Comparison updated successfully",
  "data": { ... }
}
```

#### Example 5: Delete Comparison
**DELETE** `/api/comparisons/items/:id`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Comparison deleted successfully"
}
```

#### Example 6: Clear Comparison History
**DELETE** `/api/comparisons/items`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Comparison history cleared successfully"
}
```

#### Example 7: Quick Compare by Name
**GET** `/api/comparisons/quick?productName1=Bottle&productName2=Bag`
- **Query Parameters**:
  - `productName1`: First product name
  - `productName2`: Second product name
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "products": [...],
    "comparisonScore": {...}
  }
}
```

#### Example 8: Get Comparison Statistics (Admin Only)
**GET** `/api/comparisons/stats`
- **Headers**: `Authorization: Bearer <admin_jwt_token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "totalComparisons": 150,
    "mostComparedProducts": [
      { "product": "Eco Bottle", "comparisons": 25 }
    ],
    "averageComparisonScoreDifference": 12.5
  }
}
```

---

---

## Deployment Documentation

This section provides details on the deployment platforms, setup steps, and environment configuration for both the backend and frontend.

### 1. Backend Deployment

- **Platform**: [Render](https://render.com)
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

- **Deployed Backend API**: [https://sustainable-product-rating-extension.onrender.com](https://sustainable-product-rating-extension.onrender.com)
- **Deployed Frontend Application**: [https://greenvy.vercel.app](https://greenvy.vercel.app)

### 4. Deployment Evidence

| Evidence Type | Description | Placeholder |
| ------------- | ----------- | ----------- |
| **Backend Deployment** | Successful API startup | ![Backend Evidence](https://github.com/sahan200272/sustainable-product-rating-extension/blob/f39ce15bebdc6b51eda5bc065887cd9c31bb3396/Screenshot%202026-04-09%20003029.png) |
| **Frontend Deployment** | Successful UI build | ![Frontend Evidence](https://github.com/sahan200272/sustainable-product-rating-extension/blob/f39ce15bebdc6b51eda5bc065887cd9c31bb3396/Screenshot%202026-04-09%20002933.png) |

---

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URL=mongodb+srv://sahan:sah123@cluster0.xlngcrh.mongodb.net/
MONGODB_URL_TEST=mongodb+srv://sahan:sah123@cluster0.xlngcrh.mongodb.net/test

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

`

This report outlines the testing strategies, environment configuration, and execution steps for unit, integration, and performance testing, demonstrating comprehensive testing required for Evaluation 02.

### 1. Testing Environment Configuration

- **Database**: A dedicated test database (`sustainable-products-test`) is used to avoid data corruption in the main database.
- **Environment Variables**: Managed via `.env.test` file in the `backend` directory.
- **Frameworks Used**: 
  - **Jest**: Test runner, assertion library, and mocking.
  - **Supertest**: Assertions for integration testing the API endpoints via an in-memory application instance.
  - **Artillery**: Load and stress-testing tool to simulate multiple virtual users.

### 2. How to Run Unit Tests

Backend logic (utils, services) are covered by unit tests.
```bash
cd backend
npm test -- testPathPattern=unit
```

### 3. How to Run Integration Tests

Integration tests verify the synchronization between the Express API routes, controllers, services, and the live test MongoDB instance.
- **Setup**: Ensure MongoDB is running and `.env.test` has the correct `MONGODB_URL_TEST`.
- **Execution**: Run the integration test suite:
```bash
cd backend
npm test -- testPathPattern=integration
```

### 4. How to Run Performance Tests

Performance testing evaluates API system responsiveness, latency, and throughput under heavy concurrent load (stressing the server).
- **Execution**: Utilizing the pre-configured `reviews.perf.yml` scenario file, Artillery simulates a spike of up to 50 virtual users.
```bash
cd backend
npx artillery run src/tests/performance/reviews.perf.yml
```

---

## Support

For issues and questions, please contact the development team or create an issue in the repository.

---

**Last Updated:** 10 th April 2026
