namespace WebMag.Models.DTOs;

// Category DTOs
public class CategoryDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public bool IsActive { get; set; }
}

public class CreateCategoryDTO
{
    public string Name { get; set; }
    public string Description { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateCategoryDTO
{
    public string Name { get; set; }
    public string Description { get; set; }
    public bool IsActive { get; set; }
}

public class CategoryListResponseDTO
{
    public List<CategoryDTO> Categories { get; set; }
    public int TotalCount { get; set; }
}
