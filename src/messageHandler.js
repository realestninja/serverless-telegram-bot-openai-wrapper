import { readKv } from "./cfUtilities";
import { sendMessageToNewUserWhoNeedsPermission } from "./handleNewUser";
import { callOpenAiAPI } from "./openai";
import {
  sendMessageToTelegramUser,
  sendContinuousTypingAction,
} from "./telegram";

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
    const continuousTypingActionInterval = sendContinuousTypingAction({ token, chatId });
    const openAiResponse = await callOpenAiAPI({ prompt: message.text, bearer: openAiBearer, aiPersonality });
    clearInterval(continuousTypingActionInterval);
    await sendMessageToTelegramUser({ token, chatId, text: openAiResponse });
  };
};
