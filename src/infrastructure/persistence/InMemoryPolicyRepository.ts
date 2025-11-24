import { PolicyRepository } from '../../application/port/PolicyRepository';
import { TeacherAgreement } from '../../domain/model/TeacherAgreement';

export class InMemoryPolicyRepository implements PolicyRepository {
  private readonly agreements = new Map<string, TeacherAgreement>();

  async saveTeacherAgreement(agreement: TeacherAgreement): Promise<void> {
    this.agreements.set(agreement.academicYear, agreement);
  }

  async findTeacherAgreementByYear(academicYear: string): Promise<TeacherAgreement | null> {
    return this.agreements.get(academicYear) ?? null;
  }
}
