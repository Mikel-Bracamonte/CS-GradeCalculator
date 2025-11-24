import { PolicyRepository } from '../port/PolicyRepository';
import { TeacherAgreement } from '../../domain/model/TeacherAgreement';

export class RegisterTeacherAgreement {
  constructor(private readonly repo: PolicyRepository) {}

  async execute(academicYear: string, allYearsTeachers: boolean): Promise<void> {
    const agreement = new TeacherAgreement(academicYear, allYearsTeachers);
    await this.repo.saveTeacherAgreement(agreement);
  }
}
