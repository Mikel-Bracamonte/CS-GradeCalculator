import { RegisterEvaluations } from '../../src/application/usecase/RegisterEvaluations';
import { StudentRepository } from '../../src/application/port/StudentRepository';
import { Student } from '../../src/domain/model/Student';
import { Evaluation } from '../../src/domain/model/Evaluation';

class FakeStudentRepo implements StudentRepository {
  private store = new Map<string, Student>();

  async findById(id: string): Promise<Student | null> {
    return this.store.get(id) ?? null;
  }

  async save(student: Student): Promise<void> {
    this.store.set(student.id, student);
  }
}

describe('RegisterEvaluations use case', () => {
  it('saves evaluations for a new student', async () => {
    const repo = new FakeStudentRepo();
    const useCase = new RegisterEvaluations(repo);

    await useCase.execute('stu-1', [
      { score: 15, weight: 50 },
      { score: 18, weight: 50 },
    ]);

    const saved = await repo.findById('stu-1');
    expect(saved).not.toBeNull();
    expect(saved?.evaluations).toHaveLength(2);
    expect(saved?.totalWeight()).toBe(100);
  });

  it('updates an existing student', async () => {
    const repo = new FakeStudentRepo();
    const existing = new Student('stu-2', [new Evaluation(10, 100)], true);
    await repo.save(existing);
    const useCase = new RegisterEvaluations(repo);

    await useCase.execute('stu-2', [{ score: 19, weight: 100 }]);

    const saved = await repo.findById('stu-2');
    expect(saved?.evaluations[0].score).toBe(19);
    expect(saved?.hasReachedMinimumClasses).toBe(true);
  });

  it('rejects when total weight exceeds 100', async () => {
    const repo = new FakeStudentRepo();
    const useCase = new RegisterEvaluations(repo);

    await expect(
      useCase.execute('stu-3', [
        { score: 10, weight: 60 },
        { score: 12, weight: 50 },
      ])
    ).rejects.toThrow('Total weight must be greater than 0 and at most 100');
  });

  it('rejects more than 10 evaluations', async () => {
    const repo = new FakeStudentRepo();
    const useCase = new RegisterEvaluations(repo);
    const many = Array.from({ length: 11 }, () => ({ score: 10, weight: 10 }));

    await expect(useCase.execute('stu-4', many)).rejects.toThrow('Máximo 10 evaluaciones');
  });

  it('rejects zero evaluations', async () => {
    const repo = new FakeStudentRepo();
    const useCase = new RegisterEvaluations(repo);
    await expect(useCase.execute('stu-5', [])).rejects.toThrow(
      'Total weight must be greater than 0 and at most 100'
    );
  });
});
