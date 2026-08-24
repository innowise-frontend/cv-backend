import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PositionModel } from "./model/position.model";
import {
  CreatePositionInput,
  UpdatePositionInput,
  DeletePositionInput,
  SearchPaginationInput,
} from "src/graphql";
import { resolvePagination } from "src/app/util/pagination_logic";
import { UserModel } from "src/users/model/user.model";

const positionNotFound = new NotFoundException("positionNotFound");
const cannotDeletePositionInUse = new ConflictException("cannotDeletePositionInUse");

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(PositionModel)
    private readonly positionRepository: Repository<PositionModel>,
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
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

  async findOneById(id: string) {
    const position = await this.positionRepository.findOne({ where: { id } });

    if (!position) {
      throw positionNotFound;
    }

    return position;
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
    await this.findOneById(positionId);

    const isInUse = await this.userRepository.exists({
      where: { position: { id: positionId } },
    });

    if (isInUse) {
      throw cannotDeletePositionInUse;
    }

    return await this.positionRepository.delete(positionId);
  }
}
