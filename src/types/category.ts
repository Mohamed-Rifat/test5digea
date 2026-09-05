export interface Category {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  iconUrl: string;
}

export interface UpdateCategoryRequest {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
}