// Category DTOs
export interface CategoryDTO {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CreateCategoryDTO {
  name: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateCategoryDTO {
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CategoryListResponseDTO {
  categories: CategoryDTO[];
  totalCount: number;
}
