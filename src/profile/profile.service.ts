import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProfileModel } from "./model/profile.model";
import { UserModel } from "src/users/model/user.model";
import { CloudService } from "src/cloud/cloud.service";
import {
  UploadAvatarInput,
  CreateProfileInput,
  UpdateProfileInput,
  AddProfileSkillInput,
  UpdateProfileSkillInput,
  DeleteProfileSkillInput,
  AddProfileLanguageInput,
  UpdateProfileLanguageInput,
  DeleteProfileLanguageInput,
  DeleteAvatarInput,
  DeleteProfileInput,
} from "src/graphql";

const userNotFound = new NotFoundException("User not found");
const languageHasBeenAdded = new BadRequestException("Language has already been added");
const skillHasBeenAdded = new BadRequestException("Skill has already been added");

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    private readonly cloudService: CloudService,
  ) {}

  findOneById(userId: string) {
    return this.profileRepository.findOne({
      where: { id: userId },
    });
  }

  async me(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["profile"]
    });

    if (!user) {
      throw userNotFound;
    }

    return {
      ...user.profile,
      email: user.email,
      is_verified: user.is_verified,
      role: user.role,
    };
  }

  async createProfile({ first_name, last_name }: CreateProfileInput) {
    const profile = this.profileRepository.create({ first_name, last_name });
    return await this.profileRepository.save(profile);
  }

  async updateProfile({ userId, first_name, last_name }: UpdateProfileInput) {
    const profile = await this.findOneById(userId);
    profile.first_name = first_name;
    profile.last_name = last_name;
    return await this.profileRepository.save(profile);
  }

  async addProfileSkill({ userId, name, categoryId, mastery }: AddProfileSkillInput) {
    const profile = await this.findOneById(userId);
    const index = profile.skills.findIndex((skill) => skill.name === name);
    if (index !== -1) {
      throw skillHasBeenAdded;
    }
    profile.skills.push({ name, categoryId, mastery });
    return await this.profileRepository.save(profile);
  }

  async updateProfileSkill({ userId, name, categoryId, mastery }: UpdateProfileSkillInput) {
    const profile = await this.findOneById(userId);
    const index = profile.skills.findIndex((skill) => skill.name === name);

    if (index !== -1) {
      profile.skills[index] = { name, categoryId, mastery };
    }

    return await this.profileRepository.save(profile);
  }

  async deleteProfileSkill({ userId, name }: DeleteProfileSkillInput) {
    const profile = await this.findOneById(userId);
    profile.skills = profile.skills.filter((skill) => !name.includes(skill.name));
    return await this.profileRepository.save(profile);
  }

  async addProfileLanguage({ userId, name, proficiency }: AddProfileLanguageInput) {
    const profile = await this.findOneById(userId);
    const index = profile.languages.findIndex((skill) => skill.name === name);
    if (index !== -1) {
      throw languageHasBeenAdded;
    }
    profile.languages.push({ name, proficiency });
    return await this.profileRepository.save(profile);
  }

  async updateProfileLanguage({ userId, name, proficiency }: UpdateProfileLanguageInput) {
    const profile = await this.findOneById(userId);
    profile.languages = profile.languages.map((language) => {
      if (language.name === name) {
        return { name, proficiency };
      }
      return language;
    });
    return await this.profileRepository.save(profile);
  }

  async deleteProfileLanguage({ userId, name }: DeleteProfileLanguageInput) {
    const profile = await this.findOneById(userId);
    profile.languages = profile.languages.filter((language) => !name.includes(language.name));
    return await this.profileRepository.save(profile);
  }

  async uploadAvatar({ userId, base64 }: UploadAvatarInput) {
    const profile = await this.findOneById(userId);
    const url = await this.cloudService.uploadImage(base64);
    profile.avatar = url;
    await this.profileRepository.save(profile);
    return url;
  }

  async deleteAvatar({ userId }: DeleteAvatarInput) {
    const profile = await this.findOneById(userId);
    profile.avatar = null;
    await this.profileRepository.save(profile);
    return null;
  }

  async deleteProfile({ userId }: DeleteProfileInput) {
    return await this.profileRepository.delete(userId);
  }
}
