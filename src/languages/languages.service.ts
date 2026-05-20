import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LanguageModel } from "./model/language.model";
import { SearchPaginationInput, CreateLanguageInput, DeleteLanguageInput, UpdateLanguageInput } from "src/graphql";
import { resolvePagination } from "src/app/util/pagination_logic";

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(LanguageModel)
    private readonly languageRepository: Repository<LanguageModel>,
  ) {}

  async findAll(params?: SearchPaginationInput) {
    const { page, limit, skip } = resolvePagination(params);
    const sortOrder = params?.sort_order?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const sortBy = params?.sort_by?.toLowerCase() || "created_at";

    const query = this.languageRepository.createQueryBuilder("language")

    if (params?.search?.trim()) {
      query.andWhere(
        "language.name ILIKE :search OR language.iso2 ILIKE :search",
        { search: `%${params.search.trim()}%` },
      );
    }

    query.orderBy(`language.${sortBy}`, sortOrder).skip(skip).take(limit);

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
    return this.languageRepository.findOne({
      where: { id },
    });
  }

  createLanguage({ name, iso2, native_name }: CreateLanguageInput) {
    const language = this.languageRepository.create({
      name,
      iso2,
      native_name,
    });
    return this.languageRepository.save(language);
  }

  async updateLanguage({ languageId, name, iso2, native_name }: UpdateLanguageInput) {
    const language = await this.findOneById(languageId);
    language.name = name;
    language.iso2 = iso2;
    language.native_name = native_name;
    return this.languageRepository.save(language);
  }

  deleteLanguage({ languageId }: DeleteLanguageInput) {
    return this.languageRepository.delete(languageId);
  }
}
