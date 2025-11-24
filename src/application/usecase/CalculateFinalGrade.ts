import { StudentRepository } from '../port/StudentRepository';
import { PolicyRepository } from '../port/PolicyRepository';
import { GradeCalculator, GradeCalculationResult } from '../../domain/service/GradeCalculator';

export class CalculateFinalGrade {
  constructor(
    private readonly studentRepo: StudentRepository,
    private readonly policyRepo: PolicyRepository,
    private readonly calculator: GradeCalculator
  ) {}

  async execute(
    studentId: string,
    academicYear: string,
    extraPointsIfPolicy: number
  ): Promise<GradeCalculationResult> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw new Error('Estudiante no encontrado');
    }
    const agreement = await this.policyRepo.findTeacherAgreementByYear(academicYear);
    return this.calculator.calculate(student, agreement, extraPointsIfPolicy);
  }
}
