namespace MiniCRM.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int CurrentStock { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
