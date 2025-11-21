using MiniCRM.DTOs;

namespace MiniCRM.Services;

/// <summary>
/// Address service interface defining business operations
/// </summary>
public interface IAddressService
{
    /// <summary>
    /// Get all addresses
    /// </summary>
    Task<IEnumerable<AddressDto>> GetAllAsync();
    
    /// <summary>
    /// Get address by ID
    /// </summary>
    Task<AddressDto?> GetByIdAsync(int id);
    
    /// <summary>
    /// Get addresses by customer ID
    /// </summary>
    Task<IEnumerable<AddressDto>> GetByCustomerIdAsync(int customerId);
    
    /// <summary>
    /// Create new address
    /// </summary>
    Task<AddressDto> CreateAsync(AddressCreateDto dto);
    
    /// <summary>
    /// Update existing address
    /// </summary>
    Task<AddressDto?> UpdateAsync(int id, AddressUpdateDto dto);
    
    /// <summary>
    /// Delete address
    /// </summary>
    Task<bool> DeleteAsync(int id);
}
