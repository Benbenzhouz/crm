using MiniCRM.DTOs;

namespace MiniCRM.Services;

public interface ICustomerService
{
    Task<List<CustomerResponseDto>> GetAllAsync();
    Task<CustomerResponseDto?> GetByIdAsync(int id);
    Task<CustomerResponseDto> CreateAsync(CustomerCreateDto dto);
    Task<CustomerResponseDto?> UpdateAsync(int id, CustomerUpdateDto dto);
    Task<bool> DeleteAsync(int id);
}
