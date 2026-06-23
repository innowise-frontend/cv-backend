import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SkillCategoryModel } from "./model/skill_category.model";

const skillCategoryNotFound = new NotFoundException("skillCategoryNotFound");

@Injectable()
export class SkillCategoriesService {
  constructor(
    @InjectRepository(SkillCategoryModel)
    private readonly skillCategoriesRepository: Repository<SkillCategoryModel>,
  ) {}

  async findAll() {
    return await this.skillCategoriesRepository.find({
      relations: ["parent", "children"],
      order: {
        order: "asc",
      },
    });
  }

  async findOneById(categoryId: string) {
    const category = await this.skillCategoriesRepository.findOne({ where: { id: categoryId } });

    if (!category) {
      throw skillCategoryNotFound;
    }

    return category;
  }
}
