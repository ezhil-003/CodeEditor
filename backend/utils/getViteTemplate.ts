// Vite React template generator
export function getViteReactTemplate(projectId: string) {
    return [
        {
            name: 'package.json',
            path: 'package.json',
            objectKey: `projects/${projectId}/package.json`,
            content: JSON.stringify({
                name: "vite-project",
                private: true,
                version: "0.0.0",
                type: "module",
                scripts: {
                    dev: "vite",
                    build: "vite build",
                    preview: "vite preview"
                },
                dependencies: {
                    "react": "^18.2.0",
                    "react-dom": "^18.2.0"
                },
                devDependencies: {
                    "vite": "^4.4.5",
                    "@vitejs/plugin-react": "^4.0.0",
                    "esbuild": "^0.18.17"
                }
            }, null, 2),
            contentType: 'application/json'
        },
        {
            name: 'vite.config.js',
            path: 'vite.config.js',
            objectKey: `projects/${projectId}/vite.config.js`,
            content: `import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  
  export default defineConfig({
    plugins: [react()],
    server: {
      port: 5173
    }
  })`,
            contentType: 'application/javascript'
        },
        {
            name: 'index.html',
            path: 'index.html',
            objectKey: `projects/${projectId}/index.html`,
            content: `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Vite + React</title>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="/src/main.jsx"></script>
    </body>
  </html>`,
            contentType: 'text/html'
        },
        {
            name: 'main.jsx',
            path: 'src/main.jsx',
            objectKey: `projects/${projectId}/src/main.jsx`,
            content: `import React from 'react'
  import ReactDOM from 'react-dom/client'
  import App from './App.jsx'
  
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )`,
            contentType: 'application/javascript'
        },
        {
            name: 'App.jsx',
            path: 'src/App.jsx',
            objectKey: `projects/${projectId}/src/App.jsx`,
            content: `export default function App() {
    return (
      <div className="App">
        <h1>Vite + React</h1>
      </div>
    )
  }`,
            contentType: 'application/javascript'
        }
    ];
}