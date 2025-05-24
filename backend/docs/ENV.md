# Environment Variables Documentation

This document describes all environment variables used in the KOLA Meals backend application.

## Required Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 5000 | No |
| `NODE_ENV` | Environment (development/production) | development | No |
| `DATABASE_URL` | Database connection string | - | Yes |

## Authentication

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | JWT secret key | - | Yes |
| `JWT_REFRESH_SECRET` | JWT refresh secret key | - | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration | 1h | No |
| `JWT_REFRESH_EXPIRES_IN` | JWT refresh token expiration | 7d | No |

## Google OAuth

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | - | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | - | Yes |
| `GOOGLE_CALLBACK_URL` | Google OAuth callback URL | http://localhost:3000/api/auth/google/callback | No |

## Payment Gateway (Cashfree)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `CASHFREE_APP_ID` | Cashfree app ID | - | Yes |
| `CASHFREE_SECRET_KEY` | Cashfree secret key | - | Yes |
| `CASHFREE_WEBHOOK_SECRET` | Cashfree webhook secret | - | Yes |

## Logging

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `LOG_LEVEL` | Log level (error/warn/info/debug) | info | No |

## Example .env File

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kola_meals"

# JWT
JWT_SECRET="your_jwt_secret"
JWT_REFRESH_SECRET="your_jwt_refresh_secret"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"

# Cashfree
CASHFREE_APP_ID="your_cashfree_app_id"
CASHFREE_SECRET_KEY="your_cashfree_secret_key"
CASHFREE_WEBHOOK_SECRET="your_cashfree_webhook_secret"

# Logging
LOG_LEVEL="info"
```

## Security Notes

1. Never commit the `.env` file to version control
2. Use strong, unique values for secrets in production
3. Regularly rotate sensitive credentials
4. Use different values for development and production environments
5. Consider using a secrets management service in production 