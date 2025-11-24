import { RegisterEvaluations } from '../../application/usecase/RegisterEvaluations';
import { RegisterAttendance } from '../../application/usecase/RegisterAttendance';
import { InMemoryStudentRepository } from '../persistence/InMemoryStudentRepository';
import {
  closePrompts,
  promptAttendance,
  promptEvaluations,
  promptMenu,
  promptStudentId,
} from './prompts/promptEvaluations';

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
  const registerEvaluations = new RegisterEvaluations(repo);
  const registerAttendance = new RegisterAttendance(repo);

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
