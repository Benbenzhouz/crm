# Address-Design.md

## 1. Key Concept: Order does not “call” Address—it references it

In our design:

- Address is a table/entity that stores address records.
- Order is another table/entity that stores orders.
- The relationship is not method invocation like address.DoSomething(), but a foreign key reference:
- Order.AddressId points to a specific row in the Address table.

Example:

- Address table has rows: Id = 1, 2, 3 ...
- If an order has AddressId = 3, it means: This order uses the address with Id = 3.

## 2. How Address Model Appears in the Data Layer

**Address.cs**
```csharp
public class Address
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string Street { get; set; }
    public string Suburb { get; set; }
    public string Postcode { get; set; }
    public string State { get; set; }
    public Customer Customer { get; set; }
    public ICollection<Order> Orders { get; set; }
}
```

**Order.cs**
```csharp
public class Order
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public int? AddressId { get; set; } // reference to Address (optional)
    public Customer Customer { get; set; }
    public Address? Address { get; set; }
}
```

**EF Core Configuration — CrmDbContext.cs**
```csharp
modelBuilder.Entity<Order>()
    .HasOne(o => o.Address)
    .WithMany(a => a.Orders)
    .HasForeignKey(o => o.AddressId)
    .OnDelete(DeleteBehavior.Restrict);
```

Meaning:
- One order → one address (optional)
- One address → many orders
- Deleting an address does not cascade delete orders

This layer establishes how Address exists and how Order references it.

## 3. Full Business Flow: From Creating Addresses → Using Them in Orders

### Step 1: Create Addresses (Before Ordering)

Example API:
POST /api/customers/{customerId}/addresses

Payload:
```json
{
  "street": "1 George St",
  "suburb": "Sydney",
  "postcode": "2000",
  "state": "NSW"
}
```

Database afterwards:

| Table    | Sample Rows                |
|----------|---------------------------|
| Customer | Id = 1                    |
| Address  | Id = 10, CustomerId = 1   |
|          | Id = 11, CustomerId = 1   |

This prepares address options for order creation.

### Step 2: Using Address When Creating an Order

**Frontend Flow (React)**

- User selects a customer
- UI fetches only that customer’s addresses:

```js
useEffect(() => {
  if (!formData.customerId) return;
  addressApi.getByCustomer(formData.customerId).then(setAddresses);
  setFormData(prev => ({ ...prev, addressId: undefined }));
}, [formData.customerId]);
```

- Address dropdown shows addresses
- User selects address → formData.addressId is set
- Submit → validate addressId
- Send payload:

```json
{
  "customerId": 1,
  "addressId": 10,
  "items": [...]
}
```

At this stage, the address is just an integer ID, not full address details yet.

**Backend Flow (OrderService.cs)**

Controller receives payload:
```json
{
  "customerId": 1,
  "addressId": 10
}
```

Step 1: Validate Customer
```csharp
var customer = await _db.Customers.FindAsync(dto.CustomerId);
if (customer == null) throw new Exception("Customer not found");
```

Step 2: Validate Address Belongs to Customer
```csharp
Address? address = null;
if (dto.AddressId.HasValue)
{
    address = await _db.Addresses
        .FirstOrDefaultAsync(a => a.Id == dto.AddressId.Value
                               && a.CustomerId == dto.CustomerId);
    if (address == null)
        throw new InvalidOperationException(
            "Address not found or does not belong to the customer");
}
```

→ This is the exact place where Address model is used:
- _db.Addresses → querying the Address table
- Ensures data integrity + security

Step 3: Save to Order Entity
```csharp
var order = new Order
{
    CustomerId = dto.CustomerId,
    AddressId = dto.AddressId, // saved here
};
_db.Orders.Add(order);
await _db.SaveChangesAsync();
```

Step 4: Return Order DTO Including Address
```csharp
var created = await _db.Orders
    .Include(o => o.Address)
    .FirstOrDefaultAsync(o => o.Id == order.Id);

Mapped fields:
Street = created.Address?.Street;
```

## 4. Summary

- The Address model stores address data.
- When creating an order, the client submits addressId.
- The backend checks that the address exists and belongs to the customer, then stores AddressId in the order record.
- When retrieving an order, EF loads the related address via the foreign key.

## 5. End-to-End Data Path (High-Level)

Address.cs → stored in DB
        ↓
User selects customer
        ↓
Frontend loads customer’s addresses
        ↓
addressId sent in OrderCreateDto
        ↓
OrderService validates address ownership
        ↓
Order.AddressId = dto.AddressId
        ↓
Query order with Include(Address) to return full address info
