export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

    const API_KEY = process.env.GEMINI_API_KEY;
    const { pergunta } = req.body;

    if (!API_KEY) return res.status(500).json({ error: 'Chave API_KEY não configurada na Vercel.' });

    try {
        // Usando o modelo 1.5-flash (mais estável que o 2.0 experimental)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: pergunta }] }],
                system_instruction: { 
                    parts: [{ text: "Você é o Candinho, um especialista em arte para crianças. Responda de forma curta e amigável." }] 
                }
            })
        });

        const data = await response.json();

        // Se o Google retornar erro (ex: chave inválida), enviamos o erro para o chat
        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json({ error: 'Erro ao conectar com o Google.' });
    }
}
