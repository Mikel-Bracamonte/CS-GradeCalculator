import { TeacherAgreement } from '../../domain/model/TeacherAgreement';

export interface PolicyRepository {
  saveTeacherAgreement(agreement: TeacherAgreement): Promise<void>;
  findTeacherAgreementByYear(academicYear: string): Promise<TeacherAgreement | null>;
}
