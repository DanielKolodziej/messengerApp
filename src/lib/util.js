export const randoColor = max => Math.floor(Math.random() * Math.floor(max));

export const userIsSender = (chat, user) =>
  chat.messages[chat.messages.length - 1].sender === user;
