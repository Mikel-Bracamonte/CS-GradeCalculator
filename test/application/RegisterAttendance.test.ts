import { RegisterAttendance } from '../../src/application/usecase/RegisterAttendance';
import { StudentRepository } from '../../src/application/port/StudentRepository';
import { Student } from '../../src/domain/model/Student';

class FakeStudentRepo implements StudentRepository {
  private store = new Map<string, Student>();
  async findById(id: string): Promise<Student | null> {
    return this.store.get(id) ?? null;
  }
  async save(student: Student): Promise<void> {
    this.store.set(student.id, student);
  }
}

describe('RegisterAttendance use case', () => {
  it('sets attendance for existing student', async () => {
    const repo = new FakeStudentRepo();
    await repo.save(new Student('s1'));
    const useCase = new RegisterAttendance(repo);

    await useCase.execute('s1', true);

    const saved = await repo.findById('s1');
    expect(saved?.hasReachedMinimumClasses).toBe(true);
  });

  it('creates student if not exists', async () => {
    const repo = new FakeStudentRepo();
    const useCase = new RegisterAttendance(repo);

    await useCase.execute('s2', false);
    const saved = await repo.findById('s2');
    expect(saved).not.toBeNull();
    expect(saved?.hasReachedMinimumClasses).toBe(false);
  });
});
