const sendToTelegram = ({ token, chatId, text }) => {
  const telegramSendToUserUrl = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${text}`
  fetch(telegramSendToUserUrl);
};

export default {
	async fetch(request, env, ctx) {
    async function gatherResponse(response) {
      const { headers } = response;
      const contentType = headers.get("content-type") || "";
      return await response.json();
    }

    if (request.method === "POST") {
      const payload = await request.json()
      if ("message" in payload) {
        const {
          BOT_TOKEN,
          OPEN_AI_API_KEY,
          // ORGANIZATION_KEY,
        } = env;

        const { message } = payload;

        const chatId = message.chat.id
        const promptFromUser = message.text;
        console.log("promptFromUser:", promptFromUser);

        const url = 'https://api.openai.com/v1/chat/completions';
        const data = {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: promptFromUser }],
          temperature: 0.7,
        };

        const init = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPEN_AI_API_KEY}`,
          },
          body: JSON.stringify(data),
        };

        const response = await fetch(url, init);
        const results = await gatherResponse(response);
        const openAiResponse = results.choices[0].message.content;

        sendToTelegram({ token: BOT_TOKEN, chatId, text: openAiResponse });
      }
    }

    return new Response("hello world");
	},
};
