import axios from 'axios';

// Maximum number of retries for the translation API
const MAX_RETRIES = 2;

export const translateText = async (text, targetLang, retryCount = 0) => {
  try {
    console.log(`Translating text to ${targetLang}: "${text.substring(0, 30)}..."`);
    
    // Using a simple free translation API
    const response = await axios.request({
      method: 'GET',
      url: 'https://translate.googleapis.com/translate_a/single',
      params: {
        client: 'gtx',
        sl: 'auto',
        tl: targetLang,
        dt: 't',
        q: text
      },
      timeout: 10000 // 10 second timeout
    });

    console.log('Translation API response received');
    
    // Google Translate API returns an array structure
    // The first element contains an array of translations
    if (response.data && Array.isArray(response.data) && response.data[0] && Array.isArray(response.data[0])) {
      // Extract all translated parts and join them
      const translatedText = response.data[0]
        .filter(item => item && item[0])
        .map(item => item[0])
        .join('');
      
      if (translatedText) {
        return translatedText;
      }
    }
    
    console.error('Unexpected API response format');
    throw new Error('Unexpected response format from translation API');
  } catch (error) {
    console.error('Translation API error:', 
      error.response ? JSON.stringify(error.response.data) : error.message);
    
    // If we haven't exceeded our retry limit and the error is retriable
    if (retryCount < MAX_RETRIES && (
        error.code === 'ECONNABORTED' || // Timeout
        error.response?.status >= 500 || // Server errors
        error.code === 'ECONNRESET' || // Connection reset
        !error.response // Network error
    )) {
      console.log(`Retrying translation (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
      return translateText(text, targetLang, retryCount + 1);
    }
    
    throw new Error(error.response?.data?.message || 'Translation service unavailable');
  }
};
