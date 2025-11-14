using Microsoft.EntityFrameworkCore;
using MiniCRM.Data;
using MiniCRM.DTOs;
using MiniCRM.Models;

namespace MiniCRM.Services;

public class CustomerService : ICustomerService
{
    private readonly CrmDbContext _context;

    public CustomerService(CrmDbContext context)
    {
        _context = context;
    }

    public async Task<List<CustomerResponseDto>> GetAllAsync()
    {
        return await _context.Customers
            .Select(c => new CustomerResponseDto
            {
                Id = c.Id,
                Name = c.Name,
                Email = c.Email,
                Phone = c.Phone,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<CustomerResponseDto?> GetByIdAsync(int id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return null;

        return new CustomerResponseDto
        {
            Id = customer.Id,
            Name = customer.Name,
            Email = customer.Email,
            Phone = customer.Phone,
            CreatedAt = customer.CreatedAt
        };
    }

    public async Task<CustomerResponseDto> CreateAsync(CustomerCreateDto dto)
    {
        var customer = new Customer
        {
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone ?? string.Empty,
            CreatedAt = DateTime.UtcNow
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        return new CustomerResponseDto
        {
            Id = customer.Id,
            Name = customer.Name,
            Email = customer.Email,
            Phone = customer.Phone,
            CreatedAt = customer.CreatedAt
        };
    }

    public async Task<CustomerResponseDto?> UpdateAsync(int id, CustomerUpdateDto dto)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return null;

        customer.Name = dto.Name;
        customer.Email = dto.Email;
        customer.Phone = dto.Phone ?? string.Empty;

        await _context.SaveChangesAsync();

        return new CustomerResponseDto
        {
            Id = customer.Id,
            Name = customer.Name,
            Email = customer.Email,
            Phone = customer.Phone,
            CreatedAt = customer.CreatedAt
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return false;

        // Check if customer has any orders
        var hasOrders = await _context.Orders.AnyAsync(o => o.CustomerId == id);
        if (hasOrders)
        {
            throw new InvalidOperationException("Cannot delete customer with existing orders. Please cancel or delete the orders first.");
        }

        _context.Customers.Remove(customer);
        await _context.SaveChangesAsync();
        return true;
    }
}
