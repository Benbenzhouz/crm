using Microsoft.EntityFrameworkCore;
using MiniCRM.Data;
using MiniCRM.DTOs;
using MiniCRM.Models;

namespace MiniCRM.Services;

public class OrderService : IOrderService
{
    private readonly CrmDbContext _context;

    public OrderService(CrmDbContext context)
    {
        _context = context;
    }

    public async Task<List<OrderResponseDto>> GetAllAsync()
    {
        return await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderItems)
            .ThenInclude(i => i.Product)
            .Select(o => new OrderResponseDto
            {
                Id = o.Id,
                CustomerId = o.CustomerId,
                CustomerName = o.Customer != null ? o.Customer.Name : "",
                Status = o.Status.ToString(),
                TotalAmount = o.TotalAmount,
                CreatedAt = o.CreatedAt,
                Items = o.OrderItems.Select(i => new OrderItemResponseDto
                {
                    Id = i.Id,
                    ProductId = i.ProductId,
                    ProductName = i.Product != null ? i.Product.Name : "",
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    LineTotal = i.LineTotal
                }).ToList()
            })
            .ToListAsync();
    }

    public async Task<OrderResponseDto?> GetByIdAsync(int id)
    {
        var order = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderItems)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null) return null;

        return new OrderResponseDto
        {
            Id = order.Id,
            CustomerId = order.CustomerId,
            CustomerName = order.Customer?.Name ?? "",
            Status = order.Status.ToString(),
            TotalAmount = order.TotalAmount,
            CreatedAt = order.CreatedAt,
            Items = order.OrderItems.Select(i => new OrderItemResponseDto
            {
                Id = i.Id,
                ProductId = i.ProductId,
                ProductName = i.Product?.Name ?? "",
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                LineTotal = i.LineTotal
            }).ToList()
        };
    }

    public async Task<OrderResponseDto> CreateAsync(OrderCreateDto dto)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // Validate customer exists
            var customer = await _context.Customers.FindAsync(dto.CustomerId);
            if (customer == null)
                throw new Exception("Customer not found");

            // Create order
            var order = new Order
            {
                CustomerId = dto.CustomerId,
                Status = OrderStatus.New,
                CreatedAt = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            decimal totalAmount = 0;

            // Process order items and update stock
            foreach (var itemDto in dto.Items)
            {
                var product = await _context.Products.FindAsync(itemDto.ProductId);
                if (product == null)
                    throw new Exception($"Product {itemDto.ProductId} not found");

                if (product.CurrentStock < itemDto.Quantity)
                    throw new Exception($"Insufficient stock for product {product.Name}");

                // Deduct stock
                product.CurrentStock -= itemDto.Quantity;

                var lineTotal = product.UnitPrice * itemDto.Quantity;
                totalAmount += lineTotal;

                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = itemDto.ProductId,
                    Quantity = itemDto.Quantity,
                    UnitPrice = product.UnitPrice,
                    LineTotal = lineTotal
                };

                _context.OrderItems.Add(orderItem);
            }

            order.TotalAmount = totalAmount;
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            // Reload order with complete information
            return (await GetByIdAsync(order.Id))!;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<bool> CancelAsync(int id)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return false;
            if (order.Status == OrderStatus.Cancelled) return false;

            // Restore stock
            foreach (var item in order.OrderItems)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    product.CurrentStock += item.Quantity;
                }
            }

            order.Status = OrderStatus.Cancelled;
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return true;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}
