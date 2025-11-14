using MiniCRM.Data;
using MiniCRM.Models;

namespace MiniCRM;

public static class DbInitializer
{
    public static void Initialize(CrmDbContext context)
    {
        context.Database.EnsureCreated();

        // Check if already seeded
        if (context.Customers.Any())
        {
            return;
        }

        // Seed Customers
        var customers = new Customer[]
        {
            new Customer { Name = "John Smith", Email = "john.smith@example.com", Phone = "+1-555-0101", CreatedAt = DateTime.UtcNow.AddDays(-10) },
            new Customer { Name = "Sarah Johnson", Email = "sarah.johnson@example.com", Phone = "+1-555-0102", CreatedAt = DateTime.UtcNow.AddDays(-8) },
            new Customer { Name = "Michael Brown", Email = "michael.brown@example.com", Phone = "+1-555-0103", CreatedAt = DateTime.UtcNow.AddDays(-5) }
        };
        context.Customers.AddRange(customers);
        context.SaveChanges();

        // Seed Products
        var products = new Product[]
        {
            new Product { Name = "Laptop Computer", Sku = "LAP-001", UnitPrice = 999.00m, CurrentStock = 50, CreatedAt = DateTime.UtcNow.AddDays(-15) },
            new Product { Name = "Wireless Mouse", Sku = "MOU-001", UnitPrice = 29.99m, CurrentStock = 200, CreatedAt = DateTime.UtcNow.AddDays(-12) },
            new Product { Name = "Mechanical Keyboard", Sku = "KEY-001", UnitPrice = 79.99m, CurrentStock = 100, CreatedAt = DateTime.UtcNow.AddDays(-10) },
            new Product { Name = "Monitor", Sku = "MON-001", UnitPrice = 299.00m, CurrentStock = 30, CreatedAt = DateTime.UtcNow.AddDays(-7) },
            new Product { Name = "USB-C Hub", Sku = "HUB-001", UnitPrice = 49.99m, CurrentStock = 80, CreatedAt = DateTime.UtcNow.AddDays(-5) }
        };
        context.Products.AddRange(products);
        context.SaveChanges();

        // Seed Orders
        var orders = new Order[]
        {
            new Order
            {
                CustomerId = customers[0].Id,
                Status = OrderStatus.Completed,
                CreatedAt = DateTime.UtcNow.AddDays(-3),
                OrderItems = new List<OrderItem>
                {
                    new OrderItem { ProductId = products[0].Id, Quantity = 2, UnitPrice = products[0].UnitPrice, LineTotal = 2 * products[0].UnitPrice },
                    new OrderItem { ProductId = products[1].Id, Quantity = 3, UnitPrice = products[1].UnitPrice, LineTotal = 3 * products[1].UnitPrice }
                }
            },
            new Order
            {
                CustomerId = customers[1].Id,
                Status = OrderStatus.New,
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                OrderItems = new List<OrderItem>
                {
                    new OrderItem { ProductId = products[2].Id, Quantity = 1, UnitPrice = products[2].UnitPrice, LineTotal = 1 * products[2].UnitPrice },
                    new OrderItem { ProductId = products[4].Id, Quantity = 2, UnitPrice = products[4].UnitPrice, LineTotal = 2 * products[4].UnitPrice }
                }
            }
        };

        foreach (var order in orders)
        {
            order.TotalAmount = order.OrderItems.Sum(oi => oi.LineTotal);
            context.Orders.Add(order);
        }
        
        context.SaveChanges();
    }
}
