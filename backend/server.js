require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { transcribeAudio } = require('./utils/transcriber');
const { analyzeTranscription } = require('./utils/speechAnalyzer');


const upload = multer({ storage: multer.memoryStorage() });
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/speech-to-text-whisper', upload.single('audio'), async (req, res) => {
    try {
      const audioBuffer = req.file.buffer;
      const base64Audio = audioBuffer.toString('base64');
      const transcript = await transcribeAudio(base64Audio, 'WHISPER');
      res.json({ transcription: transcript }); // ✅ fixed
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Transcription failed' });
    }
  });
  

app.post('/api/analyze-transcription', async (req, res) => {
    try {
      const { transcription } = req.body;
  
      if (!transcription || typeof transcription !== 'string') {
        console.error("Invalid transcription:", transcription);
        return res.status(400).json({ error: 'Missing or invalid transcription' });
      }
      console.log("Transcription being sent to backend:", transcription);

      const analysis = await analyzeTranscription(transcription);
      res.json({ analysis });
    } catch (error) {
      console.error('Error analyzing transcription:', error.message);
      res.status(500).json({ error: 'Failed to analyze transcription' });
    }
  });
  

  

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
