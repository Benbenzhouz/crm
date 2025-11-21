namespace MiniCRM.Models;

public class Address
{
    public int Id { get; set; }
    public int CustomerId { get; set; }   // Foreign key to Customer
    public string Street { get; set; } = string.Empty;    // Street address
    public string Suburb { get; set; } = string.Empty;    // Suburb/District
    public string Postcode { get; set; } = string.Empty;  // Postal code
    public string State { get; set; } = string.Empty;     // State/Province

    // Navigation property
    public Customer Customer { get; set; } = null!;
}
