export class Evaluation {
  constructor(public readonly score: number, public readonly weight: number) {
    if (!Number.isFinite(score) || score < 0 || score > 20) {
      throw new Error('Score must be between 0 and 20');
    }
    if (!Number.isFinite(weight) || weight <= 0 || weight > 100) {
      throw new Error('Weight must be greater than 0 and at most 100');
    }
  }
}
