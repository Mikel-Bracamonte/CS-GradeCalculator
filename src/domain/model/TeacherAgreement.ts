export class TeacherAgreement {
  constructor(public readonly academicYear: string, public readonly allYearsTeachers: boolean) {
    if (!academicYear || !academicYear.trim()) {
      throw new Error('Academic year is required');
    }
  }
}
