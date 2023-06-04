import { gatherResponse } from "./helper";

export const sendMessageToTelegramUser = async ({ token, chatId, text }) => {
  const telegramSendToUserUrl = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${text}`
  const telegramResponse = await fetch(telegramSendToUserUrl);
  // const gatheredContent = JSON.parse(await gatherResponse(telegramResponse));
  // console.log(JSON.stringify(gatheredContent, null, 4));
};

