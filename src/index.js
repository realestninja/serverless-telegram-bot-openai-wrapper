const sendToTelegram = ({ token, chatId, text }) => {
  const telegramSendToUserUrl = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${text}`
  fetch(telegramSendToUserUrl);
};

export default {
	async fetch(request, env, ctx) {
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
        // console.log("promptFromUser:", promptFromUser);

        const url = 'https://api.openai.com/v1/chat/completions';
        const data = {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: promptFromUser }],
          temperature: 0.7,
        };

        async function makeRequest() {
          try {
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPEN_AI_API_KEY}`,
              },
              body: JSON.stringify(data),
            });

            const result = await response.json();
            const openAiResponse = result.choices[0].message.content;

            sendToTelegram({ token: BOT_TOKEN, chatId, text: openAiResponse });
          } catch (error) {
            sendToTelegram({ token: BOT_TOKEN, chatId, text: error });
          }
        }

        sendToTelegram({ token: BOT_TOKEN, chatId, text: "prompting open ai now! "});
        makeRequest();
      }
    }
    return new Response("hello world");
	},
};
