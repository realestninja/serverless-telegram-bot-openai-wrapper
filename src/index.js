import { callOpenAiAPI } from "./openai";
import { sendMessageToTelegramUser } from "./telegram";

export default {
	async fetch(request, env, ctx) {
    if (request.method === "POST") {
      const payload = await request.json()
      if ("message" in payload) {
        const {
          BOT_TOKEN,
          BOT_OWNER_ID,
          OPEN_AI_API_KEY,
        } = env;
        const { message } = payload;

        const chatId = message.chat.id;

        // ignore unknown people
        if (chatId !== Number(BOT_OWNER_ID)) return null;
        const openAiResponse = await callOpenAiAPI({ prompt: message.text, bearer: OPEN_AI_API_KEY });
        await sendMessageToTelegramUser({ token: BOT_TOKEN, chatId, text: openAiResponse });
      }
    }

    return new Response("hello world");
	},
};
