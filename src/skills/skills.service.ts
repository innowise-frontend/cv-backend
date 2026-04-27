import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SearchPaginationInput, CreateSkillInput, UpdateSkillInput } from "src/graphql";
import { Repository } from "typeorm";
import { SkillModel } from "./model/skill.model";
import { DeleteSkillDto } from "./dto/skill.dto";
import { resolvePagination } from "src/app/util/pagination_logic";
import { SkillCategoriesService } from "src/skill_categories/skill_categories.service";

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(SkillModel)
    private readonly skillsRepository: Repository<SkillModel>,
    private readonly skillCategoriesService: SkillCategoriesService,
  ) {}

  async findAll(params?: SearchPaginationInput) {
    const { page, limit, skip } = resolvePagination(params);
    const sortOrder = params?.sort_order?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const sortBy = params?.sort_by?.toLowerCase() || "created_at";

    const query = this.skillsRepository.createQueryBuilder("skill")
      .leftJoinAndSelect("skill.category", "category")

    if (params?.search?.trim()) {
      query.andWhere(
        "skill.name ILIKE :search OR category.name ILIKE :search",
        { search: `%${params.search.trim()}%` },
      );
    }

    query.orderBy(`skill.${sortBy}`, sortOrder).skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  findOneById(id: string) {
    return this.skillsRepository.findOne({
      where: { id },
    });
  }

  async createSkill({ name, categoryId }: CreateSkillInput) {
    const category = await this.skillCategoriesService.findOneById(categoryId);

    const skill = this.skillsRepository.create({
      name,
      category,
    });

    return this.skillsRepository.save(skill);
  }

  async updateSkill({ skillId, name, categoryId }: UpdateSkillInput) {
    const [category, skill] = await Promise.all([
      this.skillCategoriesService.findOneById(categoryId),
      this.findOneById(skillId),
    ]);

    Object.assign(skill, {
      name,
      category,
    });

    return this.skillsRepository.save(skill);
  }

  deleteSkill({ skillId }: DeleteSkillDto) {
    return this.skillsRepository.delete(skillId);
  }
}
