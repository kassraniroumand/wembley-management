using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebMag.Models.DTOs;
using WebMag.Services;

namespace WebMag.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoryController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<ActionResult<List<CategoryDTO>>> GetAllCategories([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var categories = await _categoryService.GetAllCategoriesAsync(page, pageSize);
        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDTO>> GetCategoryById(int id)
    {
        var category = await _categoryService.GetCategoryByIdAsync(id);
        if (category == null)
            return NotFound();

        return Ok(category);
    }

    [HttpGet("{id}/event-type-count")]
    public async Task<ActionResult<int>> GetEventTypeCount(int id)
    {
        var count = await _categoryService.GetEventTypeCountForCategoryAsync(id);
        return Ok(count);
    }

    [HttpGet("check-name")]
    public async Task<ActionResult<bool>> CheckNameUnique([FromQuery] string name, [FromQuery] int? excludeId = null)
    {
        var isUnique = await _categoryService.IsCategoryNameUniqueAsync(name, excludeId);
        return Ok(isUnique);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CategoryDTO>> CreateCategory(CreateCategoryDTO createCategoryDto)
    {
        if (createCategoryDto == null)
            return BadRequest("Category data cannot be null");

        if (string.IsNullOrWhiteSpace(createCategoryDto.Name))
            return BadRequest("Category name is required");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";

        try
        {
            var category = await _categoryService.CreateCategoryAsync(createCategoryDto, userId);
            return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, category);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CategoryDTO>> UpdateCategory(int id, UpdateCategoryDTO updateCategoryDto)
    {
        if (updateCategoryDto == null)
            return BadRequest("Update data cannot be null");

        if (string.IsNullOrWhiteSpace(updateCategoryDto.Name))
            return BadRequest("Category name is required");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";

        try
        {
            var category = await _categoryService.UpdateCategoryAsync(id, updateCategoryDto, userId);
            return Ok(category);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteCategory(int id)
    {
        try
        {
            var result = await _categoryService.DeleteCategoryAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
