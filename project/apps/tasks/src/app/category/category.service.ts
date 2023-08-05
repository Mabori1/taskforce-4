import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '@project/shared/app-types';
import { CategoryRepository } from './category.repository';
import { CategoryEntity } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const categoryEntity = new CategoryEntity(dto);
    return this.categoryRepository.create(categoryEntity);
  }

  async delete(id: number): Promise<void> {
    this.categoryRepository.destroy(id);
  }

  async findOne(id: number): Promise<Category> {
    return this.categoryRepository.findById(id);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    return this.categoryRepository.update(id, new CategoryEntity(dto));
  }
}
