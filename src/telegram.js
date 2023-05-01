import { gatherResponse } from "./helper";

export const sendMessageToTelegramUser = async ({ token, chatId, text }) => {
  const telegramSendToUserUrl = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${text}`
  const telegramResponse = await fetch(telegramSendToUserUrl);
  const responseData = await gatherResponse(telegramResponse);
  // console.log(JSON.stringify(responseData, null, 4));
};

