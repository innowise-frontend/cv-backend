import {
  forwardRef,
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { compare, hash } from "bcrypt";
import { UserModel } from "./model/user.model";
import { CreateUserInput, UpdateUserInput, AuthInput, SearchPaginationInput } from "src/graphql";
import { CvsService } from "src/cvs/cvs.service";
import { ProfileService } from "src/profile/profile.service";
import { DepartmentsService } from "src/departments/departments.service";
import { PositionsService } from "src/positions/positions.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { resolvePagination } from "src/app/util/pagination_logic";

const oldPasswordSameNewPassword = new BadRequestException({
  message: "Old password is the same as the new password",
});
const userNotFound = new NotFoundException("User not found");
const oldPasswordIncorrect = new BadRequestException({ message: "Old password is incorrect" });
const confirmPasswordMismatch = new BadRequestException({ message: "Confirm password mismatch" });

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @Inject(forwardRef(() => CvsService))
    private readonly profileService: ProfileService,
    private readonly departmentsService: DepartmentsService,
    private readonly positionsService: PositionsService,
  ) {}

  async findAll(params?: SearchPaginationInput) {
    const { page, limit, skip } = resolvePagination(params);
    const sortOrder = params?.sort_order?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const sortBy = params?.sort_by?.toLowerCase() || "created_at";
    const profileSortFields = ["first_name", "last_name"];
    const sortColumn = profileSortFields.includes(sortBy) ? `profile.${sortBy}` : `user.${sortBy}`;

    const query = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.profile", "profile")
      .leftJoinAndSelect("user.department", "department")
      .leftJoinAndSelect("user.position", "position");

    if (params?.search?.trim()) {
      query.andWhere(
        "profile.first_name ILIKE :search OR profile.last_name ILIKE :search OR user.email ILIKE :search",
        { search: `%${params.search.trim()}%` },
      );
    }

    query.orderBy(sortColumn, sortOrder).skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async findOneById(userId?: string) {
    return userId
      ? await this.userRepository.findOne({
          where: { id: userId },
          relations: ["profile", "cvs", "department", "position"],
        })
      : null;
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      relations: ["profile"],
    });
  }

  async signup(variables: AuthInput) {
    const [password, profile] = await Promise.all([
      hash(variables.password, 10),
      this.profileService.createProfile({}),
    ]);
    const user = this.userRepository.create({
      email: variables.email,
      password,
      profile,
    });
    return await this.userRepository.save(user);
  }

  async verifyUser(email: string) {
    const user = await this.findOneByEmail(email);
    user.is_verified = true;
    return await this.userRepository.save(user);
  }

  async changePassword(
    userId: string,
    { oldPassword, newPassword, confirmPassword }: ChangePasswordDto,
  ) {
    if (oldPassword === newPassword) {
      throw oldPasswordSameNewPassword;
    }

    const user = await this.findOneById(userId);

    if (!user) {
      throw userNotFound;
    }

    if (!(await compare(oldPassword, user.password))) {
      throw oldPasswordIncorrect;
    }

    if (newPassword !== confirmPassword) {
      throw confirmPasswordMismatch;
    }

    user.password = await hash(newPassword, 10);

    return await this.userRepository.save(user);
  }

  async createUser({
    auth,
    profile: { first_name, last_name },
    departmentId,
    positionId,
    role,
  }: CreateUserInput) {
    const [user, department, position] = await Promise.all([
      this.signup(auth),
      this.departmentsService.findOneById(departmentId),
      this.positionsService.findOneById(positionId),
    ]);
    const profile = await this.profileService.updateProfile({
      userId: user.id,
      first_name,
      last_name,
    });
    Object.assign(user, {
      profile,
      department,
      position,
      role,
    });
    return await this.userRepository.save(user);
  }

  async updateUser({ userId, departmentId, positionId, role }: UpdateUserInput) {
    const [user, department, position] = await Promise.all([
      this.findOneById(userId),
      this.departmentsService.findOneById(departmentId),
      this.positionsService.findOneById(positionId),
    ]);
    if (role) {
      user.role = role;
    }
    Object.assign(user, {
      department,
      position,
    });
    return await this.userRepository.save(user);
  }

  async updatePassword(email: string, newPassword: string) {
    const user = await this.findOneByEmail(email);

    user.password = await hash(newPassword, 10);

    return await this.userRepository.save(user);
  }

  async deleteUser(userId: string) {
    return await this.profileService.deleteProfile({ userId });
  }
}
