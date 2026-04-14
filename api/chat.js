export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

    const API_KEY = process.env.GEMINI_API_KEY;
    const { pergunta } = req.body;

    if (!API_KEY) return res.status(500).json({ error: 'Chave API_KEY não configurada na Vercel.' });

    const INSTRUCAO = `Você é o Candinho, um mentor de arte e cultura para crianças de 10 anos. 
    Responda de forma amigável, clara e multidisciplinar.
    Sempre termine suas frases e raciocínios. Nunca pare no meio de uma palavra.
    Se o assunto for sério ou perigoso, sugira pedir ajuda a um adulto de confiança.
    Foco: Arte, Português, Inglês e Matemática básica aplicada à cultura.`;

    try {
        // Usando a versão estável v1beta para o modelo 1.5-flash
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: INSTRUCAO }] },
                contents: [{ parts: [{ text: pergunta }] }],
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.95,
                    maxOutputTokens: 1024, // Espaço suficiente para não cortar
                },
                // Reduz a chance de o filtro de segurança cortar a frase no meio
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
                ]
            })
        });

        const data = await response.json();

        // Tratamento de erros detalhado
        if (!response.ok) {
            const msgErro = data.error?.message || "Erro desconhecido";
            
            // Tradução de erros comuns para você entender o que está acontecendo
            if (msgErro.includes("quota")) return res.status(429).json({ error: "Limite atingido! Espere 1 minuto para perguntar de novo." });
            if (msgErro.includes("overloaded")) return res.status(503).json({ error: "O servidor do Google está lotado. Tente em instantes." });
            
            return res.status(response.status).json({ error: `Google disse: ${msgErro}` });
        }

        // Verifica se o Google parou de escrever por segurança (cortando a frase)
        if (data.candidates && data.candidates[0].finishReason === "SAFETY") {
            return res.status(200).json({ 
                candidates: [{ content: { parts: [{ text: "Hum, esse assunto eu não consigo comentar. Vamos falar de arte, cores ou música?" }] } }]
            });
        }

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: 'Erro de conexão: ' + error.message });
    }
}
