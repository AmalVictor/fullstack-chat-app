import express from 'express';
import { translateText } from '../lib/translateApi.js';

const router = express.Router();

router.post('/', async (req, res) => {
  console.log("Translation request received:", req.body);
  const { text, targetLang } = req.body;

  if (!text || !targetLang) {
    console.log("Bad request - missing parameters:", { text: !!text, targetLang: !!targetLang });
    return res.status(400).json({ error: 'Text and targetLang are required' });
  }

  try {
    console.log(`Attempting to translate text to ${targetLang}`);
    const translatedText = await translateText(text, targetLang);
    
    if (!translatedText) {
      console.log("Translation returned null or empty string");
      return res.status(500).json({ error: 'Translation service returned empty result' });
    }
    
    console.log("Translation successful:", translatedText.substring(0, 30) + (translatedText.length > 30 ? '...' : ''));
    res.json({ translated: translatedText });
  } catch (error) {
    console.error("Error during translation:", error.message);
    res.status(500).json({ error: 'Translation failed. Please try again.' });
  }
});

export default router;
