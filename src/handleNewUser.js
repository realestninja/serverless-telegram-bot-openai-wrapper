import { sendMessageToTelegramUser } from "./telegram";

const replyMarkup = {
  inline_keyboard: [
    [{ text: 'Some button text 1', callback_data: '1' }],
    [{ text: 'Some button text 2', callback_data: '2' }],
    [{ text: 'Some button text 3', callback_data: '3' }]
  ],
};

export const handleNewUser = async ({ BOT_TOKEN, chatId }) => {
  return await sendMessageToTelegramUser({ token: BOT_TOKEN, chatId, text: "Permission required.", replyMarkup });
};
