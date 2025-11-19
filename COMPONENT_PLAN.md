# Component Structure Plan

## Current Structure
```
pages/
├── Dashboard/
│   └── index.tsx (Main page)
├── Customers/
│   └── index.tsx (Main page)
├── Products/
│   └── index.tsx (Main page)
└── Orders/
    └── index.tsx (Main page)
```

## Recommended Component Split

### 1. Dashboard Components
```
pages/Dashboard/
├── index.tsx              (Main page - orchestration)
├── StatCard.tsx           (Statistics card component)
├── RecentOrders.tsx       (Recent orders list)
└── LowStockAlert.tsx      (Low stock alert list)
```

### 2. Customers Components
```
pages/Customers/
├── index.tsx              (Main page - orchestration)
├── CustomerForm.tsx       (Create/Edit form)
├── CustomerList.tsx       (Table with list)
└── CustomerRow.tsx        (Single table row)
```

### 3. Products Components
```
pages/Products/
├── index.tsx              (Main page - orchestration)
├── ProductForm.tsx        (Create/Edit form)
├── ProductList.tsx        (Table with list)
└── ProductRow.tsx         (Single table row)
```

### 4. Orders Components
```
pages/Orders/
├── index.tsx              (Main page - orchestration)
├── OrderForm.tsx          (Create order form)
├── OrderList.tsx          (List of orders)
├── OrderCard.tsx          (Single order card)
└── OrderItemRow.tsx       (Order item table row)
```

## Benefits
- Better code organization
- Easier testing
- Component reusability
- Clearer separation of concerns
- Easier maintenance

## Next Steps
Would you like me to:
1. Start with a specific page (Dashboard, Customers, Products, or Orders)?
2. Create all component files at once?
3. Implement one complete example first?
