using Microsoft.AspNetCore.Mvc;
using MiniCRM.DTOs;
using MiniCRM.Services;

namespace MiniCRM.Controllers;

/// <summary>
/// Address management API controller
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AddressesController : ControllerBase
{
    private readonly IAddressService _addressService;

    public AddressesController(IAddressService addressService)
    {
        _addressService = addressService;
    }

    /// <summary>
    /// Get all addresses
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AddressDto>>> GetAll()
    {
        var addresses = await _addressService.GetAllAsync();
        return Ok(addresses);
    }

    /// <summary>
    /// Get address by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<AddressDto>> GetById(int id)
    {
        var address = await _addressService.GetByIdAsync(id);
        if (address == null)
            return NotFound(new { message = $"Address with ID {id} not found" });

        return Ok(address);
    }

    /// <summary>
    /// Get addresses by customer ID
    /// </summary>
    [HttpGet("customer/{customerId}")]
    public async Task<ActionResult<IEnumerable<AddressDto>>> GetByCustomerId(int customerId)
    {
        var addresses = await _addressService.GetByCustomerIdAsync(customerId);
        return Ok(addresses);
    }

    /// <summary>
    /// Create new address
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<AddressDto>> Create([FromBody] AddressCreateDto dto)
    {
        try
        {
            var address = await _addressService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = address.Id }, address);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update existing address
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<AddressDto>> Update(int id, [FromBody] AddressUpdateDto dto)
    {
        var address = await _addressService.UpdateAsync(id, dto);
        if (address == null)
            return NotFound(new { message = $"Address with ID {id} not found" });

        return Ok(address);
    }

    /// <summary>
    /// Delete address
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var success = await _addressService.DeleteAsync(id);
        if (!success)
            return NotFound(new { message = $"Address with ID {id} not found" });

        return NoContent();
    }
}
