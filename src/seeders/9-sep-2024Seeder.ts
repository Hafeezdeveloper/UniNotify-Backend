// last updated : 11-NOV-2024
import * as mongoose from 'mongoose';
import {
  OperatorDocument,
  OperatorSchema,
} from '../operator/schemas/operator.schema';
import * as dotenv from 'dotenv';
import { DepartmentDocument, DepartmentSchema } from '../user/schema/department.schema';
import { SemesterDocument, SemesterSchema } from '../user/schema/semester.schema';
import { SectionDocument, SectionSchema } from '../user/schema/section.schema';
import { BatchDocument, BatchSchema } from '../user/schema/batch.schema';
dotenv.config();

const OperatorModel = mongoose.model<OperatorDocument>(
  'Operator',
  OperatorSchema,
);

const DepartmentModel = mongoose.model<DepartmentDocument>(
  'Department',
  DepartmentSchema,
);

const SemesterModel = mongoose.model<SemesterDocument>(
  'Semester',
  SemesterSchema,
);

const BatchModel = mongoose.model<BatchDocument>(
  'Batch',
  BatchSchema,
);

const SectionModel = mongoose.model<SectionDocument>(
  'Section',
  SectionSchema,
);

async function seedAdmin(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
     // const operatorData = {
    //   _id: '61ac7e6b7fee707f8fda999b',
    //   firstName: 'super',
    //   lastName: 'admin',
    //   userName: 'superAdmin',
    //   email: 'hafeezatif124@yopmail.com',
    //   password: 'Secret@123',
    //   phonenumber: '1234567890',
    //   adminType: 'admin',
    //   isSuperAdmin: true,
    //   status: 'active',
    //   module1read: true,
    //   module1write: true,
    //   module2read: true,
    //   module2write: true,
    //   module3read: true,
    //   module3write: true,
    //   module4read: true,
    //   module4write: true,
    //   fullName: 'super admin',
    // };

    // // Find and delete existing user with the provided email
    // await OperatorModel.findOneAndDelete({
    //   email: operatorData.email,
    // });

    // const newUser = new OperatorModel({
    //   _id: operatorData._id,
    //   firstName: operatorData.firstName,
    //   lastName: operatorData.lastName,
    //   userName: operatorData.userName,
    //   email: operatorData.email,
    //   password: operatorData.password,
    //   phonenumber: operatorData.phonenumber,
    //   adminType: operatorData.adminType,
    //   isSuperAdmin: operatorData.isSuperAdmin,
    //   status: operatorData.status,
    //   module1read: operatorData.module1read,
    //   module1write: operatorData.module1write,
    //   module2read: operatorData.module2read,
    //   module2write: operatorData.module2write,
    //   module3read: operatorData.module3read,
    //   module3write: operatorData.module3write,
    //   module4read: operatorData.module4read,
    //   module4write: operatorData.module4write,
    //   fullName: operatorData.fullName,
    // });
    

    // Departments with random MongoDB ObjectId strings
    const departments = [
      { _id: new mongoose.Types.ObjectId('650a1d6c9b9d5b001e8f1a01'), name: 'Computer Science', shortName: 'cs' },
      { _id: new mongoose.Types.ObjectId('650a1d6c9b9d5b001e8f1a02'), name: 'Electrical Engineering', shortName: 'ee' },
      { _id: new mongoose.Types.ObjectId('650a1d6c9b9d5b001e8f1a03'), name: 'Mechanical Engineering', shortName: 'me' },
      { _id: new mongoose.Types.ObjectId('650a1d6c9b9d5b001e8f1a04'), name: 'Civil Engineering', shortName: 'ce' },
      { _id: new mongoose.Types.ObjectId('650a1d6c9b9d5b001e8f1a05'), name: 'Biotechnology', shortName: 'bt' },
    ];

    await DepartmentModel.deleteMany(); // Clear old
    await DepartmentModel.insertMany(departments);
    console.log('Departments seeded successfully');

    // Sections with random ObjectIds
    const sections = [
      { _id: new mongoose.Types.ObjectId('650a1d6c9b9d5b001e8f2b11'), name: 'Section A' },
      { _id: new mongoose.Types.ObjectId('650a1d6c9b9d5b001e8f2b12'), name: 'Section B' },
      { _id: new mongoose.Types.ObjectId('650a1d6c9b9d5b001e8f2b13'), name: 'Section C' },
    ];
    await SectionModel.deleteMany({});
    await SectionModel.insertMany(sections);
    console.log('✅ Sections Seeded');

    // Batches with random ObjectIds
    const batches = [
      { _id: new mongoose.Types.ObjectId('650a1d6c9b9d5b001e8f3c21'), year: '2021' },
      { _id: new mongoose.Types.ObjectId('650a1d6c9b9d5b001e8f3c22'), year: '2022' },
      { _id: new mongoose.Types.ObjectId('650a1d6c9b9d5b001e8f3c23'), year: '2023' },
      { _id: new mongoose.Types.ObjectId('650a1d6c9b9d5b001e8f3c24'), year: '2024' },
    ];
    await BatchModel.deleteMany({});
    await BatchModel.insertMany(batches);
    console.log('✅ Batches Seeded');

    // Semesters with random ObjectIds
    const semesters = [
      { _id: new mongoose.Types.ObjectId('650a1d6c9b9d5b001e8f4d31'), name: 'Semester 1' },
      { _id: new mongoose.Types.ObjectId('650a1d6c9b9d5b001e8f4d32'), name: 'Semester 2' },
      { _id: new mongoose.Types.ObjectId('650a1d6c9b9d5b001e8f4d33'), name: 'Semester 3' },
      { _id: new mongoose.Types.ObjectId('650a1d6c9b9d5b001e8f4d34'), name: 'Semester 4' },
      { _id: new mongoose.Types.ObjectId('650a1d6c9b9d5b001e8f4d35'), name: 'Semester 5' },
      { _id: new mongoose.Types.ObjectId('650a1d6c9b9d5b001e8f4d36'), name: 'Semester 6' },
      { _id: new mongoose.Types.ObjectId('650a1d6c9b9d5b001e8f4d37'), name: 'Semester 7' },
      { _id: new mongoose.Types.ObjectId('650a1d6c9b9d5b001e8f4d38'), name: 'Semester 8' },
    ];
    await SemesterModel.deleteMany({});
    await SemesterModel.insertMany(semesters);
    console.log('✅ Semesters Seeded');

    console.log('All data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.disconnect();
  }
}

seedAdmin();
