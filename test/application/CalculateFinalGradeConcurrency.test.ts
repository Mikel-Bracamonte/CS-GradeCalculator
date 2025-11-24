import { CalculateFinalGrade } from '../../src/application/usecase/CalculateFinalGrade';
import { InMemoryStudentRepository } from '../../src/infrastructure/persistence/InMemoryStudentRepository';
import { InMemoryPolicyRepository } from '../../src/infrastructure/persistence/InMemoryPolicyRepository';
import { Student } from '../../src/domain/model/Student';
import { Evaluation } from '../../src/domain/model/Evaluation';
import { TeacherAgreement } from '../../src/domain/model/TeacherAgreement';
import { GradeCalculator } from '../../src/domain/service/GradeCalculator';

describe('CalculateFinalGrade concurrency', () => {
  it('handles 50 concurrent grade calculations', async () => {
    const studentRepo = new InMemoryStudentRepository();
    const policyRepo = new InMemoryPolicyRepository();
    const useCase = new CalculateFinalGrade(studentRepo, policyRepo, new GradeCalculator());
    const academicYear = '2025-1';
    await policyRepo.saveTeacherAgreement(new TeacherAgreement(academicYear, true));

    const numUsers = 50;
    for (let i = 0; i < numUsers; i++) {
      const id = `s${i}`;
      await studentRepo.save(new Student(id, [new Evaluation(15, 100)], true));
    }

    const promises = Array.from({ length: numUsers }, (_, i) =>
      useCase.execute(`s${i}`, academicYear, 1)
    );

    const results = await Promise.all(promises);
    expect(results).toHaveLength(numUsers);
    results.forEach(r => {
      expect(r.finalScore).toBe(16);
      expect(r.appliedExtraPolicy).toBe(true);
    });
  });
});
