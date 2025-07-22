require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { tmpdir } = require('os');
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


// const { SpeechClient } = require('@google-cloud/speech');
// const { Storage } = require('@google-cloud/storage');
// const speechClient = new SpeechClient({
//   keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
// });
// const storage = new Storage({
//   keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
// });

/**
 * Transcribes audio using the specified service.
 * @param {string} audioContent - The Base64-encoded audio content.
 * @param {string} service - The transcription service to use ('GOOGLE', 'WHISPER', etc.).
 * @returns {Promise<string>} - The transcribed text.
 */
async function transcribeAudio(audioContent, service = 'GOOGLE') {
  if (!audioContent || audioContent.length < 100) {
    throw new Error('Invalid audio content');
  }

  switch (service) {
    case 'GOOGLE':
      return transcribeWithGoogleAsync(audioContent);
    case 'WHISPER':
      return transcribeWithWhisper(audioContent); // Stubbed out for now
    default:
      throw new Error('Unsupported transcription service');
  }
}

// /**
//  * Asynchronously transcribes long audio files using Google Cloud Speech-to-Text.
//  * @param {string} audioContent - The Base64-encoded audio content.
//  * @returns {Promise<string>} - The transcribed text.
//  */
// async function transcribeWithGoogleAsync(audioContent) {
//   try {
//     // Save audio to Google Cloud Storage
//     const bucketName = process.env.GOOGLE_CLOUD_BUCKET; // Set in .env
//     const fileName = `audio-${Date.now()}.wav`; // Unique filename
//     const buffer = Buffer.from(audioContent, 'base64');

//     // Create file in GCS
//     const bucket = storage.bucket(bucketName);
//     const file = bucket.file(fileName);
//     await file.save(buffer);
//     console.log(`Audio file uploaded to ${fileName}`);

//     // Start asynchronous transcription
//     const request = {
//       audio: {
//         uri: `gs://${bucketName}/${fileName}`,
//       },
//       config: {
//         encoding: 'LINEAR16',
//         languageCode: 'en-US',
//         enableAutomaticPunctuation: true,
//       },
//     };

//     const [operation] = await speechClient.longRunningRecognize(request);
//     console.log('Waiting for operation to complete...');

//     // Wait for operation to complete
//     const [response] = await operation.promise();
//     const transcription = response.results
//       .map(result => result.alternatives[0].transcript)
//       .join(' ');
    
//     // Cleanup: Delete the file from GCS
//     await file.delete();
//     console.log(`Deleted GCS file: ${fileName}`);
    
//     return transcription;
//   } catch (error) {
//     console.error('Error during asynchronous transcription:', error.message);
//     throw error;
//   }
// }

async function transcribeWithWhisper(audioContent) {
  const tempFilePath = path.join(tmpdir(), `audio-${Date.now()}.webm`);

  // Convert base64 string to binary buffer
  const buffer = Buffer.from(audioContent, 'base64');
  await fs.promises.writeFile(tempFilePath, buffer);
  console.log(`Temporary audio file saved to ${tempFilePath}`);

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: 'whisper-1',
      response_format: 'text',
    });

    console.log("Raw Whisper response:", transcription); // should be a string
    return transcription.trim(); // ✅ return the string, not { text: ... }

  } catch (error) {
    console.error("Error during Whisper transcription:", error);
    throw new Error("Whisper transcription failed");
  } finally {
    await fs.promises.unlink(tempFilePath);
    console.log(`Temporary file deleted: ${tempFilePath}`);
  }
}



module.exports = {
  transcribeAudio,
  transcribeWithWhisper,
};
