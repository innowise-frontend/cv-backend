import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProjectsService } from "../projects/projects.service";
import { AddCvProjectInput, RemoveCvProjectInput, UpdateCvProjectInput } from "../graphql";
import { CvProjectModel } from "../cv_projects/model/cv_project.model";
import { CvModel } from "../cvs/model/cv.model";

const cvNotFound = new NotFoundException("cvNotFound");
const cvProjectNotFound = new NotFoundException("cvProjectNotFound");
const projectHasBeenAdded = new ConflictException("projectHasBeenAdded");

@Injectable()
export class CvProjectsService {
  constructor(
    @InjectRepository(CvModel)
    private readonly cvRepository: Repository<CvModel>,
    @InjectRepository(CvProjectModel)
    private readonly cvProjectRepository: Repository<CvProjectModel>,
    @Inject(forwardRef(() => ProjectsService))
    private readonly projectsService: ProjectsService,
  ) {}

  async findOneByIdAndJoin(cvId: string) {
    const cv = await this.cvRepository.findOne({
      where: { id: cvId },
      relations: ["projects", "projects.project"],
    });

    if (!cv) {
      throw cvNotFound;
    }

    return cv;
  }

  async addCvProject({
    cvId,
    projectId,
    start_date,
    end_date,
    roles,
    responsibilities,
  }: AddCvProjectInput) {
    const [cv, project] = await Promise.all([
      this.findOneByIdAndJoin(cvId),
      this.projectsService.findOneById(projectId),
    ]);

    if (cv.projects.find(({ project }) => String(project.id) === projectId)) {
      throw projectHasBeenAdded;
    }

    const cvProject = this.cvProjectRepository.create({
      project,
      start_date,
      end_date,
      roles,
      responsibilities,
    });

    cv.projects.push(cvProject);
    await this.cvProjectRepository.save(cvProject);
    await this.cvRepository.save(cv);

    return cv;
  }

  async updateCvProject({
    cvId,
    projectId,
    start_date,
    end_date = null,
    roles,
    responsibilities,
  }: UpdateCvProjectInput) {
    const cv = await this.findOneByIdAndJoin(cvId);
    await this.projectsService.findOneById(projectId);

    const cvProject = cv.projects.find(({ project }) => String(project.id) === projectId);

    if (!cvProject) {
      throw cvProjectNotFound;
    }

    cvProject.start_date = start_date;
    cvProject.end_date = end_date;
    cvProject.roles = roles;
    cvProject.responsibilities = responsibilities;

    await this.cvProjectRepository.save(cvProject);

    return cv;
  }

  async removeCvProject({ cvId, projectId }: RemoveCvProjectInput) {
    const cv = await this.findOneByIdAndJoin(cvId);

    cv.projects = cv.projects.filter(({ project }) => String(project.id) !== projectId);
    await this.cvProjectRepository.delete({ project: { id: projectId } });

    return cv;
  }
}
