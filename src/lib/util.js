export const randoColor = max => Math.floor(Math.random() * Math.floor(max));

export const userIsSender = (chat, user) =>
  chat.messages[chat.messages.length - 1].sender === user;

export const messageValid = txt => txt && txt.replace(/\s+/g, '').length;

export const formIsValid = signup =>
  signup.password === signup.passwordConfirmation;

export const clickedMessageWhereNotSender = (chatIndex, chats, email) =>
  chats[chatIndex].messages[chats[chatIndex].messages.length - 1].sender !==
  email;

export const buildDocKey = (email, friend) => [email, friend].sort().join(';');
