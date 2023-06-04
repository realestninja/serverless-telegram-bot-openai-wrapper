import { gatherResponse } from "./cfUtilities";
import { isEmpty } from "./helper";

export const sendMessageToTelegramUser = async ({ token, chatId, text, replyMarkup = {} }) => {
  const telegramSendToUserUrl = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${text}${!isEmpty(replyMarkup) ? "&replymarkup=" + JSON.stringify(replyMarkup) : ""}`;
  // console.log("telegramSendToUserUrl:", telegramSendToUserUrl);

  try {
    const telegramResponse = await fetch(telegramSendToUserUrl);
    const gatheredContent = JSON.parse(await gatherResponse(telegramResponse));
    console.log("gatheredContent:", gatheredContent);
    if (!gatheredContent.ok) {
      throw new Error(`Error sending message to Telegram user. HTTP status: ${gatheredContent.status}`);
    }
    return gatheredContent;
  } catch (error) {
    console.error("Error sending message to Telegram user:", error);
    throw error;
  }
};
