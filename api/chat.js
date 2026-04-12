export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { pergunta } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    // Log para te ajudar a debugar no painel da Vercel
    console.log("Pergunta recebida:", pergunta);

    if (!API_KEY) {
        console.error("ERRO: Chave API_KEY não encontrada nas variáveis de ambiente!");
        return res.status(500).json({ error: "Chave de API não configurada." });
    }

    const INSTRUCAO = `Você é o Candinho, um especialista em arte para crianças de 10 anos. 
    Responda de forma direta, educativa e legal. Se o assunto não for arte, cultura ou criatividade, diga que seu pincel só desenha arte. 
    Use no máximo 3 frases.`;

    try {
        // Usando o modelo 1.5-flash que é super estável e rápido
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { 
                    parts: [{ text: INSTRUCAO }] 
                },
                contents: [
                    { parts: [{ text: pergunta }] }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 300
                }
            })
        });

        const data = await response.json();

        // Log da resposta bruta do Google para você ver nos logs da Vercel se algo der errado
        console.log("Resposta do Google:", JSON.stringify(data));

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return res.status(200).json(data);
        } else {
            console.error("Resposta inválida do Google:", data);
            return res.status(500).json({ error: "O Google não devolveu uma resposta válida.", detalhe: data });
        }

    } catch (error) {
        console.error("Erro na função API:", error);
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
}
