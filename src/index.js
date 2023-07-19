import { OWNER_ACTION_GRANT_PERMISSION, USER_ACTION_REQUEST_PERMISSION } from "./constants/callbackConstants";
import { handleIncomingMessage } from "./messageHandler";
import { activateNewUser, handlePermissionRequest, sendMessageToNewUserWhoNeedsPermission } from "./handleNewUser";
import { sendMessageToTelegramUser } from "./telegram";

export default {
	async fetch(request, env, ctx) {
    if (request.method === "POST") {
      const {
        BOT_TOKEN,
        BOT_OWNER_ID,
        OPEN_AI_API_KEY,
        CF_ACCOUNT_IDENTIFIER,
        CF_KV_NAMESPACE_IDENTIFIER,
        CF_API_TOKEN,
        AI_PERSONALITY,
      } = env;
      const payload = await request.json()

      // handle callbacks
      if ("callback_query" in payload) {
        const callbackAction = payload.callback_query.data;
        console.log("callbackAction:", callbackAction);

        // user has requested permission
        if (callbackAction === USER_ACTION_REQUEST_PERMISSION) {
          await handlePermissionRequest({
            payload,
            token: BOT_TOKEN,
            ownerId: BOT_OWNER_ID,
          });
        }

        // owner has granted permission
        if (callbackAction.includes(OWNER_ACTION_GRANT_PERMISSION)) {
          const userIdOfNewUser = callbackAction.split("DATA:")[1];
          const successfulActivation = await activateNewUser({
            userIdOfNewUser,
            accountIdentifier: CF_ACCOUNT_IDENTIFIER,
            kvNamespace: CF_KV_NAMESPACE_IDENTIFIER,
            kvToken: CF_API_TOKEN,
          });
          if (successfulActivation) {
            sendMessageToTelegramUser({
              token: BOT_TOKEN,
              chatId: userIdOfNewUser,
              text: "Permission has been granted.",
            });
          }
          return new Response("OK");
        }
      }

      // handle incoming text messages
      if ("message" in payload ) {
        const messageText = payload.message.text;
        const chatId = payload.message.chat.id;

        if (messageText.startsWith('/start')) {
          // Handle /start command
          await sendMessageToNewUserWhoNeedsPermission({ token: BOT_TOKEN, chatId });
        } else {
          // default message handler (call open ai)
          await handleIncomingMessage({
            payload,
            token: BOT_TOKEN,
            openAiBearer: OPEN_AI_API_KEY,
            accountIdentifier: CF_ACCOUNT_IDENTIFIER,
            kvNamespace: CF_KV_NAMESPACE_IDENTIFIER,
            apiToken: CF_API_TOKEN,
            aiPersonality: AI_PERSONALITY,
          })
        }
      }
    }

    return new Response("hello world");
	},
};
