import { gatherResponse } from "./helper";

const API_URL = 'https://api.openai.com/v1/chat/completions';

export const callOpenAiAPI = async ({ prompt, bearer }) => {
  console.log("prompt:", prompt);

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
  const gatheredContent = JSON.parse(await gatherResponse(response));
  // console.log(JSON.stringify(gatheredContent, null, 4));
  return gatheredContent.choices[0].message.content;
}
