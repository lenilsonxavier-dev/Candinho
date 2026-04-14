export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

    const API_KEY = process.env.GEMINI_API_KEY;
    const { pergunta } = req.body;

    if (!API_KEY) return res.status(500).json({ error: 'Chave não encontrada.' });

    // Instrução para o Candinho (Especialista em Arte)
    const INSTRUCAO = `Você é o Candinho, tutor de arte para crianças de 10 anos.
    Responda em português, de forma amigável e curta (max 3 frases).
    Se a pergunta não for sobre arte ou cultura, diga que seu pincel só desenha arte.`;

    try {
        // MODELO ATUALIZADO PARA 2026: Gemini 3.1 Flash-Lite
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: INSTRUCAO }] },
                contents: [{ parts: [{ text: pergunta }] }],
                // MANTEMOS O SEARCH DESLIGADO PARA GARANTIR A QUOTA
                generationConfig: { 
                    temperature: 0.7, 
                    maxOutputTokens: 300 
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Se der erro de quota aqui, ele vai dizer o motivo real
            return res.status(response.status).json({ 
                error: `Aviso do Museu: ${data.error?.message || "Estamos em manutenção."}` 
            });
        }

        if (data.candidates && data.candidates[0].content) {
            return res.status(200).json(data);
        } else {
            return res.status(500).json({ error: "O Candinho está sem tinta. Tente de novo!" });
        }

    } catch (e) {
        return res.status(500).json({ error: 'Erro de conexão com o museu.' });
    }
}
