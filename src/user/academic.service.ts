import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Batch, BatchDocument } from './schema/batch.schema';
import { Department, DepartmentDocument } from './schema/department.schema';
import { Section, SectionDocument } from './schema/section.schema';
import { Semester, SemesterDocument } from './schema/semester.schema';



@Injectable()
export class AcademicService {
  constructor(
    @InjectModel(Batch.name) private batchModel: Model<BatchDocument>,
    @InjectModel(Department.name) private departmentModel: Model<DepartmentDocument>,
    @InjectModel(Section.name) private sectionModel: Model<SectionDocument>,
    @InjectModel(Semester.name) private semesterModel: Model<SemesterDocument>,
  ) {}

  async getAllBatches(): Promise<Batch[]> {
    return this.batchModel.find().exec();
  }

  async getAllDepartments(): Promise<Department[]> {
    return this.departmentModel.find().exec();
  }

  async getAllSections(): Promise<Section[]> {
    return this.sectionModel.find().exec();
  }

  async getAllSemesters(): Promise<Semester[]> {
    return this.semesterModel.find().exec();
  }
}
