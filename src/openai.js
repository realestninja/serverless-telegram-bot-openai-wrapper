import { gatherResponse } from "./helper";

const API_URL = 'https://api.openai.com/v1/chat/completions';

export const callOpenAiAPI = async ({ prompt, bearer }) => {
  console.log("prompt:", prompt);

  const API_URL = 'https://api.openai.com/v1/chat/completions';

  const data = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
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
  const gatheredContent = await gatherResponse(response);
  return gatheredContent.choices[0].message.content;
}
