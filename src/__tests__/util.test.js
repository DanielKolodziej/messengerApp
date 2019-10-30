import { randoColor } from '../lib/util';

describe('util functions', () => {
  test('randoColor fn should generate a random number given a max input', () => {
    expect(randoColor(230)).not.toBeNaN();
    expect(randoColor(230)).toBeLessThanOrEqual(230);
  });
});
