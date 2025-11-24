import { RegisterTeacherAgreement } from '../../src/application/usecase/RegisterTeacherAgreement';
import { PolicyRepository } from '../../src/application/port/PolicyRepository';
import { TeacherAgreement } from '../../src/domain/model/TeacherAgreement';

class FakePolicyRepo implements PolicyRepository {
  private store = new Map<string, TeacherAgreement>();
  async saveTeacherAgreement(agreement: TeacherAgreement): Promise<void> {
    this.store.set(agreement.academicYear, agreement);
  }
  async findTeacherAgreementByYear(academicYear: string): Promise<TeacherAgreement | null> {
    return this.store.get(academicYear) ?? null;
  }
}

describe('RegisterTeacherAgreement use case', () => {
  it('saves agreement for academic year', async () => {
    const repo = new FakePolicyRepo();
    const useCase = new RegisterTeacherAgreement(repo);

    await useCase.execute('2025-1', true);

    const saved = await repo.findTeacherAgreementByYear('2025-1');
    expect(saved).not.toBeNull();
    expect(saved?.allYearsTeachers).toBe(true);
  });
});
