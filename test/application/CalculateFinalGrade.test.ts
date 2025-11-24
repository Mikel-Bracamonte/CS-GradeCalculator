import { CalculateFinalGrade } from '../../src/application/usecase/CalculateFinalGrade';
import { StudentRepository } from '../../src/application/port/StudentRepository';
import { PolicyRepository } from '../../src/application/port/PolicyRepository';
import { Student } from '../../src/domain/model/Student';
import { Evaluation } from '../../src/domain/model/Evaluation';
import { TeacherAgreement } from '../../src/domain/model/TeacherAgreement';
import { GradeCalculator } from '../../src/domain/service/GradeCalculator';

class FakeStudentRepo implements StudentRepository {
  private store = new Map<string, Student>();
  async findById(id: string): Promise<Student | null> {
    return this.store.get(id) ?? null;
  }
  async save(student: Student): Promise<void> {
    this.store.set(student.id, student);
  }
}

class FakePolicyRepo implements PolicyRepository {
  private store = new Map<string, TeacherAgreement>();
  async saveTeacherAgreement(agreement: TeacherAgreement): Promise<void> {
    this.store.set(agreement.academicYear, agreement);
  }
  async findTeacherAgreementByYear(academicYear: string): Promise<TeacherAgreement | null> {
    return this.store.get(academicYear) ?? null;
  }
}

describe('CalculateFinalGrade use case', () => {
  it('calculates final grade with extra points', async () => {
    const studentRepo = new FakeStudentRepo();
    const policyRepo = new FakePolicyRepo();
    await studentRepo.save(new Student('s1', [new Evaluation(15, 100)], true));
    await policyRepo.saveTeacherAgreement(new TeacherAgreement('2025-1', true));

    const useCase = new CalculateFinalGrade(studentRepo, policyRepo, new GradeCalculator());
    const result = await useCase.execute('s1', '2025-1', 1);

    expect(result.finalScore).toBe(16);
    expect(result.appliedExtraPolicy).toBe(true);
    expect(result.penaltyApplied).toBe(0);
  });

  it('throws if student not found', async () => {
    const studentRepo = new FakeStudentRepo();
    const policyRepo = new FakePolicyRepo();
    const useCase = new CalculateFinalGrade(studentRepo, policyRepo, new GradeCalculator());

    await expect(useCase.execute('missing', '2025-1', 1)).rejects.toThrow('Estudiante no encontrado');
  });
});
