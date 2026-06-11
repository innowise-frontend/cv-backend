import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { PositionModel } from "./model/position.model";
import { CreatePositionInput, UpdatePositionInput, DeletePositionInput, SearchPaginationInput } from "src/graphql";
import { resolvePagination } from "src/app/util/pagination_logic";

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(PositionModel)
    private readonly positionRepository: Repository<PositionModel>,
  ) {}

  async findAll(params?: SearchPaginationInput) {
    const { page, limit, skip } = resolvePagination(params);
    const sortOrder = params?.sort_order?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const sortBy = params?.sort_by?.toLowerCase() || "created_at";

    const query = this.positionRepository.createQueryBuilder("position");

    if (params?.search?.trim()) {
      query.andWhere("position.name ILIKE :search", { search: `%${params.search.trim()}%` });
    }

    query.orderBy(`position.${sortBy}`, sortOrder).skip(skip).take(limit);

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
    return await this.positionRepository.find({ where: { id: In(ids) } });
  }

  async findOneById(id: string) {
    return id ? await this.positionRepository.findOne({ where: { id } }) : null;
  }

  async create({ name }: CreatePositionInput) {
    const position = this.positionRepository.create({ name });
    return await this.positionRepository.save(position);
  }

  async update({ positionId, name }: UpdatePositionInput) {
    const position = await this.findOneById(positionId);
    position.name = name;
    return await this.positionRepository.save(position);
  }

  async delete({ positionId }: DeletePositionInput) {
    return await this.positionRepository.delete(positionId);
  }
}
