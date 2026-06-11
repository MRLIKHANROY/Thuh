import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const api_key = process.env.GEMINI_API_KEY;

// Initialize safe server-side Gemini client with recommended configuration and User-Agent
const ai = new GoogleGenAI({
  apiKey: api_key,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Server-side safe API proxy route for generating C# scripts
app.post('/api/generate-script', async (req, res) => {
  try {
    const { prompt, type, complexity, includesComments, performanceMode } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'System requirements or script prompt is empty.' });
    }

    const systemInstruction = `You are a world-class senior Unity 3D & 2D game developer and gameplay architect who writes pristine C# scripts for Unity.
Your goal is to build safe, compile-ready, and high-performance Unity gameplay code using modern API standards.
- Always use serialized fields ([SerializeField] private type name;) with descriptive '[Tooltip(\"...\")]' tags rather than public fields for inspector access.
- Avoid memory allocations in high-frequency methods like Update() (e.g. cache wait instructions, avoid using Tag strings, avoid raycast allocations).
- Include comprehensive XML summary comments above classes and public functions if includesComments is true.
- Adopt standard MonoBehavior structures or pure C# helper logic depending on the request.
- Ensure proper using namespaces (UnityEngine, UnityEngine.UI, TMPro, System, System.Collections.Generic).
- Provide a clean description on how to attach or configure this script in Unity.

You MUST reply with a JSON object exactly adhering to this JSON schema:
{
  "className": "A valid alphanumeric string representing the class name (matches recommended file name, e.g. CharacterMovement)",
  "scriptCode": "Complete formatted C# source code including using directives, namespace (optional/desirable), class declaration, fields, and fully-coded methods. Never truncate or put placeholders like // ... some code here",
  "usageDescription": "A concise step-by-step user guide explaining where to drop this file, what components it requires (e.g. [RequireComponent(typeof(Rigidbody))]), and how helper parameters should be set in the inspector."
}`;

    const promptMessage = `Please generate a ${complexity || 'Clean'} Unity C# script based on this request: "${prompt}"
Category of Script: ${type || 'Gameplay General'}
Comments Included: ${includesComments ? 'Yes, with standard XML docs' : 'No, keep code tight'}
High Performance Mode: ${performanceMode ? 'Yes (e.g. non-alloc methods, cached lookups)' : 'No (Standard readable)'}

Please provide exact functional code.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptMessage,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            className: {
              type: Type.STRING,
              description: 'The recommended name for the C# file/class'
            },
            scriptCode: {
              type: Type.STRING,
              description: 'The complete C# script code'
            },
            usageDescription: {
              type: Type.STRING,
              description: 'Step-by-step assembly and setup instructions'
            }
          },
          required: ['className', 'scriptCode', 'usageDescription']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini model did not return any structured code response.');
    }

    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error generating script:', error);
    res.status(500).json({ error: error?.message || 'Server failed to process the request' });
  }
});

// Configure Vite middleware integration vs Production asset routing
const isProd = process.env.NODE_ENV === 'production';

let vite: any;
if (!isProd) {
  const { createServer: createViteServer } = await import('vite');
  vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  app.use(vite.middlewares);
} else {
  // Serve built static assets from 'dist' directory
  app.use(express.static(path.resolve(__dirname, 'dist')));
}

// Fallback all non-handled requests to HTML SPA context
app.get('*', async (req, res, next) => {
  const url = req.originalUrl;
  if (url.startsWith('/api')) {
    return next();
  }
  try {
    let template: string;
    if (!isProd) {
      template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
    } else {
      template = fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8');
    }
    res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
  } catch (e) {
    if (!isProd && vite) {
      vite.ssrFixStacktrace(e as Error);
    }
    next(e);
  }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://0.0.0.0:${PORT}`);
});
