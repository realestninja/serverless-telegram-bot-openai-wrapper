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
  aiPersonality,
}) => {
  const { message } = payload;
  const chatId = message.chat.id;

  const kvProps = { accountIdentifier, kvNamespace, apiToken, key: "users" };
  const allowedUsers = await readKv({ ...kvProps }) || [];

  if (!allowedUsers.includes(chatId.toString())) {
    await sendMessageToNewUserWhoNeedsPermission({ token, chatId });
  } else {
    const openAiResponse = await callOpenAiAPI({ prompt: message.text, bearer: openAiBearer, aiPersonality });
    await sendMessageToTelegramUser({ token, chatId, text: openAiResponse });
  };
};
