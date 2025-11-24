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
    expect(result.penaltyApplied).toBe(15);
  });

  it('applies extra points when policy allows', () => {
    const student = new Student('s1', [new Evaluation(15, 100)], true);
    const agreement = new TeacherAgreement('2025-1', true);
    const result = calculator.calculate(student, agreement, 1);
    expect(result.baseScore).toBe(15);
    expect(result.extraPointsApplied).toBe(1);
    expect(result.finalScore).toBe(16);
    expect(result.penaltyApplied).toBe(0);
  });

  it('does not apply extra points when policy forbids', () => {
    const student = new Student('s1', [new Evaluation(15, 100)], true);
    const agreement = new TeacherAgreement('2025-1', false);
    const result = calculator.calculate(student, agreement, 2);
    expect(result.extraPointsApplied).toBe(0);
    expect(result.finalScore).toBe(15);
  });

  it('handles no evaluations with attendance', () => {
    const student = new Student('s1', [], true);
    const agreement = new TeacherAgreement('2025-1', true);
    const result = calculator.calculate(student, agreement, 1);
    expect(result.baseScore).toBe(0);
    expect(result.finalScore).toBe(1);
  });

  it('caps final score at 20', () => {
    const student = new Student('s1', [new Evaluation(20, 100)], true);
    const agreement = new TeacherAgreement('2025-1', true);
    const result = calculator.calculate(student, agreement, 5);
    expect(result.finalScore).toBe(20);
  });

  it('is deterministic for same inputs', () => {
    const student = new Student('s1', [new Evaluation(14, 50), new Evaluation(16, 50)], true);
    const agreement = new TeacherAgreement('2025-1', true);
    const r1 = calculator.calculate(student, agreement, 1);
    const r2 = calculator.calculate(student, agreement, 1);
    expect(r1).toEqual(r2);
  });
});
