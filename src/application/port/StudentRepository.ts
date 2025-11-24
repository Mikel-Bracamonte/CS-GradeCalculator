import { Student } from '../../domain/model/Student';

export interface StudentRepository {
  findById(id: string): Promise<Student | null>;
  save(student: Student): Promise<void>;
}
