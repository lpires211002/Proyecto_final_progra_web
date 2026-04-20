import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import checkoutHandler from './api/checkout.js';

// Cargar variables de entorno desde .env.local
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Para poder leer JSON en el body (req.body)
app.use(express.json());

// Servir la carpeta actual como archivos estáticos (HTML, CSS, JS, etc.)
app.use(express.static(__dirname));

// Envolver la función Serverless de Vercel en Express
app.post('/api/checkout', async (req, res) => {
    try {
        await checkoutHandler(req, res);
    } catch (error) {
        console.error('Error al invocar API de Vercel (Local):', error);
        res.status(500).json({ error: error.message });
    }
});

import supabaseConfigHandler from './api/supabase-config.js';
app.get('/api/supabase-config', async (req, res) => {
    try {
        await supabaseConfigHandler(req, res);
    } catch (error) {
        console.error('Error al invocar API de Supabase config (Local):', error);
        res.status(500).json({ error: error.message });
    }
});

// Iniciar servidor local
app.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 Servidor local de prueba iniciado correctamente`);
    console.log(`=================================================`);
    console.log(`\nPor favor, abre tu navegador e ingresa a:\n`);
    console.log(`      👉  http://localhost:${PORT}  👈\n`);
    console.log(`(Presiona Ctrl+C en tu terminal para detenerlo)\n`);
});
