import { createInterface } from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { ExamInput } from '../../../application/usecase/RegisterEvaluations';

const rl = createInterface({ input, output });

async function askNumber(question: string): Promise<number> {
  const answer = (await rl.question(question)).trim();
  const value = Number(answer);
  if (!Number.isFinite(value)) {
    throw new Error('Debe ingresar un número');
  }
  return value;
}

export async function promptMenu(): Promise<number> {
  console.log('\n=== Menú principal ===');
  console.log('1) Registrar evaluaciones de un estudiante');
  console.log('2) Registrar asistencia mínima de un estudiante');
  console.log('0) Salir');
  return askNumber('Seleccione una opción: ');
}

export async function promptStudentId(): Promise<string> {
  const id = (await rl.question('Código del estudiante: ')).trim();
  if (!id) {
    throw new Error('El código es obligatorio');
  }
  return id;
}

export async function promptEvaluations(): Promise<ExamInput[]> {
  const count = await askNumber('Cantidad de evaluaciones: ');
  if (count <= 0) {
    throw new Error('Debe registrar al menos una evaluación');
  }
  const evaluations: ExamInput[] = [];
  for (let i = 0; i < count; i++) {
    const score = await askNumber(`Nota de la evaluación ${i + 1}: `);
    const weight = await askNumber(`Peso (%) de la evaluación ${i + 1}: `);
    evaluations.push({ score, weight });
  }
  return evaluations;
}

export async function closePrompts(): Promise<void> {
  await rl.close();
}

export async function promptAttendance(): Promise<boolean> {
  const ans = (await rl.question('¿Cumplió asistencia mínima? (s/n): ')).trim().toLowerCase();
  if (ans === 's' || ans === 'si' || ans === 'sí') return true;
  if (ans === 'n' || ans === 'no') return false;
  throw new Error('Respuesta inválida, use s/n');
}
