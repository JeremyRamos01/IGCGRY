const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

const path = require('path');

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas de Vistas
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

// Rutas básicas API
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Backend de Casa del Gran REY funcionando correctamente',
    status: 'online'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Endpoint seguro para proxy de RSS de Noticias Evangélicas (evita CORS y SSRF)
const BLOCKED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '169.254.169.254', '[::1]'];
function isSafePublicUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    if (BLOCKED_HOSTS.includes(host) || host.startsWith('10.') || host.startsWith('192.168.') || host.startsWith('172.16.')) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

app.get('/api/noticias', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl || !isSafePublicUrl(targetUrl)) {
    return res.status(400).json({ error: 'URL de feed no válida o no permitida.' });
  }
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CasaDelGranReyNewsBot/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      }
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      return res.status(response.status).json({ error: `Status ${response.status}` });
    }
    const xmlText = await response.text();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=1800');
    return res.status(200).send(xmlText);
  } catch (error) {
    return res.status(502).json({ error: 'Error obteniendo feed RSS', details: error.message });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
