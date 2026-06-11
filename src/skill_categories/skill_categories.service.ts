import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SkillCategoryModel } from "./model/skill_category.model";

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

  async findOneById(categoryId?: string) {
    return categoryId
      ? await this.skillCategoriesRepository.findOne({
          where: { id: categoryId },
        })
      : null;
  }
}
