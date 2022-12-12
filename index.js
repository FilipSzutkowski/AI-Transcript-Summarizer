import * as dotenv from 'dotenv';
dotenv.config();
import { Configuration, OpenAIApi } from 'openai';
import { encode, decode } from 'gpt-3-encoder';
import * as aiInput from './ai-input.json' assert { type: 'json' };
import * as fs from 'fs';

const APIKey = process.env.OPENAI_API_KEY;
const { first_prompt, loop_prompt } = aiInput.default;

if (!first_prompt || !loop_prompt) {
  console.error('Provide prompts for the AI in ai-input.json file.');
  return;
}

main();

async function main() {
  if (!APIKey) {
    console.error('Open AI API key not provided.');
    console.log(
      'Obtain the key from the link below. Create an env variable called "OPENAI_API_KEY" with the key as value.'
    );
    console.log('https://beta.openai.com/account/api-keys');

    return;
  }

  const inputText = fs.readFileSync(process.env.INPUT_FILE, {
    encoding: 'utf-8',
  });
  const chunkedText = chunkText(inputText);
  const res = await summarizeText(chunkedText);

  fs.writeFileSync('summary.txt', res);
}

/**
 *
 * @param {string[]} textChunks
 */
async function summarizeText(textChunks) {
  const configuration = new Configuration({
    apiKey: APIKey,
  });
  const openai = new OpenAIApi(configuration);
  const [firstChunk, ...restChunks] = textChunks;
  const firstPrompt = getPrompt(first_prompt, firstChunk);
  console.log('Generating summary. This can take a few minutes.');
  const firstResponse = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: firstPrompt,
    temperature: 0.7,
    max_tokens: 500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  let currSummary = firstResponse.data.choices[0].text;

  for (let i = 0; i < restChunks.length; i++) {
    const chunk = restChunks[i];
    const promptText = `Context: ${currSummary}
      ${chunk}
    `;
    const prompt = getPrompt(loop_prompt, promptText);
    const res = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    currSummary = res.data.choices[0].text;
  }

  return currSummary;
}

/**
 *
 * @param {string[]} text
 * @returns {string} prompt
 */
function getPrompt(command, text) {
  const prompt = `${command}
  ${text}
  `;

  return prompt;
}

/**
 *
 * @param {string} text
 * @returns {string[]} `chunked text`
 */
function chunkText(text) {
  const tokens = encode(text);
  const tokenAmt = tokens.length;
  const chunksAmt = Math.ceil(tokenAmt / 3000);
  const chunkSize = Math.ceil(tokenAmt / chunksAmt);
  let chunksCovered = 0;
  let chunkArr = [];

  for (let i = 0; i < chunksAmt; i++) {
    const step = chunksCovered + chunkSize;
    const tokenChunk = tokens.slice(chunksCovered, step);
    const textChunk = decode(tokenChunk);

    chunkArr.push(textChunk);
    chunksCovered += chunkSize;
  }

  return chunkArr;
}
