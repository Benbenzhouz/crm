using MiniCRM.DTOs;

namespace MiniCRM.Services;

public interface IOrderService
{
    Task<List<OrderResponseDto>> GetAllAsync();
    Task<OrderResponseDto?> GetByIdAsync(int id);
    Task<OrderResponseDto> CreateAsync(OrderCreateDto dto);
    Task<bool> CancelAsync(int id);
    Task<bool> CompleteAsync(int id);
}
