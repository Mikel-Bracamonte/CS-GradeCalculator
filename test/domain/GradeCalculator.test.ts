import { GradeCalculator } from '../../src/domain/service/GradeCalculator';
import { Student } from '../../src/domain/model/Student';
import { Evaluation } from '../../src/domain/model/Evaluation';
import { TeacherAgreement } from '../../src/domain/model/TeacherAgreement';

describe('GradeCalculator', () => {
  const calculator = new GradeCalculator();

  it('returns 0 if attendance not met', () => {
    const student = new Student('s1', [new Evaluation(15, 100)], false);
    const result = calculator.calculate(student, null, 1);
    expect(result.finalScore).toBe(0);
    expect(result.attendanceOk).toBe(false);
  });

  it('applies extra points when policy allows', () => {
    const student = new Student('s1', [new Evaluation(15, 100)], true);
    const agreement = new TeacherAgreement('2025-1', true);
    const result = calculator.calculate(student, agreement, 1);
    expect(result.baseScore).toBe(15);
    expect(result.extraPointsApplied).toBe(1);
    expect(result.finalScore).toBe(16);
  });

  it('caps final score at 20', () => {
    const student = new Student('s1', [new Evaluation(20, 100)], true);
    const agreement = new TeacherAgreement('2025-1', true);
    const result = calculator.calculate(student, agreement, 5);
    expect(result.finalScore).toBe(20);
  });
});
