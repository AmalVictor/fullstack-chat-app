import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { axiosInstance } from "../lib/axios";

const TranslateMessage = ({ original }) => {
  const { preferredLanguage } = useLanguage();
  const [translated, setTranslated] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleTranslate = async () => {
    setLoading(true);
    setError(null);
  
    try {
      console.log(`Translating to ${preferredLanguage}: "${original.substring(0, 30)}..."`);
      
      const response = await axiosInstance.post("/translate", {
                        text: original,
                        targetLang: preferredLanguage,
                      });
  
      const data = await response.json();
  
      if (response.ok) {
        setTranslated(data.translated);
        setRetryCount(0); // Reset retry count on success
        console.log("Translation successful");
      } else {
        const errorMsg = data.error || 'Translation failed';
        setError(errorMsg);
        console.error('Translation failed:', data);
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error translating:', error);
    }
  
    setLoading(false);
  };
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    handleTranslate();
  };

  const handleReset = () => {
    setTranslated('');
    setError(null);
    setRetryCount(0);
  };
  
  // Don't render anything if no original text
  if (!original) return null;

  // Handle different display states
  return (
    <div className="mt-2">
      {translated ? (
        <div className="text-xs text-base-content/70 italic">
          <p>"{translated}"</p>
          <button 
            onClick={handleReset} 
            className="text-[10px] text-blue-500 hover:underline ml-1"
          >
            Show original
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={handleTranslate}
            disabled={loading}
            className="text-[11px] text-blue-500 underline hover:text-blue-600 disabled:opacity-50"
          >
            {loading ? 'Translating...' : 'Translate'}
          </button>
          {error && (
            <div className="flex items-center gap-1 mt-1">
              <p className="text-[10px] text-red-500">{error}</p>
              {retryCount < 3 && (
                <button 
                  onClick={handleRetry}
                  className="text-[10px] text-blue-500 hover:underline ml-1"
                >
                  Retry
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TranslateMessage;
