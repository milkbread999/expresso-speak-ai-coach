const { analyzeTranscription } = require('../backend/utils/speechAnalyzer');

// Vercel serverless function handler
// Export as default for Vercel
module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', receivedMethod: req.method });
  }

  try {
    const { transcription, drillId } = req.body;

    if (!transcription || typeof transcription !== 'string') {
      console.error("Invalid transcription:", transcription);
      return res.status(400).json({ error: 'Missing or invalid transcription' });
    }

    console.log("Transcription being sent to backend:", transcription);
    console.log("Drill ID:", drillId);

    analyzeTranscription(transcription, 'gpt-4', drillId)
      .then(analysis => {
        res.json({ analysis });
      })
      .catch(error => {
        console.error('Error analyzing transcription:', error.message);
        res.status(500).json({ error: 'Failed to analyze transcription', details: error.message });
      });
  } catch (error) {
    console.error('Error in handler:', error.message);
    res.status(500).json({ error: 'Failed to process request', details: error.message });
  }
};
