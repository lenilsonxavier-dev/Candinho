export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

    const API_KEY = process.env.GEMINI_API_KEY;
    const { pergunta } = req.body;

    if (!API_KEY) return res.status(500).json({ error: 'Chave não encontrada.' });

    const INSTRUCAO = `Você é o Candinho, tutor de arte para crianças de 10 anos.
    Responda em português, de forma amigável e curta (max 3 frases).
    Se não for sobre arte ou cultura, diga que seu pincel só desenha arte.`;

    try {
        // USANDO O ALIAS "LATEST" PARA PEGAR O MELHOR SERVIDOR DISPONÍVEL
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: INSTRUCAO }] },
                contents: [{ parts: [{ text: pergunta }] }],
                generationConfig: { 
                    temperature: 0.7, 
                    maxOutputTokens: 400 
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Se o erro for "High Demand", vamos dar uma resposta personalizada
            if (response.status === 503 || data.error?.message?.includes('demand')) {
                return res.status(200).json({ 
                    candidates: [{ content: { parts: [{ text: "O museu está muito lotado agora! 🏛️ Espere um minutinho e me pergunte de novo?" }] } }]
                });
            }
            return res.status(response.status).json({ error: data.error?.message });
        }

        return res.status(200).json(data);

    } catch (e) {
        return res.status(500).json({ error: 'Erro de conexão com o museu.' });
    }
}
