import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DepartmentModel } from "./model/department.model";
import {
  CreateDepartmentInput,
  DeleteDepartmentInput,
  SearchPaginationInput,
  UpdateDepartmentInput,
} from "src/graphql";
import { resolvePagination } from "src/app/util/pagination_logic";

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(DepartmentModel)
    private readonly departmentRepository: Repository<DepartmentModel>,
  ) {}

  async findAll(params?: SearchPaginationInput) {
    const { page, limit, skip } = resolvePagination(params);
    const sortOrder = params?.sort_order?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const sortBy = params?.sort_by?.toLowerCase() || "created_at";

    const query = this.departmentRepository.createQueryBuilder("department");

    if (params?.search?.trim()) {
      query.andWhere("department.name ILIKE :search", { search: `%${params.search.trim()}%` });
    }

    query.orderBy(`department.${sortBy}`, sortOrder).skip(skip).take(limit);

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
    return id ? this.departmentRepository.findOne({ where: { id } }) : null;
  }

  async create({ name }: CreateDepartmentInput) {
    const department = this.departmentRepository.create({ name });
    return await this.departmentRepository.save(department);
  }

  async update({ departmentId, name }: UpdateDepartmentInput) {
    const department = await this.findOneById(departmentId);
    department.name = name;
    return await this.departmentRepository.save(department);
  }

  async delete({ departmentId }: DeleteDepartmentInput) {
    return await this.departmentRepository.delete(departmentId);
  }
}
