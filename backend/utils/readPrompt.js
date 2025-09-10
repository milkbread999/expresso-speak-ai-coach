const fs = require('fs');
const path = require('path');

function readPrompt(filename) {
  try {
    const promptPath = path.join(__dirname, '..', 'prompts', filename);
    return fs.readFileSync(promptPath, 'utf8');
  } catch (error) {
    console.error(`Error reading prompt file ${filename}:`, error.message);
    throw new Error(`Could not read prompt file: ${filename}`);
  }
}

module.exports = readPrompt;