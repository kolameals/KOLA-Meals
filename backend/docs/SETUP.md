# KOLA Meals Backend Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- Redis (v6 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/kola-meals.git
cd kola-meals/backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the variables with your configuration

4. Set up the database:
```bash
# Create database
createdb kola_meals

# Run migrations
npx prisma migrate dev
```

5. Start Redis server:
```bash
redis-server
```

6. Start the development server:
```bash
npm run dev
```

## Development

### Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build the project
- `npm start`: Start production server
- `npm run lint`: Run ESLint
- `npm run test`: Run tests
- `npm run prisma:generate`: Generate Prisma client
- `npm run prisma:migrate`: Run database migrations

### Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types
│   ├── app.ts          # Express app setup
│   └── index.ts        # Entry point
├── prisma/
│   └── schema.prisma   # Database schema
├── docs/              # Documentation
└── tests/             # Test files
```

### Database Management

1. Generate Prisma client:
```bash
npx prisma generate
```

2. Create a migration:
```bash
npx prisma migrate dev --name <migration_name>
```

3. Reset database:
```bash
npx prisma migrate reset
```

4. View database:
```bash
npx prisma studio
```

## Testing

1. Run tests:
```bash
npm test
```

2. Run tests with coverage:
```bash
npm run test:coverage
```

## Deployment

1. Build the project:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## API Documentation

Access the API documentation at:
- Development: `http://localhost:5000/api-docs`
- Production: `https://api.kolameals.com/api-docs`

## Troubleshooting

### Common Issues

1. Database connection errors:
   - Check PostgreSQL service is running
   - Verify DATABASE_URL in .env
   - Ensure database exists

2. Redis connection errors:
   - Check Redis service is running
   - Verify REDIS_URL in .env

3. Port conflicts:
   - Change PORT in .env
   - Kill process using the port

### Getting Help

- Check the [issues page](https://github.com/your-username/kola-meals/issues)
- Contact support at support@kolameals.com 