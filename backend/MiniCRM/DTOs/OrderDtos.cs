namespace MiniCRM.DTOs;

public class OrderItemCreateDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}

public class OrderCreateDto
{
    public int CustomerId { get; set; }
    public List<OrderItemCreateDto> Items { get; set; } = new();
}

public class OrderItemResponseDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal LineTotal { get; set; }
}

public class OrderResponseDto
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<OrderItemResponseDto> Items { get; set; } = new();
}
