export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

    const API_KEY = process.env.GEMINI_API_KEY;
    const { pergunta } = req.body;

    if (!API_KEY) return res.status(500).json({ error: 'Chave API_KEY não configurada.' });

    // Instrução poderosa que já define o comportamento e os filtros
    const instrucaoTexto = `Você é o Candinho, tutor de arte para crianças de 10 anos. 
    Responda em português, de forma amigável e curta. 
    Sempre use informações reais sobre arte e artistas.
    Se a pergunta não for sobre arte ou cultura, responda que seu pincel só sabe falar de arte.`;

    try {
        // Usamos v1beta e o modelo gemini-1.5-flash que é o padrão atual
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

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
                // ATIVA A BUSCA NO GOOGLE (Internet)
                tools: [{
                    google_search_retrieval: {}
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 400
                }
            })
        });

        const data = await response.json();

        // Se der erro de "Model not found", tentaremos capturar a mensagem real
        if (data.error) {
            console.error("Erro detalhado:", data.error);
            return res.status(500).json({ error: `O Google disse: ${data.error.message}` });
        }

        if (data.candidates && data.candidates[0].content) {
            // Retornamos a resposta e, se houver, os links de pesquisa (grounding)
            return res.status(200).json(data);
        } else {
            return res.status(500).json({ error: "Resposta vazia. Tente perguntar de outro jeito." });
        }

    } catch (e) {
        return res.status(500).json({ error: 'Erro crítico de conexão.' });
    }
}
