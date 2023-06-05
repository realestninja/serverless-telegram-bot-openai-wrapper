import { readKv } from "./cfUtilities";
import { sendMessageToNewUserWhoNeedsPermission } from "./handleNewUser";
import { callOpenAiAPI } from "./openai";
import { sendMessageToTelegramUser } from "./telegram";

export const handleIncomingMessage = async ({
  token,
  openAiBearer,
  accountIdentifier,
  apiToken,
  kvNamespace,
  payload,
}) => {
  const { message } = payload;
  const chatId = message.chat.id;

  const kvProps = { accountIdentifier, kvNamespace, apiToken, key: "users" };
  const allowedUsers = await readKv({ ...kvProps }) || [];

  if (!allowedUsers.includes(chatId)) {
    await sendMessageToNewUserWhoNeedsPermission({ token, chatId });
  } else {
    const openAiResponse = await callOpenAiAPI({ prompt: message.text, bearer: openAiBearer });
    await sendMessageToTelegramUser({ token, chatId, text: openAiResponse });
  };
};