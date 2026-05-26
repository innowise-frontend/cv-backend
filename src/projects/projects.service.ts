import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { ProjectModel } from "./model/project.model";
import {
  SearchPaginationInput,
  CreateProjectInput,
  UpdateProjectInput,
  DeleteProjectInput,
} from "src/graphql";
import { resolvePagination } from "src/app/util/pagination_logic";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectModel)
    private readonly projectsRepository: Repository<ProjectModel>,
  ) {}

  async findAll(params?: SearchPaginationInput) {
    const { page, limit, skip } = resolvePagination(params);
    const sortOrder = params?.sort_order?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const sortBy = params?.sort_by?.toLowerCase() || "created_at";

    const query = this.projectsRepository.createQueryBuilder("project");

    if (params?.search?.trim()) {
      query.andWhere("project.name ILIKE :search", { search: `%${params.search.trim()}%` });
    }

    query.orderBy(`project.${sortBy}`, sortOrder).skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  findMany(projectIds: string[]) {
    return this.projectsRepository.find({
      where: { id: In(projectIds) },
    });
  }

  findOneById(projectId: string) {
    return this.projectsRepository.findOne({
      where: { id: projectId },
    });
  }

  async createProject({
    name,
    domain,
    description,
    start_date,
    end_date,
    environment,
  }: CreateProjectInput) {
    const project = this.projectsRepository.create({
      name,
      domain,
      description,
      start_date,
      end_date,
      environment,
    });

    return this.projectsRepository.save(project);
  }

  async updateProject({
    projectId,
    name,
    domain,
    description,
    start_date,
    end_date,
    environment,
  }: UpdateProjectInput) {
    const project = await this.findOneById(projectId);

    Object.assign(project, {
      name,
      domain,
      description,
      start_date,
      end_date,
      environment,
    });

    return this.projectsRepository.save(project);
  }

  deleteProject({ projectId }: DeleteProjectInput) {
    return this.projectsRepository.delete(projectId);
  }
}
