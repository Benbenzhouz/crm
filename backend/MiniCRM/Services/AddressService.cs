using Microsoft.EntityFrameworkCore;
using MiniCRM.Data;
using MiniCRM.DTOs;
using MiniCRM.Models;

namespace MiniCRM.Services;

/// <summary>
/// Address service implementation for business logic
/// </summary>
public class AddressService : IAddressService
{
    private readonly CrmDbContext _context;

    public AddressService(CrmDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all addresses with customer information
    /// </summary>
    public async Task<IEnumerable<AddressDto>> GetAllAsync()
    {
        return await _context.Addresses
            .Include(a => a.Customer)
            .Select(a => new AddressDto
            {
                Id = a.Id,
                CustomerId = a.CustomerId,
                CustomerName = a.Customer.Name,
                Street = a.Street,
                Suburb = a.Suburb,
                Postcode = a.Postcode,
                State = a.State
            })
            .ToListAsync();
    }

    /// <summary>
    /// Get address by ID
    /// </summary>
    public async Task<AddressDto?> GetByIdAsync(int id)
    {
        var address = await _context.Addresses
            .Include(a => a.Customer)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (address == null)
            return null;

        return new AddressDto
        {
            Id = address.Id,
            CustomerId = address.CustomerId,
            CustomerName = address.Customer.Name,
            Street = address.Street,
            Suburb = address.Suburb,
            Postcode = address.Postcode,
            State = address.State
        };
    }

    /// <summary>
    /// Get all addresses for a specific customer
    /// </summary>
    public async Task<IEnumerable<AddressDto>> GetByCustomerIdAsync(int customerId)
    {
        return await _context.Addresses
            .Include(a => a.Customer)
            .Where(a => a.CustomerId == customerId)
            .Select(a => new AddressDto
            {
                Id = a.Id,
                CustomerId = a.CustomerId,
                CustomerName = a.Customer.Name,
                Street = a.Street,
                Suburb = a.Suburb,
                Postcode = a.Postcode,
                State = a.State
            })
            .ToListAsync();
    }

    /// <summary>
    /// Create new address
    /// </summary>
    public async Task<AddressDto> CreateAsync(AddressCreateDto dto)
    {
        // Verify customer exists
        var customer = await _context.Customers.FindAsync(dto.CustomerId);
        if (customer == null)
            throw new ArgumentException($"Customer with ID {dto.CustomerId} not found");

        var address = new Address
        {
            CustomerId = dto.CustomerId,
            Street = dto.Street,
            Suburb = dto.Suburb,
            Postcode = dto.Postcode,
            State = dto.State
        };

        _context.Addresses.Add(address);
        await _context.SaveChangesAsync();

        return new AddressDto
        {
            Id = address.Id,
            CustomerId = address.CustomerId,
            CustomerName = customer.Name,
            Street = address.Street,
            Suburb = address.Suburb,
            Postcode = address.Postcode,
            State = address.State
        };
    }

    /// <summary>
    /// Update existing address
    /// </summary>
    public async Task<AddressDto?> UpdateAsync(int id, AddressUpdateDto dto)
    {
        var address = await _context.Addresses
            .Include(a => a.Customer)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (address == null)
            return null;

        address.Street = dto.Street;
        address.Suburb = dto.Suburb;
        address.Postcode = dto.Postcode;
        address.State = dto.State;

        await _context.SaveChangesAsync();

        return new AddressDto
        {
            Id = address.Id,
            CustomerId = address.CustomerId,
            CustomerName = address.Customer.Name,
            Street = address.Street,
            Suburb = address.Suburb,
            Postcode = address.Postcode,
            State = address.State
        };
    }

    /// <summary>
    /// Delete address by ID
    /// </summary>
    public async Task<bool> DeleteAsync(int id)
    {
        var address = await _context.Addresses.FindAsync(id);
        if (address == null)
            return false;

        _context.Addresses.Remove(address);
        await _context.SaveChangesAsync();
        return true;
    }
}
