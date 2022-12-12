## **PITS** - Police Interview Transcript Summarizer

**PITS** is a small program taking in input in form of police interview transcript of any length and summarizing it into few, condensed lines of text. It is using the OpenAI API with the `text-davinci-003` model to generate the summaries.

The main problem it solves is the davinci model's limitation of 4000 tokens per request. **PITS** is solving that problem by making recurring requests with chunks of the transcript and providing the AI with context of the conversation from the previous chunks for each request.

That enables us to generate summaries of transcripts of technically any length. Tested transcripts were at over 10 000 tokens each.

### Examples of generated summaries

- [Murder Suspect Denies Involvement Despite Evidence of Palm Print and Blood at Scene](https://github.com/FilipSzutkowski/AI-Transcript-Summarizer/blob/main/lib/generated-summaries/travis-case/new-travis.txt)

### Tested transcripts

- [Transcripts folder](https://github.com/FilipSzutkowski/AI-Transcript-Summarizer/tree/main/lib/transcripts)
