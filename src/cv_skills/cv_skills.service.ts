import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AddCvSkillInput, DeleteCvSkillInput, UpdateCvSkillInput } from "../graphql";
import { CvModel } from "src/cvs/model/cv.model";

const skillHasBeenAdded = new ConflictException("skillHasBeenAdded");
const cvNotFound = new NotFoundException("cvNotFound");

@Injectable()
export class CvSkillsService {
  constructor(
    @InjectRepository(CvModel)
    private readonly cvRepository: Repository<CvModel>,
  ) {}

  async findOneById(cvId: string) {
    const cv = await this.cvRepository.findOne({ where: { id: cvId } });

    if (!cv) {
      throw cvNotFound;
    }

    return cv;
  }

  async addCvSkill({ cvId, name, categoryId, mastery }: AddCvSkillInput) {
    const cv = await this.findOneById(cvId);

    const index = cv.skills.findIndex((skill) => skill.name === name);

    if (index === -1) {
      cv.skills.push({ name, categoryId, mastery });
    } else {
      throw skillHasBeenAdded;
    }

    return await this.cvRepository.save(cv);
  }

  async updateCvSkill({ cvId, name, categoryId, mastery }: UpdateCvSkillInput) {
    const cv = await this.findOneById(cvId);

    const index = cv.skills.findIndex((skill) => skill.name === name);

    if (index !== -1) {
      cv.skills[index] = { name, categoryId, mastery };
    }

    return await this.cvRepository.save(cv);
  }

  async deleteCvSkill({ cvId, name }: DeleteCvSkillInput) {
    const cv = await this.findOneById(cvId);

    cv.skills = cv.skills.filter((skill) => !name.includes(skill.name));

    return await this.cvRepository.save(cv);
  }
}
