export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

    const API_KEY = process.env.GEMINI_API_KEY;
    const { pergunta } = req.body;

    if (!API_KEY) return res.status(500).json({ error: 'Chave não encontrada.' });

    try {
        // Usando o modelo mais leve citado no seu documento para economizar quota
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: `Instrução: Você é o Candinho, tutor de arte para crianças. Responda curto e em português sobre arte.\n\nPergunta: ${pergunta}` }]
                }],
                // REMOVEMOS AS TOOLS (Internet) PARA ECONOMIZAR QUOTA
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 200
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ error: `Erro de Limite: ${data.error.message}` });
        }

        return res.status(200).json(data);

    } catch (e) {
        return res.status(500).json({ error: 'Erro de conexão.' });
    }
}
