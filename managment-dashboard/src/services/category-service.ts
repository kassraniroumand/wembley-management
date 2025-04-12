import apiClient from './api-client';
import {
  CategoryDTO,
  CategoryListResponseDTO,
  CreateCategoryDTO,
  UpdateCategoryDTO
} from '../types';

export const categoryService = {
  getAllCategories: async (page = 1, pageSize = 20): Promise<CategoryListResponseDTO> => {
    const response = await apiClient.get<CategoryListResponseDTO>(`/category?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },

  getCategoryById: async (id: number): Promise<CategoryDTO> => {
    const response = await apiClient.get<CategoryDTO>(`/category/${id}`);
    return response.data;
  },

  getEventTypeCount: async (id: number): Promise<number> => {
    const response = await apiClient.get<number>(`/category/${id}/event-type-count`);
    return response.data;
  },

  checkNameUnique: async (name: string, excludeId?: number): Promise<boolean> => {
    let url = `/category/check-name?name=${encodeURIComponent(name)}`;
    if (excludeId !== undefined) {
      url += `&excludeId=${excludeId}`;
    }
    const response = await apiClient.get<boolean>(url);
    return response.data;
  },

  createCategory: async (category: CreateCategoryDTO): Promise<CategoryDTO> => {
    const response = await apiClient.post<CategoryDTO>('/category', category);
    return response.data;
  },

  updateCategory: async (id: number, category: UpdateCategoryDTO): Promise<CategoryDTO> => {
    const response = await apiClient.put<CategoryDTO>(`/category/${id}`, category);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/category/${id}`);
  }
};
