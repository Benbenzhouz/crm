
using System.Collections.Generic;
namespace MiniCRM.Models;

public class Order
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public int? AddressId { get; set; }
    public Address? Address { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.New;
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<OrderItem> OrderItems { get; set; } = new();
}

public enum OrderStatus
{
    New,
    Completed,
    Cancelled
}
