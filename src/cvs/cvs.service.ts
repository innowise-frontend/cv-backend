import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CvModel } from "./model/cv.model";
import { UsersService } from "../users/users.service";
import { SearchPaginationInput, CreateCvInput, DeleteCvInput, UpdateCvInput } from "src/graphql";
import { resolvePagination } from "src/app/util/pagination_logic";

@Injectable()
export class CvsService {
  constructor(
    @InjectRepository(CvModel)
    private readonly cvRepository: Repository<CvModel>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async findAll(params?: SearchPaginationInput) {
    const { page, limit, skip } = resolvePagination(params);
    const sortOrder = params?.sort_order?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const sortBy = params?.sort_by?.toLowerCase() || "created_at";

    const query = this.cvRepository
      .createQueryBuilder("cv")
      .leftJoinAndSelect("cv.user", "user")
      .leftJoinAndSelect("cv.projects", "projects");

    if (params?.search?.trim()) {
      query.andWhere("cv.name ILIKE :search OR user.email ILIKE :search", {
        search: `%${params.search.trim()}%`,
      });
    }

    query.orderBy(`cv.${sortBy}`, sortOrder).skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async findAllByUserId(userId: string, params?: SearchPaginationInput) {
    const { page, limit, skip } = resolvePagination(params);
    const sortOrder = params?.sort_order?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const sortBy = params?.sort_by?.toLowerCase() || "created_at";

    const query = this.cvRepository
      .createQueryBuilder("cv")
      .leftJoinAndSelect("cv.user", "user")
      .leftJoinAndSelect("cv.projects", "projects")
      .where("user.id = :userId", { userId });

    if (params?.search?.trim()) {
      query.andWhere("cv.name ILIKE :search", { search: `%${params.search.trim()}%` });
    }

    query.orderBy(`cv.${sortBy}`, sortOrder).skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async findMany(ids: string[]) {
    return await this.cvRepository.find({ where: { id: In(ids) } });
  }

  async findOneById(cvId: string) {
    return await this.cvRepository.findOne({
      where: { id: cvId },
      relations: ["user", "projects"],
    });
  }

  async findOneByIdAndJoin(cvId: string) {
    return await this.cvRepository.findOne({
      where: { id: cvId },
      relations: ["user", "user.profile", "projects", "projects.project"],
    });
  }

  async createCv({ name, education, description, userId }: CreateCvInput) {
    const user = await this.usersService.findOneById(userId);
    const cv = this.cvRepository.create({
      name,
      education,
      description,
      user,
      skills: user.profile.skills,
      languages: user.profile.languages,
    });

    return await this.cvRepository.save(cv);
  }

  async updateCv({ cvId, name, education, description }: UpdateCvInput) {
    const cv = await this.findOneById(cvId);
    cv.name = name;
    cv.education = education;
    cv.description = description;

    return await this.cvRepository.save(cv);
  }

  deleteCv({ cvId }: DeleteCvInput) {
    return this.cvRepository.delete(cvId);
  }
}
