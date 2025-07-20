# 📁 File Uploads API

This project is a backend API for managing file uploads by authenticated users, built with NestJS, PostgreSQL, and AWS S3. Deployment with AWS CDK.

## 🚀 Getting Started

## ⚙️ Environment Configuration

Create a .env file based on the provided .env.example.

IMPORTANT:

You will need valid AWS credentials and an existing S3 bucket, as uploaded files are stored directly in AWS S3.

Although it would have been possible to use LocalStack to simulate an S3 bucket locally via docker-compose, this approach was ultimately avoided to focus on the core functionality of the API without additional complexity and for another side using a real private AWS S3 bucket better demonstrates the ability to generate and serve secure, time-limited pre-signed URLs, allowing for controlled access to private files as would happen in production.

As such, the current setup uses a real AWS S3 bucket, even in development. Make sure to configure your .env file with valid AWS credentials and an existing bucket name.

## Run the application locally:

```bash

docker-compose up --build

```

## 📚 API Documentation

The API documentation is available at:
http://localhost:3000/api

## 🔐 Authentication

1- Register a new user with email ,password, name and surname.

POST /auth/register

2- Log in to obtain a JWT token. Use the JWT token to access protected routes by including it in the Authorization header as a Bearer token.

POST /auth/login

Use the token in the Authorization header: Authorization: Bearer <your-token>

## 🔒 Protected Endpoints

- POST /files — upload a file
- GET /files/:id/download — download a file (also increments the view count)

## 🧪 Testing

For simplicity, a few unit tests have been added focusing on the FilesService.

Run the tests with:

```bash
npm run test
```

## ☁️ Deployment

This project was deployed using AWS CDK (https://github.com/arieltano92/file-upload-api-cdk) which provisions:

ECS (Fargate) to run the backend container

RDS (PostgreSQL) for data persistence

S3 for file storage

## 📝 Notes

Dockerized with docker-compose for local development

Files are uploaded directly to S3 (no local file storage)

JWT-based authentication is implemented

Only minimal unit tests are included

SSL for the API was not implemented due to time constraints and scope simplicity.
