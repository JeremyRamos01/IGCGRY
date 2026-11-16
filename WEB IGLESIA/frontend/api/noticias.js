// Serverless Function para Vercel: Proxy seguro y agregador de feeds RSS de Noticias Evangélicas
// Protegido contra SSRF (solo permite dominios públicos HTTP/HTTPS válidos)

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

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

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
                'User-Agent': 'Mozilla/5.0 (compatible; CasaDelGranReyNewsBot/1.0; +https://www.iglesiacasadelgranreyleganes.es)',
                'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, text/html, */*'
            }
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            return res.status(response.status).json({ error: `Error del servidor origen: ${response.status}` });
        }

        const xmlText = await response.text();
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
        return res.status(200).send(xmlText);
    } catch (error) {
        return res.status(502).json({ error: 'No se pudo conectar con la fuente RSS.', details: error.message });
    }
};
