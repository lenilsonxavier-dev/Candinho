export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

    const API_KEY = process.env.GEMINI_API_KEY;
    const { pergunta } = req.body;

    if (!API_KEY) return res.status(500).json({ error: 'Chave API_KEY não encontrada.' });

    // Instrução especializada para o Candinho
    const INSTRUCAO = `Você é o Candinho, tutor de arte para crianças de 10 anos.
    Responda em português, de forma amigável e curta (máximo 3 frases).
    Use informações reais. Se a pergunta não for sobre arte ou cultura, diga que seu pincel só desenha arte.`;

    try {
        // MUDANÇA PARA GEMINI 3.1 LITE (O modelo de alto volume do seu log de 2026)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: INSTRUCAO }] },
                contents: [{ parts: [{ text: pergunta }] }],
                // Ativa a pesquisa no Google para informações de arte atualizadas
                tools: [{ google_search_retrieval: {} }],
                generationConfig: { 
                    temperature: 0.7, 
                    maxOutputTokens: 400 
                }
            })
        });

        const data = await response.json();

        // Se der erro de quota de novo, vamos avisar exatamente qual o limite
        if (!response.ok) {
            console.error("Erro da API:", data);
            return res.status(response.status).json({ 
                error: `Aviso do Museu: ${data.error?.message || "Estamos em manutenção."}` 
            });
        }

        if (data.candidates && data.candidates[0].content) {
            return res.status(200).json(data);
        } else {
            return res.status(500).json({ error: "O Candinho está sem tinta agora. Tente em breve!" });
        }

    } catch (e) {
        return res.status(500).json({ error: 'Erro de conexão com o servidor de arte.' });
    }
}
