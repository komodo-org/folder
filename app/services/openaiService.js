import { Configuration, OpenAIApi } from "openai";

const runtimeConfig = useRuntimeConfig();

const myConfig = new Configuration({
  apiKey: runtimeConfig.public.apiKey,
  dangerouslyAllowBrowser: true,
});

const openai = new OpenAIApi(myConfig);

async function callOpenAI(message) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      max_tokens: 100,
      temperature: 0.7,
    });
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI API call failed:", error);
    throw error;
  }
}

export { callOpenAI };
