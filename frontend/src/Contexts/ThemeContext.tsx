// ThemeContext.ts
import  { createContext, useState, useEffect, useContext } from 'react';
import { ComponentChildren } from '../@types/types';

const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: ComponentChildren) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check system preference on initial load
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Update HTML class whenever isDarkMode changes
    if (isDarkMode) {
        document.documentElement.classList.add('dark'); // Add dark class when isDarkMode is true
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark'); // Remove dark class when isDarkMode is false
        document.documentElement.classList.add('light');
      }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);