import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { Exclude } from "class-transformer";
import { User, UserRole } from "src/graphql";
import { CvModel } from "src/cvs/model/cv.model";
import { ProfileModel } from "src/profile/model/profile.model";
import { DepartmentModel } from "src/departments/model/department.model";
import { PositionModel } from "src/positions/model/position.model";

@Entity("user")
export class UserModel implements User {
  @PrimaryColumn("int")
  id: string;

  @CreateDateColumn()
  created_at: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column("boolean", { default: false })
  is_verified: boolean;

  @OneToOne(() => ProfileModel, { cascade: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "id" })
  profile: ProfileModel;

  @Column("enum", { enum: UserRole, default: UserRole.Employee })
  role: UserRole;

  @ManyToOne(() => DepartmentModel, {
    nullable: true,
    eager: true,
    onDelete: "SET NULL",
  })
  @JoinColumn()
  department: DepartmentModel;

  @ManyToOne(() => PositionModel, {
    nullable: true,
    eager: true,
    onDelete: "SET NULL",
  })
  @JoinColumn()
  position: PositionModel;
  
  @OneToMany(() => CvModel, (cv) => cv.user, { cascade: true })
  cvs: CvModel[];
}
