export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

    const API_KEY = process.env.GEMINI_API_KEY;
    const { pergunta } = req.body;

    if (!API_KEY) return res.status(500).json({ error: 'Chave API_KEY não encontrada.' });

    // Colocamos a instrução de quem o Candinho é direto no texto que vai para o Google
    const promptSeguro = `Instrução: Você é o Candinho, um tutor de arte amigável para crianças de 10 anos. 
    Responda sempre em português, de forma curta (máximo 3 frases) e focada em arte.
    Se a pergunta não for sobre arte ou cultura, responda que seu pincel só sabe falar de arte.

    Pergunta do aluno: ${pergunta}`;

    try {
        // Usamos a URL estável v1
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: promptSeguro }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 300
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        if (data.candidates && data.candidates[0].content) {
            return res.status(200).json(data);
        } else {
            return res.status(500).json({ error: "O Google não conseguiu gerar uma resposta agora." });
        }

    } catch (e) {
        return res.status(500).json({ error: 'Erro de conexão com o servidor do Google.' });
    }
}
