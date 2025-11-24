import { Evaluation } from './Evaluation';

export class Student {
  constructor(
    public readonly id: string,
    public readonly evaluations: Evaluation[] = [],
    public readonly hasReachedMinimumClasses: boolean = false
  ) {
    if (!id || !id.trim()) {
      throw new Error('Student id is required');
    }
  }

  withEvaluations(evaluations: Evaluation[]): Student {
    return new Student(this.id, [...evaluations], this.hasReachedMinimumClasses);
  }

  withAttendance(hasReachedMinimumClasses: boolean): Student {
    return new Student(this.id, [...this.evaluations], hasReachedMinimumClasses);
  }

  totalWeight(): number {
    return this.evaluations.reduce((acc, e) => acc + e.weight, 0);
  }
}
