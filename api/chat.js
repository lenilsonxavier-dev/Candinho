export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

    const API_KEY = process.env.GEMINI_API_KEY;
    const { pergunta } = req.body;

    if (!API_KEY) return res.status(500).json({ error: 'Chave não encontrada.' });

    try {
        // MUDANÇA PARA O MODELO ESTÁVEL (GA) E ROTA V1
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: `Você é o Candinho, um tutor de arte para crianças. Responda de forma curta e amigável apenas sobre arte e cultura.\n\nPergunta: ${pergunta}` }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 300
                }
            })
        });

        const data = await response.json();

        // Se o Google der erro, ele vai nos avisar
        if (data.error) {
            return res.status(500).json({ error: `O Google está ocupado: ${data.error.message}` });
        }

        if (data.candidates && data.candidates[0].content) {
            return res.status(200).json(data);
        } else {
            return res.status(500).json({ error: "O Candinho ficou sem ideias agora. Tente novamente." });
        }

    } catch (e) {
        return res.status(500).json({ error: 'Erro de conexão com o museu do Candinho.' });
    }
}
