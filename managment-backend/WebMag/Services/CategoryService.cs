using Mapster;
using Microsoft.EntityFrameworkCore;
using WebMag.data;
using WebMag.Models.domain;
using WebMag.Models.DTOs;

namespace WebMag.Services;

public interface ICategoryService
{
    Task<List<CategoryDTO>> GetAllCategoriesAsync(int page = 1, int pageSize = 20);
    Task<CategoryDTO> GetCategoryByIdAsync(int id);
    Task<CategoryDTO> CreateCategoryAsync(CreateCategoryDTO dto, string userId);
    Task<CategoryDTO> UpdateCategoryAsync(int id, UpdateCategoryDTO dto, string userId);
    Task<bool> DeleteCategoryAsync(int id);
    Task<bool> IsCategoryNameUniqueAsync(string name, int? excludeId = null);
    Task<int> GetEventTypeCountForCategoryAsync(int categoryId);
}

public class CategoryService : ICategoryService
{
    private readonly DomainDbContext _dbContext;

    public CategoryService(DomainDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<CategoryDTO>> GetAllCategoriesAsync(int page = 1, int pageSize = 20)
    {
        var skip = (page - 1) * pageSize;
        var categories = await _dbContext.Categories
            .OrderBy(c => c.Name)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();

        return categories.Adapt<List<CategoryDTO>>();
    }

    public async Task<CategoryDTO> GetCategoryByIdAsync(int id)
    {
        var category = await _dbContext.Categories.FindAsync(id);
        if (category == null)
            return null;

        return category.Adapt<CategoryDTO>();
    }

    public async Task<CategoryDTO> CreateCategoryAsync(CreateCategoryDTO dto, string userId)
    {
        // Check if name is unique
        var nameExists = await _dbContext.Categories
            .AnyAsync(c => c.Name.ToLower() == dto.Name.ToLower());

        if (nameExists)
            throw new Exception("A category with this name already exists");

        var category = dto.Adapt<Category>();
        category.CreatedAt = DateTime.UtcNow;
        category.CreatedBy = userId;

        _dbContext.Categories.Add(category);
        await _dbContext.SaveChangesAsync();

        return category.Adapt<CategoryDTO>();
    }

    public async Task<CategoryDTO> UpdateCategoryAsync(int id, UpdateCategoryDTO dto, string userId)
    {
        var category = await _dbContext.Categories.FindAsync(id);
        if (category == null)
            throw new Exception($"Category with ID {id} not found");

        // Check name uniqueness (excluding current category)
        var nameExists = await _dbContext.Categories
            .AnyAsync(c => c.Id != id && c.Name.ToLower() == dto.Name.ToLower());

        if (nameExists)
            throw new Exception("A category with this name already exists");

        // Update properties individually
        category.Name = dto.Name;
        category.Description = dto.Description;
        category.IsActive = dto.IsActive;
        category.UpdatedAt = DateTime.UtcNow;
        category.UpdatedBy = userId;

        // Mark as modified
        _dbContext.Entry(category).State = EntityState.Modified;

        await _dbContext.SaveChangesAsync();

        return category.Adapt<CategoryDTO>();
    }

    public async Task<bool> DeleteCategoryAsync(int id)
    {
        var category = await _dbContext.Categories.FindAsync(id);
        if (category == null)
            return false;

        // Check if category is used by any event types
        var isUsed = await _dbContext.EventTypes
            .AnyAsync(e => e.Category == category.Name);

        if (isUsed)
            throw new Exception("Cannot delete category that is used by existing event types");

        _dbContext.Categories.Remove(category);
        await _dbContext.SaveChangesAsync();

        return true;
    }

    public async Task<bool> IsCategoryNameUniqueAsync(string name, int? excludeId = null)
    {
        var query = _dbContext.Categories.AsQueryable();

        if (excludeId.HasValue)
            query = query.Where(c => c.Id != excludeId.Value);

        return !await query.AnyAsync(c => c.Name.ToLower() == name.ToLower());
    }

    public async Task<int> GetEventTypeCountForCategoryAsync(int categoryId)
    {
        var category = await _dbContext.Categories.FindAsync(categoryId);
        if (category == null)
            return 0;

        return await _dbContext.EventTypes
            .CountAsync(e => e.Category == category.Name);
    }
}
