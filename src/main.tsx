
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './hooks/use-theme'

// Get the root element and render the App
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <ThemeProvider defaultTheme="light">
    <App />
  </ThemeProvider>
);
