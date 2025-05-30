import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Retrieve the saved language from localStorage or default to 'en'
  const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
  const [preferredLanguage, setPreferredLanguage] = useState(savedLanguage);

  // Save the selected language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('preferredLanguage', preferredLanguage);
  }, [preferredLanguage]);

  return (
    <LanguageContext.Provider value={{ preferredLanguage, setPreferredLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
