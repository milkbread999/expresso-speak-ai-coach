require('dotenv').config(); // Load environment variables
const readPrompt = require('../utils/readPrompt');
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Drill-specific focus areas for analysis
const drillFocusAreas = {
  1: { // Pen Drill
    focus: "articulation, consonant clarity, and precision",
    emphasis: "Pay special attention to consonant articulation and clarity. The speaker should demonstrate clear, precise consonant sounds. Look for improvements in speech precision and articulation quality.",
    categories: ["Clarity and Articulation", "Fluency"]
  },
  2: { // Over-Enunciation
    focus: "enunciation, precision, and deliberate speech patterns",
    emphasis: "Focus on enunciation quality and precision. The speaker should demonstrate exaggerated but clear consonant and vowel sounds. Evaluate how well they maintain clarity while being deliberate.",
    categories: ["Clarity and Articulation", "Fluency"]
  },
  3: { // Tongue Twisters
    focus: "speed, pronunciation accuracy, and articulation under pressure",
    emphasis: "Evaluate speed control and pronunciation accuracy. The speaker should maintain clarity even at faster speeds. Look for precision in difficult sound combinations and overall articulation quality.",
    categories: ["Clarity and Articulation", "Fluency", "Filler Words"]
  },
  4: { // Breath Control
    focus: "breathing patterns, sustained delivery, and vocal stamina",
    emphasis: "Pay special attention to breathing patterns and sustained speech delivery. The speaker should demonstrate controlled breathing that supports longer phrases without running out of air. Evaluate vocal stamina and volume consistency.",
    categories: ["Fluency", "Tone"]
  },
  5: { // Vocal Warm-ups
    focus: "vocal quality, range, and preparation",
    emphasis: "Focus on vocal quality and range. The speaker should demonstrate good vocal health and flexibility. Evaluate voice clarity, range, and overall vocal preparation.",
    categories: ["Tone", "Clarity and Articulation"]
  },
  6: { // Pitch Variation
    focus: "pitch variation, expressiveness, and engagement",
    emphasis: "Evaluate pitch variation and expressiveness. The speaker should demonstrate natural pitch changes that add interest and emotion. Look for monotone delivery and assess how pitch variation enhances engagement.",
    categories: ["Emotion and Expression", "Engagement with Audience", "Tone"]
  },
  7: { // Speed Control
    focus: "pace, timing, and comprehension-friendly delivery",
    emphasis: "Focus on speaking pace and timing. The speaker should demonstrate controlled pacing that allows for comprehension. Evaluate whether the pace is too fast, too slow, or optimal. Look for strategic pauses.",
    categories: ["Fluency", "Clarity and Articulation"]
  },
  8: { // Consonant Clusters
    focus: "consonant precision, difficult sound combinations, and articulation accuracy",
    emphasis: "Pay special attention to consonant clusters and difficult sound combinations. The speaker should demonstrate clear articulation of challenging consonant sequences. Evaluate precision in consonant pronunciation.",
    categories: ["Clarity and Articulation", "Fluency"]
  },
  9: { // Vowel Clarity
    focus: "vowel pronunciation, clarity, and distinct vowel sounds",
    emphasis: "Focus on vowel clarity and distinct pronunciation. The speaker should demonstrate clear, well-formed vowel sounds. Evaluate whether vowels are distinct and understandable.",
    categories: ["Clarity and Articulation", "Fluency"]
  },
  10: { // Public Speaking Prep
    focus: "overall presentation quality, confidence, structure, and audience engagement",
    emphasis: "Evaluate the speech as a complete presentation. Focus on structure, confidence, audience engagement, and overall delivery quality. This is a comprehensive assessment of public speaking skills.",
    categories: ["Structure and Organization", "Engagement with Audience", "Tone", "Emotion and Expression"]
  }
};

function getDrillSpecificPrompt(drillId) {
  const basePrompt = `You are a speech analysis API that MUST return only valid JSON. You will receive a speech transcription and analyze it across 8 categories.

CRITICAL: Your response must be ONLY a valid JSON array. No explanations, no markdown, no additional text. Start with [ and end with ].

For each transcription provided, analyze these 8 categories and return this exact JSON structure:

[
  {
    "category": "Subject Matter",
    "score": 8,
    "feedback": "Analyze content clarity, relevance, and structure. Provide specific feedback on what was covered well and what could be improved."
  },
  {
    "category": "Tone",
    "score": 7,
    "feedback": "Evaluate tone appropriateness and consistency. Comment on whether the tone matched the context and audience expectations."
  },
  {
    "category": "Fluency",
    "score": 6,
    "feedback": "Assess pace, articulation, and flow. Note any disruptions, hesitations, or areas where fluency could be enhanced."
  },
  {
    "category": "Filler Words",
    "score": 5,
    "feedback": "Identify filler words like 'um', 'uh', 'like'. Count frequency and suggest strategies to reduce them."
  },
  {
    "category": "Clarity and Articulation",
    "score": 8,
    "feedback": "Evaluate pronunciation and understandability. Comment on word clarity and suggest articulation improvements."
  },
  {
    "category": "Engagement with Audience",
    "score": 7,
    "feedback": "Assess how well the speaker connects with listeners. Suggest ways to make the speech more interactive and engaging."
  },
  {
    "category": "Emotion and Expression",
    "score": 6,
    "feedback": "Evaluate emotional delivery and passion. Comment on whether the speaker conveyed appropriate emotion and energy."
  },
  {
    "category": "Structure and Organization",
    "score": 8,
    "feedback": "Analyze logical flow and organization. Comment on introduction, body, conclusion, and transitions between ideas."
  }
]

Score each category 1-10 (1=needs significant improvement, 10=excellent). Provide specific, actionable feedback for each category.`;

  if (!drillId || !drillFocusAreas[drillId]) {
    return basePrompt + "\n\nRESPOND WITH ONLY THE JSON ARRAY. NO OTHER TEXT.";
  }

  const drillFocus = drillFocusAreas[drillId];
  const drillSpecificSection = `

IMPORTANT: This speech is from a specific speaking drill focused on ${drillFocus.focus}.

${drillFocus.emphasis}

When providing feedback, give extra weight and detailed analysis to these categories: ${drillFocus.categories.join(', ')}. Your feedback should be specifically tailored to help the speaker improve in the areas this drill targets.`;

  return basePrompt + drillSpecificSection + "\n\nRESPOND WITH ONLY THE JSON ARRAY. NO OTHER TEXT.";
}

async function analyzeTranscription(transcription, model = 'gpt-4', drillId = null) {
  if (!transcription) {
    throw new Error('No transcription provided for analysis');
  }
  
  const systemPrompt = drillId ? getDrillSpecificPrompt(drillId) : await readPrompt('openai_system_prompt.txt');

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
