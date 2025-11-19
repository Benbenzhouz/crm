# Mini CRM System

A full-stack CRM system for interview demonstration.

**Tech Stack:**
- Backend: .NET 8 Web API + SQLite + Entity Framework Core
- Frontend: React 19 + TypeScript + Vite

## Features

- **Customer Management** - CRUD operations with validation
- **Product Management** - Stock and price tracking
- **Order Management** - Multi-item orders with stock management
- **Dashboard** - Statistics, recent orders, low stock alerts

## How to Run

### Prerequisites
- .NET 8 SDK
- Node.js (v18+)

### Backend

```bash
cd backend/MiniCRM
dotnet restore
dotnet build
dotnet run
```

Backend will run on **http://localhost:5115**
- API: http://localhost:5115/api
- Swagger: http://localhost:5115/swagger

The SQLite database (`crm.db`) will be auto-created with sample data on first run.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on **http://localhost:5173**

## Project Structure

```
CRM-Davcor/
├── backend/MiniCRM/
│   ├── Controllers/       # API endpoints
│   ├── Services/          # Business logic
│   ├── Models/            # Domain entities
│   ├── DTOs/              # Data transfer objects
│   ├── Data/              # Database context
│   └── Program.cs
│
└── frontend/src/
    ├── pages/             # Main pages (Dashboard, Customers, Products, Orders)
    ├── components/        # Shared components (Toast)
    ├── hooks/             # Custom hooks
    ├── api.ts             # API client
    └── types.ts           # TypeScript types
```

## Notes

- Database auto-creates with sample data (3 customers, 5 products, 2 orders)
- CORS enabled for development
- Frontend uses modular component architecture with service layers
