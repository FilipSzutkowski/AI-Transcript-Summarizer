## **PITS** - Police Interview Transcript Summarizer

> _Jody was being interviewed by Detective Flores in Sisku County in October of last year in relation to the murder of Travis, her ex-partner. Flores had evidence that Jody was at Travis' house on the day of the murder, including pictures of the two of them in the bedroom, of Travis' body from the autopsy, and of Jody's pants at the scene..._

<br>

#### _Part of a summary generated from a **2:30h** police interview_

<br>

---

## Table of Contents

1. [About](#about)
   - [Examples of summaries](#examples-of-generated-summaries)
   - [Tested transcripts](#tested-transcripts)
2. [Running instructions](#running-instructions)
   - [Requirements](#requirements)
   - [Environment variables](#environment-variables)
     - [Example `.env` file](#example-env-file)
   - [How to run the program](#how-to-run)
3. [Brief logic explanation](#brief-logic-explanation)
4. [Caveats](#caveats)
   - [Input File Format](#the-input-file-format)
   - [Prompts for the AI Model](#prompts-for-the-ai-model)

<br>

---

## About

**PITS** is a small program taking in input in form of police interview transcript of any length and summarizing it into few, condensed lines of text. It is using the OpenAI API with the `text-davinci-003` model to generate the summaries.

The main problem it solves is the davinci model's limitation of 4000 tokens per request. **PITS** is solving that problem by making recurring requests with chunks of the transcript and providing the AI with context of the conversation from the previous chunks for each request.

That enables us to generate summaries of transcripts of technically any length. Tested transcripts were at over 10 000 tokens each.

### Examples of generated summaries

- [Murder Suspect Denies Involvement Despite Evidence of Palm Print and Blood at Scene](https://github.com/FilipSzutkowski/AI-Transcript-Summarizer/blob/main/lib/generated-summaries/travis-case/new-travis.txt)

### Tested transcripts

- [Transcripts folder](https://github.com/FilipSzutkowski/AI-Transcript-Summarizer/tree/main/lib/transcripts)

<br>

---

## Running instructions

### Requirements

- [NodeJS - minimum 16.5](https://nodejs.org/en/)

### Environment variables

| Variable name    | Value                                                                                                                                                                                                                                                                                                                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OPENAI_API_KEY` | [OpenAI API Key](https://beta.openai.com/account/api-keys)                                                                                                                                                                                                                                                                                                                          |
| `INPUT_FILE`     | Path to the text file including the interview transcript. Relative to the `index.js` file in the root directory. <br> You can use one of the transcript files from [Tested transcripts](#tested-transcripts). <br> You can also provide your own transcript file, checkout the [input file format section](#the-input-file-format) for instructions about formating the input file. |

#### Example `.env` file

```properties
OPENAI_API_KEY = "really_long_api_key_from_open_ai_00112233"
INPUT_FILE = "lib/transcripts/travis.txt"
```

<br>

### How to run

1. Clone this repo's code wherever you like.
2. `cd` into directory with the cloned code of **PITS**
3. Run `npm install` in the terminal while inside the directory with **PITS** - this installs all the dependencies.
4. Create a `.env` file, following the [instructions above](#environment-variables).
5. Run `npm run dev` and wait for the result. The generated summary will be present in a `summary.txt` file in the root directory. It can take a few minutes to generate the result, based on how long the transcript is.

<br>

## Brief logic explanation

All of the main logic has its starting point inside the `main()` function.

The process starts with the program reading the file specified in the path from `env` variables. The file's content then gets passed to the chunking function.

The chunking function first encodes the transcript into tokens, using `gpt-3-encoder` library. This gives us the amount of tokens the whole text will be converted to after being sent to the _OpenAI API_. We then find out how many chunks the transcript should be splitted into, while specifying that each chunk should not be bigger than **3000 tokens**, as the _OpenAI API_ can maximally handle 4000 tokens per request.

Now we have an array of transcript chunks, which can be handled by the OpenAI one by one.

The next step is the communication with OpenAI. How the API requests are built in the detail, can be found [here](https://beta.openai.com/docs/api-reference/completions).

The first request to the API gets the summary of the first chunk from the chunk array. After that, the program requests summaries for the rest of the text chunks one by one, but it also includes the summary of the prevously processed chunk of the transcript in each chunk.

The summary, or summaries - as the program actually works with multiple summaries and making a final summary at the end - are being generated based on the prompts inside [`ai-input.json`](https://github.com/FilipSzutkowski/AI-Transcript-Summarizer/blob/main/ai-input.json). More about the prompts can be found in [the section below](#prompts-for-the-ai-model).

<br>

## Caveats

### The input file format

The only tested format of an interview transcript is the format of the [Tested transcripts](#tested-transcripts). Using formats different than that could potentially produce unexpected results.

Example:

```
Speaker1: Hello, what is your name?
Speaker2: My name is Jerry, nice to meet you.
```

Each line starts with some kind of an identification of each speaker, which ends with a _colon_. After that comes the line that has been said by the person.

Provide the transcript with names or roles of each speaker for best results. E.g. `Officer` and `Interviewee`.

Our results were generated only with transcripts with two speakers present, but as long as the speakers are distinguished in the transcript file, the model should not have any problems with more than two participants.

<br>

### Prompts for the AI model

The hardest part of generating summaries is specifying a well working prompt for the summary generation.

We've got a lot of different results, varying in content and quality, based on small changes in the prompt delievered to the model. There is definitely a lot of potential for improvement with how the prompts are formulated.

The prompts can be found [in this file](https://github.com/FilipSzutkowski/AI-Transcript-Summarizer/blob/main/ai-input.json). `first_prompt` is the prompt for the first generated summary, while `loop_prompt` is the prompt for used for generating summaries of each chunks and the final summary.
