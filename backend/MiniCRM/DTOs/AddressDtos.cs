namespace MiniCRM.DTOs;

/// <summary>
/// Address data transfer object for API responses
/// </summary>
public class AddressDto
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Street { get; set; } = string.Empty;
    public string Suburb { get; set; } = string.Empty;
    public string Postcode { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
}

/// <summary>
/// Address create request DTO
/// </summary>
public class AddressCreateDto
{
    public int CustomerId { get; set; }
    public string Street { get; set; } = string.Empty;
    public string Suburb { get; set; } = string.Empty;
    public string Postcode { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
}

/// <summary>
/// Address update request DTO
/// </summary>
public class AddressUpdateDto
{
    public string Street { get; set; } = string.Empty;
    public string Suburb { get; set; } = string.Empty;
    public string Postcode { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
}
