const fs = require('fs');
const path = require('path');

/**
 * Reads the OpenAI prompt from a specified file in the configuration folder.
 * @param {string} promptFileName - The name of the prompt file.
 * @returns {Promise<string>} The content of the prompt file.
 */
async function readPrompt(promptFileName) {
  try {
    const filePath = path.join(__dirname, '../config', promptFileName);
    const data = await fs.promises.readFile(filePath, 'utf8');
    return data;
  } catch (error) {
    console.error(`Error reading prompt file (${promptFileName}):`, error);
    throw new Error('Failed to read the prompt file');
  }
}

module.exports = readPrompt;
