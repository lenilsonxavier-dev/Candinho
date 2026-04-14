export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

    const API_KEY = process.env.GEMINI_API_KEY;
    const { pergunta } = req.body;

    // ESTRATÉGIA DE LONGO PRAZO:
    // Em vez de gemini-3.1-lite-preview (que é instável e muda toda hora),
    // usamos o alias estável.
    const MODELO = "gemini-1.5-flash"; 

    try {
        const url = `https://generativelanguage.googleapis.com/v1/models/${MODELO}:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: `Instrução: Você é o Candinho, tutor de arte para crianças. Responda curto e apenas sobre arte.\n\nPergunta: ${pergunta}` }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 300
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            // Se o modelo estiver lotado, tentamos avisar de forma amigável
            return res.status(500).json({ error: "O Candinho está guardando os pincéis. Tente em 1 minuto!" });
        }

        return res.status(200).json(data);

    } catch (e) {
        return res.status(500).json({ error: 'Erro de conexão.' });
    }
}
