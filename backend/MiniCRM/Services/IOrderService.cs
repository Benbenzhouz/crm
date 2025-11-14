using MiniCRM.DTOs;

namespace MiniCRM.Services;

public interface IOrderService
{
    Task<List<OrderResponseDto>> GetAllAsync();
    Task<OrderResponseDto?> GetByIdAsync(int id);
    Task<OrderResponseDto> CreateAsync(OrderCreateDto dto);
    Task<bool> CancelAsync(int id);
}
