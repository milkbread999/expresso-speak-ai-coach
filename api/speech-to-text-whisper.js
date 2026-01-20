const { transcribeAudio } = require('../backend/utils/transcriber');
const Busboy = require('busboy');

// Vercel serverless function handler
module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Log everything for debugging
  console.log('=== Request Debug Info ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body type:', typeof req.body);
  console.log('Body:', req.body);
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed, received:', req.method);
    return res.status(405).json({ 
      error: 'Method not allowed', 
      receivedMethod: req.method,
      allowedMethods: ['POST', 'OPTIONS']
    });
  }

  return new Promise((resolve) => {
    try {
      // Parse multipart form data using busboy
      const contentType = req.headers['content-type'] || '';
      
      if (!contentType.includes('multipart/form-data')) {
        console.log('❌ Invalid content type:', contentType);
        return res.status(400).json({ error: 'Content-Type must be multipart/form-data', received: contentType });
      }

      console.log('✅ Starting busboy parsing...');
      const busboy = Busboy({ headers: req.headers });
      const chunks = [];
      let fileReceived = false;

      busboy.on('file', (name, file, info) => {
        if (fileReceived) {
          file.resume(); // Skip additional files
          return;
        }
        
        fileReceived = true;
        const { filename, encoding, mimeType } = info;
        console.log(`📁 File [${name}]: filename: ${filename}, encoding: ${encoding}, mimeType: ${mimeType}`);
        
        file.on('data', (data) => {
          chunks.push(data);
          console.log(`📦 Received ${data.length} bytes`);
        });

        file.on('end', async () => {
          try {
            console.log(`✅ File upload complete, total size: ${chunks.reduce((sum, chunk) => sum + chunk.length, 0)} bytes`);
            const audioBuffer = Buffer.concat(chunks);
            const base64Audio = audioBuffer.toString('base64');
            console.log('🔄 Starting transcription...');
            const transcript = await transcribeAudio(base64Audio, 'WHISPER');
            console.log('✅ Transcription complete');
            res.json({ transcription: transcript });
            resolve();
          } catch (err) {
            console.error('❌ Transcription error:', err);
            res.status(500).json({ error: 'Transcription failed', details: err.message });
            resolve();
          }
        });
      });

      busboy.on('finish', () => {
        if (!fileReceived) {
          console.log('❌ No file received');
          res.status(400).json({ error: 'No audio file provided' });
          resolve();
        }
      });

      busboy.on('error', (err) => {
        console.error('❌ Busboy error:', err);
        res.status(400).json({ error: 'Failed to parse form data', details: err.message });
        resolve();
      });

      console.log('🔄 Piping request to busboy...');
      req.pipe(busboy);
    } catch (err) {
      console.error('❌ Handler error:', err);
      res.status(500).json({ error: 'Request processing failed', details: err.message });
      resolve();
    }
  });
};
