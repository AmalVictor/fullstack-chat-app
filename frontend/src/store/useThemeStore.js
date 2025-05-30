import { create } from "zustand";

// Helper function to apply theme to DOM
const applyThemeToDOM = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-theme', theme);
  
  // Also apply to root element for good measure
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.setAttribute('data-theme', theme);
  }
  
  console.log(`Theme applied to DOM: ${theme}`);
};

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));