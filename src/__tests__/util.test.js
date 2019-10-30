import { randoColor, userIsSender, messageValid } from '../lib/util';

describe('util functions', () => {
  test('randoColor fn should generate a random number given a max input', () => {
    expect(randoColor(230)).not.toBeNaN();
    expect(randoColor(230)).toBeLessThanOrEqual(230);
  });
  test('userIsSender fn return whether for a given chat if the last message sender is the user', () => {
    const chat = {
      messages: [
        {
          message: 'howdy',
          sender: 'test@test.com',
        },
        {
          message: 'howdy again',
          sender: 'person@person.com',
        },
      ],
    };
    const user = 'person@person.com';
    const user2 = 'test@test.com';
    expect(userIsSender(chat, user)).toBe(true);
    expect(userIsSender(chat, user2)).toBe(false);
  });
  test('messageValid should check if a given string truthy and return length with spaces replaced', () => {
    const txt = 'hello world';
    const txt2 = 'h el  lo           wo   rl   d';
    const txt3 = '';

    expect(messageValid(txt)).toBeGreaterThanOrEqual(1);
    expect(messageValid(txt2)).toEqual(10);
    expect(messageValid(txt3)).toBeFalsy();
  });
});
