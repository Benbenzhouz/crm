using Microsoft.EntityFrameworkCore;
using MiniCRM.Data;
using MiniCRM.DTOs;
using MiniCRM.Models;

namespace MiniCRM.Services;

public class ProductService : IProductService
{
    private readonly CrmDbContext _context;

    public ProductService(CrmDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductResponseDto>> GetAllAsync()
    {
        return await _context.Products
            .Select(p => new ProductResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Sku = p.Sku,
                UnitPrice = p.UnitPrice,
                CurrentStock = p.CurrentStock,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<ProductResponseDto?> GetByIdAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return null;

        return new ProductResponseDto
        {
            Id = product.Id,
            Name = product.Name,
            Sku = product.Sku,
            UnitPrice = product.UnitPrice,
            CurrentStock = product.CurrentStock,
            CreatedAt = product.CreatedAt
        };
    }

    public async Task<ProductResponseDto> CreateAsync(ProductCreateDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            Sku = dto.Sku,
            UnitPrice = dto.UnitPrice,
            CurrentStock = dto.CurrentStock,
            CreatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return new ProductResponseDto
        {
            Id = product.Id,
            Name = product.Name,
            Sku = product.Sku,
            UnitPrice = product.UnitPrice,
            CurrentStock = product.CurrentStock,
            CreatedAt = product.CreatedAt
        };
    }

    public async Task<ProductResponseDto?> UpdateAsync(int id, ProductUpdateDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return null;

        product.Name = dto.Name;
        product.Sku = dto.Sku;
        product.UnitPrice = dto.UnitPrice;
        product.CurrentStock = dto.CurrentStock;

        await _context.SaveChangesAsync();

        return new ProductResponseDto
        {
            Id = product.Id,
            Name = product.Name,
            Sku = product.Sku,
            UnitPrice = product.UnitPrice,
            CurrentStock = product.CurrentStock,
            CreatedAt = product.CreatedAt
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return false;

        // Check if product is used in any order items
        var hasOrderItems = await _context.OrderItems.AnyAsync(oi => oi.ProductId == id);
        if (hasOrderItems)
        {
            throw new InvalidOperationException("Cannot delete product that has been ordered. Please cancel or delete the related orders first.");
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return true;
    }
}
