import { gatherResponse } from "./cfUtilities";
import { isEmpty } from "./helper";

export const sendMessageToTelegramUser = async ({ token, chatId, text, replyMarkup = {} }) => {
  const telegramSendToUserUrl = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${text}${!isEmpty(replyMarkup) ? "&reply_markup=" + JSON.stringify(replyMarkup) : ""}`;

  try {
    const telegramResponse = await fetch(telegramSendToUserUrl);
    const gatheredContent = JSON.parse(await gatherResponse(telegramResponse));
    if (!gatheredContent.ok) {
      throw new Error(`Error sending message to Telegram user. HTTP status: ${gatheredContent.status}`);
    }
    return gatheredContent;
  } catch (error) {
    console.error("Error sending message to Telegram user:", error);
    throw error;
  }
};

const sendTypingAction = ({ token, chatId }) => {
  const apiUrl = `https://api.telegram.org/bot${token}/sendChatAction`;
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      action: "typing",
    }),
  })
  .catch(error => {
    console.error("Error sending typing action:", error);
  });
};

export const sendContinuousTypingAction = ({ token, chatId }) => {
  sendTypingAction({ token, chatId });
  const typingInterval = setInterval(() => {
    sendTypingAction({ token, chatId });
  }, 5000);
  return typingInterval;
};
