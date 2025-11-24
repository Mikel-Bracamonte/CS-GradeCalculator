import { Student } from '../model/Student';
import { TeacherAgreement } from '../model/TeacherAgreement';

export type GradeCalculationResult = {
  baseScore: number;
  penaltyApplied: number;
  extraPointsApplied: number;
  finalScore: number;
  attendanceOk: boolean;
  appliedExtraPolicy: boolean;
};

export class GradeCalculator {
  calculate(
    student: Student,
    agreement: TeacherAgreement | null,
    extraPointsIfPolicy: number
  ): GradeCalculationResult {
    const attendanceOk = student.hasReachedMinimumClasses;

    const baseScore =
      student.evaluations.reduce((acc, ev) => acc + ev.score * (ev.weight / 100), 0) || 0;

    if (!attendanceOk) {
      return {
        baseScore,
        penaltyApplied: baseScore,
        extraPointsApplied: 0,
        finalScore: 0,
        attendanceOk,
        appliedExtraPolicy: false,
      };
    }

    const canApplyExtra = Boolean(agreement?.allYearsTeachers) && extraPointsIfPolicy > 0;
    const extra = canApplyExtra ? extraPointsIfPolicy : 0;
    const finalScore = Math.min(20, baseScore + extra);

    return {
      baseScore,
      penaltyApplied: 0,
      extraPointsApplied: extra,
      finalScore,
      attendanceOk,
      appliedExtraPolicy: canApplyExtra,
    };
  }
}
