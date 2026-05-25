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

  findMany(ids: string[]) {
    return this.positionRepository.find({
      where: { id: In(ids) },
    });
  }

  findOneById(id: string) {
    if (!id) {
      return null;
    }
    return this.positionRepository.findOne({
      where: { id },
    });
  }

  create({ name }: CreatePositionInput) {
    const position = this.positionRepository.create({ name });
    return this.positionRepository.save(position);
  }

  async update({ positionId, name }: UpdatePositionInput) {
    const position = await this.findOneById(positionId);
    position.name = name;
    return this.positionRepository.save(position);
  }

  delete({ positionId }: DeletePositionInput) {
    return this.positionRepository.delete(positionId);
  }
}
