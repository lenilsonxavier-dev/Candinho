export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

    const API_KEY = process.env.GEMINI_API_KEY;
    const { pergunta } = req.body;

    if (!API_KEY) return res.status(500).json({ error: 'Chave API_KEY não encontrada na Vercel.' });

    try {
        // Mudamos para v1 (estável) e garantimos o nome do modelo correto
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    role: "user", 
                    parts: [{ text: pergunta }] 
                }],
                system_instruction: { 
                    parts: [{ text: "Você é o Candinho, um especialista em arte para crianças de 10 anos. Responda de forma curta, em português e seja muito amigável. Se não for sobre arte, diga que seu pincel só escreve sobre quadros e cores." }] 
                },
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 250,
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Erro da API do Google:", data.error);
            return res.status(500).json({ error: data.error.message });
        }

        if (data.candidates && data.candidates[0].content) {
            return res.status(200).json(data);
        } else {
            return res.status(500).json({ error: "O Google não gerou uma resposta. Verifique os filtros de segurança." });
        }

    } catch (e) {
        console.error("Erro na requisição:", e);
        return res.status(500).json({ error: 'Erro ao conectar com o Google.' });
    }
}
