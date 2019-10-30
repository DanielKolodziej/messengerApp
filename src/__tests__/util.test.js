import {
  randoColor,
  userIsSender,
  messageValid,
  formIsValid,
  clickedMessageWhereNotSender,
  buildDocKey,
} from '../lib/util';

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

    expect(messageValid(txt)).toEqual(10);
    expect(messageValid(txt2)).toEqual(10);
    expect(messageValid(txt3)).toBeFalsy();
  });

  test('formIsValid checks if password matches password confirmation', () => {
    const signup = {
      password: 'pass123',
      passwordConfirmation: 'pass123',
    };
    const signup2 = {
      password: 'pass123',
      passwordConfirmation: 'pass1234',
    };
    expect(formIsValid(signup)).toBeTruthy();
    expect(formIsValid(signup2)).toBeFalsy();
  });

  test('clickedMessageWhereNotSender checks whether the last sender in a selected chat is the user', () => {
    const chatIndex = 0;
    const chatIndex2 = 1;
    const email = 'dkolodziej@interiorinvestments.com';
    const chats = [
      {
        messages: [
          {
            message: 'hello',
            sender: 'dkolodziej@interiorinvestments.com',
            timestamp: 'Oct 24th 2019, 9:07:21 am',
          },
          {
            message: 'Did you get my message?',
            sender: 'dkolodziej@interiorinvestments.com',
            timestamp: 'Oct 25th 2019, 11:07:21 am',
          },
        ],
        receiverHasRead: false,
        users: ['dkolodziej@interiorinvestments.com', '123@123.com'],
      },
      {
        messages: [
          {
            message: 'hello',
            sender: 'dkolodziej@interiorinvestments.com',
            timestamp: 'Oct 24th 2019, 6:07:21 pm',
          },
          {
            message: 'hello to you',
            sender: 'qwe@qwe.com',
            timestamp: 'Oct 26th 2019, 3:03:21 pm',
          },
        ],
        receiverHasRead: true,
        users: ['qwe@qwe.com', 'person@person.com'],
      },
    ];
    expect(clickedMessageWhereNotSender(chatIndex, chats, email)).toBeFalsy();
    expect(clickedMessageWhereNotSender(chatIndex2, chats, email)).toBeTruthy();
  });

  test('buildDocKey creates key to access doc in db', () => {
    const email = 'dkolodziej@interiorinvestments.com';
    const friend = '123@123.com';
    expect(buildDocKey(email, friend)).toBeTruthy();
    expect(buildDocKey(email, friend)).toBe(
      '123@123.com;dkolodziej@interiorinvestments.com'
    );
  });
});
