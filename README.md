﻿# URL Shortener Backend

A robust and secure URL shortening service built with Node.js and Express.js. This backend service provides APIs for shortening URLs, managing user accounts, and tracking URL analytics.

## Features

- 🔗 URL shortening with custom aliases
- 👤 User authentication and authorization
- 📊 URL analytics and tracking



## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Joi

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Sandeep-Petwal/Shrinkr.git
cd Shrinkr
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add the following variables (see `.env.sample` for reference):
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
BASE_SHORT_URL=your_base_url
```

4. Start the development server:
```bash
npm start
```

## API Endpoints

The API is versioned and accessible under `/api/v1/`. Main endpoints include:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /url/shorten` - Create short URL
- `GET /url/:shortId` - Redirect to original URL
- `GET /url/analytics/:shortId` - Get URL analytics

## Security Features

- Rate limiting to prevent abuse
- CORS protection
- Input validation using Joi
- Secure password hashing with bcrypt
- JWT-based authentication
- Cookie-based session management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Sandeep Prasad

## Support

For support, please open an issue in the GitHub repository.
