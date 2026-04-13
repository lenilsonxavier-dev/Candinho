export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

    const API_KEY = process.env.GEMINI_API_KEY;
    const { pergunta } = req.body;

    if (!API_KEY) return res.status(500).json({ error: 'Chave API_KEY não configurada.' });

    // Instrução atualizada para o Candinho
    const instrucaoTexto = `Você é o Candinho, tutor de arte para crianças de 10 anos. 
    Responda em português, de forma amigável e curta (máximo 3 frases). 
    Sempre use informações reais sobre arte.
    Se a pergunta não for sobre arte ou cultura, diga que seu pincel só fala de arte.`;

    try {
        // ATENÇÃO: Mudamos para o modelo Gemini 3 conforme seu documento de 2026
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: `${instrucaoTexto}\n\nPergunta do aluno: ${pergunta}` }]
                    }
                ],
                // Ativando a busca do Google (Grounding) que agora é padrão para o Gemini 3
                tools: [{
                    google_search: {} 
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 400
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ error: `Erro no Gemini 3: ${data.error.message}` });
        }

        if (data.candidates && data.candidates[0].content) {
            return res.status(200).json(data);
        } else {
            return res.status(500).json({ error: "O modelo Gemini 3 não retornou resposta." });
        }

    } catch (e) {
        return res.status(500).json({ error: 'Erro de conexão com a API Gemini 3.' });
    }
}
