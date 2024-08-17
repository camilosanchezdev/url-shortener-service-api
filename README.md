
# URL Shortener Service API

This repository contains the API for the URL Shortener Service, built with Node.js using the NestJS framework. The API handles user authentication, URL management, role-based access control, and provides secure endpoints for managing short URLs.

## Table of Contents

- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Usage](#usage)
- [Features](#features)
- [License](#license)

## Technologies

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: JWT, Passport, bcryptjs
- **Validation**: class-transformer, class-validator
- **API Documentation**: [Swagger](https://swagger.io/)

## Project Structure

```plaintext
prisma/                   # Prisma migrations, seed and schema
├── migrations/           # Database migrations
src/
├── common/               # Common/shared resources
│   ├── decorators/       # Custom decorators
│   ├── dtos/             # Shared DTOs
│   ├── enums/            # Enums used across the application
│   ├── services/         # Shared services
│   ├── types/            # Shared TypeScript types
│   └── utils/            # Utility functions
├── modules/              # Application modules
│   ├── auth/             # Authentication module
│   │   ├── decorators/   # Auth-specific decorators
│   │   ├── dtos/         # Auth-related DTOs
│   │   ├── guards/       # Auth guards for route protection
│   │   ├── strategies/   # Passport strategies
│   │   └── types/        # Auth-related types
│   ├── roles/            # Roles management module
│   │   ├── dtos/         # Role-related DTOs
│   ├── urls/             # URL management module
│   │   ├── dtos/         # URL-related DTOs
│   ├── users/            # User management module
│   │   ├── dtos/         # User-related DTOs
```
## Frontend

[Frontend Repository](https://github.com/camilosanchezdev/url-shortener-service)

## Setup

To set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/camilosanchezdev/url-shortener-service-api.git
   cd url-shortener-service-api
   ```

2. Install the dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up the PostgreSQL database and configure the connection string in the `.env` file:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/database_name
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Run the Prisma migrations to set up the database schema:
   ```bash
   npx prisma migrate dev
   ```

5. Run the Prisma seed to add user's roles:
   ```bash
   npx prisma db seed
   ```
   
6. Start the development server:
   ```bash
   npm run start:dev
   # or
   yarn start:dev
   ```

7. Access the API documentation via Swagger at [http://localhost:5000/docs](http://localhost:5000/docs).

## Usage

- **Authentication**: Use JWT for secure authentication. Access tokens are required for protected routes.
- **Role Management**: Manage user roles and permissions.
- **URL Management**: Create, update, delete, and retrieve short URLs.

## Features

- **JWT Authentication**: Securely authenticate users with JSON Web Tokens.
- **Role-Based Access Control**: Define and enforce user roles and permissions.
- **API Documentation**: Automatically generated API documentation using Swagger.
- **Database Migrations**: Manage database schema with Prisma migrations.

## License

This project is licensed under the MIT License.
