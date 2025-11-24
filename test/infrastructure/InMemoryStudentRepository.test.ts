import { InMemoryStudentRepository } from '../../src/infrastructure/persistence/InMemoryStudentRepository';
import { Student } from '../../src/domain/model/Student';
import { Evaluation } from '../../src/domain/model/Evaluation';

describe('InMemoryStudentRepository', () => {
  it('saves and retrieves a student', async () => {
    const repo = new InMemoryStudentRepository();
    const student = new Student('stu-1', [new Evaluation(10, 100)], true);

    await repo.save(student);
    const found = await repo.findById('stu-1');

    expect(found).not.toBeNull();
    expect(found?.id).toBe('stu-1');
    expect(found?.hasReachedMinimumClasses).toBe(true);
  });
});
