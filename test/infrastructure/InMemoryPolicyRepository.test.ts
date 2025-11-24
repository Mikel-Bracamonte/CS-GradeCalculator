import { InMemoryPolicyRepository } from '../../src/infrastructure/persistence/InMemoryPolicyRepository';
import { TeacherAgreement } from '../../src/domain/model/TeacherAgreement';

describe('InMemoryPolicyRepository', () => {
  it('stores and retrieves agreement by year', async () => {
    const repo = new InMemoryPolicyRepository();
    const agreement = new TeacherAgreement('2025-1', true);

    await repo.saveTeacherAgreement(agreement);
    const found = await repo.findTeacherAgreementByYear('2025-1');

    expect(found).not.toBeNull();
    expect(found?.allYearsTeachers).toBe(true);
  });
});
