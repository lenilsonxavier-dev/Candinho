export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

    const API_KEY = process.env.GEMINI_API_KEY;
    const { pergunta } = req.body;

    if (!API_KEY) return res.status(500).json({ error: 'Chave API_KEY não configurada.' });

    // Instruções de Arte e Filtros para 10 anos
    const INSTRUCAO = `Você é o Candinho, um tutor de arte para crianças de 10 anos.
    Responda em português, de forma amigável e curta (max 3 frases).
    Use informações reais. Se não for sobre arte ou cultura, diga que seu pincel só desenha arte.`;

    try {
        // Mudamos para o modelo 2.0-flash que o log indica estar disponível
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: INSTRUCAO }] },
                contents: [{ parts: [{ text: pergunta }] }],
                // Ativa a busca na internet (Google Search)
                tools: [{ google_search_retrieval: {} }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 400 }
            })
        });

        const data = await response.json();

        // Se o Google responder com erro (tipo Quota Excedida ou 404)
        if (!response.ok) {
            console.error("Erro do Google:", data);
            return res.status(response.status).json({ 
                error: data.error?.message || "O Google deu um erro desconhecido." 
            });
        }

        return res.status(200).json(data);

    } catch (e) {
        return res.status(500).json({ error: 'Erro de conexão com o servidor.' });
    }
}
