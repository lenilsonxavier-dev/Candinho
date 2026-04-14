export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

    const API_KEY = process.env.GEMINI_API_KEY;
    const { pergunta } = req.body;

    if (!API_KEY) return res.status(500).json({ error: 'Chave não encontrada.' });

    // Instrução focada no conhecimento interno do modelo
    const INSTRUCAO = `Você é o Candinho, tutor de arte para crianças de 10 anos.
    Use seu vasto conhecimento sobre História da Arte para responder.
    Responda em português, de forma amigável e curta (max 3 frases).
    Se não for sobre arte ou cultura, diga que seu pincel só desenha arte.`;

    try {
        // Usando o 1.5-flash que é o mais generoso com usuários gratuitos
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: INSTRUCAO }] },
                contents: [{ parts: [{ text: pergunta }] }],
                // REMOVEMOS O BLOCO "tools" (Pesquisa Google) PARA SALVAR A QUOTA
                generationConfig: { 
                    temperature: 0.7, 
                    maxOutputTokens: 350 
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: `Aviso do Museu: ${data.error?.message || "Estamos em manutenção."}` 
            });
        }

        return res.status(200).json(data);

    } catch (e) {
        return res.status(500).json({ error: 'Erro de conexão.' });
    }
}
