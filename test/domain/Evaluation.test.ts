import { Evaluation } from '../../src/domain/model/Evaluation';

describe('Evaluation', () => {
  it('creates a valid evaluation', () => {
    const eval1 = new Evaluation(18, 30);
    expect(eval1.score).toBe(18);
    expect(eval1.weight).toBe(30);
  });

  it('rejects invalid scores', () => {
    expect(() => new Evaluation(-1, 10)).toThrow();
    expect(() => new Evaluation(25, 10)).toThrow();
  });

  it('rejects invalid weights', () => {
    expect(() => new Evaluation(10, 0)).toThrow();
    expect(() => new Evaluation(10, 150)).toThrow();
  });
});
