require('dotenv').config(); // Load environment variables
const readPrompt = require('../utils/readPrompt');
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function analyzeTranscription(transcription, model = 'gpt-4') {
  if (!transcription) {
    throw new Error('No transcription provided for analysis');
  }
  const systemPrompt = await readPrompt('openai_system_prompt.txt');

  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: transcription },
      ],
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content;
    } else {
      throw new Error('Unexpected OpenAI response format');
    }
  } catch (error) {
    console.error('Error analyzing transcription:', error.message);
    throw error;
  }
}

module.exports = {
  analyzeTranscription,
};
