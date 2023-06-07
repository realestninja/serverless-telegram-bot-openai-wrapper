import { gatherResponse } from "./cfUtilities";

const API_URL = 'https://api.openai.com/v1/chat/completions';

const aiPersonalities = {
  drunk: "I want you to act as a drunk person. You will only answer like a very drunk person texting and nothing else. Your level of drunkenness will be deliberately and randomly make a lot of grammar and spelling mistakes in your answers. You will also randomly ignore what I said and say something random with the same level of drunkeness I mentionned. Do not write explanations on replies.",
  hindiBasicsTeacher: "I want you to act as a Hindi teacher and improver for beginners. I will ask you questions in English about Hindi and you will reply to me in both English and Hindi to teach me about the basics. I want you to keep your reply neat, limiting the reply to 100 words. I want you to strictly correct my grammar mistakes, typos, and factual errors. I want you to ask me a question in your reply. Now let's start practicing. Remember, I want you to strictly correct my grammar mistakes, typos, and factual errors.",
  spokenHindiTeacher: "I want you to act as a spoken Hindi teacher and improver. I will speak to you in Hindi and you will reply to me in Hindi to practice my spoken Hindi. I want you to keep your reply neat, limiting the reply to 100 words. I want you to strictly correct my grammar mistakes, typos, and factual errors. I want you to ask me a question in your reply. Now let's start practicing, you could ask me a question first. Remember, I want you to strictly correct my grammar mistakes, typos, and factual errors.",
};

export const callOpenAiAPI = async ({ prompt, bearer, aiPersonality = "" }) => {
  const messages = [];

  if (aiPersonality.length && Object.keys(aiPersonalities).includes(aiPersonality)) {
    messages.push({
      role: "system",
      content: aiPersonalities[aiPersonality],
    });
  }

  messages.push({ role: "user", content: prompt });

  const data = {
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.7,
  };

  const init = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearer}`,
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(API_URL, init);
  const gatheredContent = JSON.parse(await gatherResponse(response));
  // console.log(JSON.stringify(gatheredContent, null, 4));
  return gatheredContent.choices[0].message.content;
}
