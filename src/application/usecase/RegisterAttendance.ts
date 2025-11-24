import { StudentRepository } from '../port/StudentRepository';
import { Student } from '../../domain/model/Student';

export class RegisterAttendance {
  constructor(private readonly repo: StudentRepository) {}

  async execute(studentId: string, hasReachedMinimumClasses: boolean): Promise<void> {
    const existing = await this.repo.findById(studentId);
    const student = existing
      ? existing.withAttendance(hasReachedMinimumClasses)
      : new Student(studentId, [], hasReachedMinimumClasses);
    await this.repo.save(student);
  }
}
