// src/application/usecase/RegisterEvaluations.ts
import { StudentRepository } from '../port/StudentRepository';
import { Evaluation } from '../../domain/model/Evaluation';
import { Student } from '../../domain/model/Student';

export type ExamInput = { score: number; weight: number };

export class RegisterEvaluations {
  constructor(private readonly repo: StudentRepository) {}

  async execute(studentId: string, examsStudents: ExamInput[]): Promise<void> {
    if (examsStudents.length > 10) {
      throw new Error('Máximo 10 evaluaciones por estudiante');
    }
    const evals = examsStudents.map(e => new Evaluation(e.score, e.weight));
    const totalWeight = evals.reduce((acc, e) => acc + e.weight, 0);
    if (totalWeight <= 0 || totalWeight > 100) {
      throw new Error('Total weight must be greater than 0 and at most 100');
    }

    const existing = await this.repo.findById(studentId);
    const student = existing
      ? existing.withEvaluations(evals)
      : new Student(studentId, evals, false);
    await this.repo.save(student);
  }
}
