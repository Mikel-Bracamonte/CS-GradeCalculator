import { Student } from '../../domain/model/Student';
import { StudentRepository } from '../../application/port/StudentRepository';

export class InMemoryStudentRepository implements StudentRepository {
  private readonly store = new Map<string, Student>();

  async findById(id: string): Promise<Student | null> {
    return this.store.get(id) ?? null;
  }

  async save(student: Student): Promise<void> {
    this.store.set(student.id, student);
  }
}
