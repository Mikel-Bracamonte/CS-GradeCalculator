import { RegisterEvaluations } from '../../application/usecase/RegisterEvaluations';
import { RegisterAttendance } from '../../application/usecase/RegisterAttendance';
import { RegisterTeacherAgreement } from '../../application/usecase/RegisterTeacherAgreement';
import { CalculateFinalGrade } from '../../application/usecase/CalculateFinalGrade';
import { InMemoryStudentRepository } from '../persistence/InMemoryStudentRepository';
import { InMemoryPolicyRepository } from '../persistence/InMemoryPolicyRepository';
import {
  closePrompts,
  promptAttendance,
  promptAcademicYear,
  promptEvaluations,
  promptExtraPoints,
  promptMenu,
  promptYesNo,
  promptStudentId,
} from './prompts/promptEvaluations';
import { GradeCalculator } from '../../domain/service/GradeCalculator';

async function handleRegisterEvaluations(
  useCase: RegisterEvaluations,
  repo: InMemoryStudentRepository
): Promise<void> {
  const studentId = await promptStudentId();
  const evaluations = await promptEvaluations();
  await useCase.execute(studentId, evaluations);
  console.log('\nEvaluaciones registradas con éxito.');
  const stored = await repo.findById(studentId);
  if (stored) {
    console.log(`Estudiante: ${stored.id}`);
    stored.evaluations.forEach((e, idx) =>
      console.log(`  Eval ${idx + 1}: nota=${e.score}, peso=${e.weight}%`)
    );
    console.log(`  Peso total: ${stored.totalWeight()}%`);
  }
}

async function main() {
  const repo = new InMemoryStudentRepository();
  const policyRepo = new InMemoryPolicyRepository();
  const registerEvaluations = new RegisterEvaluations(repo);
  const registerAttendance = new RegisterAttendance(repo);
  const registerTeacherAgreement = new RegisterTeacherAgreement(policyRepo);
  const calculateFinalGrade = new CalculateFinalGrade(repo, policyRepo, new GradeCalculator());

  try {
    let exit = false;
    while (!exit) {
      const option = await promptMenu();
      switch (option) {
        case 1:
          try {
            await handleRegisterEvaluations(registerEvaluations, repo);
          } catch (err) {
            console.error('Error:', (err as Error).message);
          }
          break;
        case 2:
          try {
            const studentId = await promptStudentId();
            const attended = await promptAttendance();
            await registerAttendance.execute(studentId, attended);
            console.log('Asistencia registrada correctamente.');
          } catch (err) {
            console.error('Error:', (err as Error).message);
          }
          break;
        case 3:
          try {
            const academicYear = await promptAcademicYear();
            const agree = await promptYesNo('¿Todos los docentes están de acuerdo? (s/n): ');
            await registerTeacherAgreement.execute(academicYear, agree);
            console.log('Acuerdo docente registrado.');
          } catch (err) {
            console.error('Error:', (err as Error).message);
          }
          break;
        case 4:
          try {
            const studentId = await promptStudentId();
            const academicYear = await promptAcademicYear();
            const extra = await promptExtraPoints();
            const result = await calculateFinalGrade.execute(studentId, academicYear, extra);
            console.log('\n== Resultado de nota final ==');
            console.log(`Asistencia mínima: ${result.attendanceOk ? 'Cumple' : 'No cumple'}`);
            console.log(`Nota base (ponderada): ${result.baseScore.toFixed(2)}`);
            if (!result.attendanceOk) {
              console.log(`Penalización por inasistencia: -${result.penaltyApplied.toFixed(2)} (nota final 0)`);
            } else {
              console.log(`Penalización por inasistencia: 0`);
              console.log(
                `Puntos extra aplicados: ${result.appliedExtraPolicy ? result.extraPointsApplied : 0}`
              );
            }
            console.log(`Nota final: ${result.finalScore.toFixed(2)}`);
          } catch (err) {
            console.error('Error:', (err as Error).message);
          }
          break;
        case 0:
          exit = true;
          console.log('Saliendo...');
          break;
        default:
          console.log('Opción inválida, intente de nuevo.');
      }
    }
  } catch (err) {
    console.error('Error inesperado:', (err as Error).message);
  } finally {
    await closePrompts();
  }
}

void main();
