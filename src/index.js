export default {
	async fetch(request, env, ctx) {
    const gatherResponse = async (response) =>  {
      return await response.json();
    }

    const sendMessageToTelegramUser = async ({ token, chatId, text }) => {
      const telegramSendToUserUrl = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${text}`
      const telegramResponse = await fetch(telegramSendToUserUrl);
      const responseData = await gatherResponse(telegramResponse);
      console.log(JSON.stringify(responseData, null, 4));
    };

    if (request.method === "POST") {
      const payload = await request.json()
      if ("message" in payload) {
        const {
          BOT_TOKEN,
          OPEN_AI_API_KEY,
          // ORGANIZATION_KEY,
        } = env;

        const { message } = payload;

        const chatId = message.chat.id;

        if (chatId !== 105314034) return null;

        console.log("chatId:", chatId);
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

        await sendMessageToTelegramUser({ token: BOT_TOKEN, chatId, text: openAiResponse });
      }
    }

    return new Response("hello world");
	},
};
