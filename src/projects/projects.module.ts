import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectModel } from "./model/project.model";
import { CvModel } from "src/cvs/model/cv.model";
import { CvProjectModel } from "src/cv_projects/model/cv_project.model";
import { SkillsModule } from "src/skills/skills.module";
import { ProjectsResolver } from "./projects.resolver";
import { ProjectsService } from "./projects.service";

@Module({
  imports: [TypeOrmModule.forFeature([ProjectModel, CvModel, CvProjectModel]), SkillsModule],
  providers: [ProjectsResolver, ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
