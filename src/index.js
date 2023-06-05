import { OWNER_ACTION_GRANT_PERMISSION, USER_ACTION_REQUEST_PERMISSION } from "./constants/callbackConstants";
import { handleIncomingMessage } from "./messageHandler";
import { activateNewUser, handlePermissionRequest } from "./handleNewUser";

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
      } = env;
      const payload = await request.json()

      // handle callbacks
      if ("callback_query" in payload) {
        const callbackAction = payload.callback_query.data;
        console.log("callbackAction:", callbackAction);

        if (callbackAction === USER_ACTION_REQUEST_PERMISSION) {
          await handlePermissionRequest({
            payload,
            token: BOT_TOKEN,
            ownerId: BOT_OWNER_ID,
          });
        }

        if (callbackAction.includes(OWNER_ACTION_GRANT_PERMISSION)) {
          const userIdOfNewUser = callbackAction.split("DATA:")[1];
          await activateNewUser({
            userIdOfNewUser,
            accountIdentifier: CF_ACCOUNT_IDENTIFIER,
            kvNamespace: CF_KV_NAMESPACE_IDENTIFIER,
            apiToken: CF_API_TOKEN,
          });
          return new Response("OK");
        }
      }

      // handle messages
      if ("message" in payload) {
        await handleIncomingMessage({
          payload,
          token: BOT_TOKEN,
          openAiBearer: OPEN_AI_API_KEY,
          accountIdentifier: CF_ACCOUNT_IDENTIFIER,
          kvNamespace: CF_KV_NAMESPACE_IDENTIFIER,
          apiToken: CF_API_TOKEN,
        })
      }
    }

    return new Response("hello world");
	},
};
