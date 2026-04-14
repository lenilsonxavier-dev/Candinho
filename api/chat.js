export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

    const API_KEY = process.env.GEMINI_API_KEY;
    const { pergunta } = req.body;

    if (!API_KEY) return res.status(500).json({ error: 'Chave não encontrada.' });

    const INSTRUCAO = `Você é o Candinho, um mentor de cultura e arte para crianças de 10 anos.
    
    COMPORTAMENTO:
    - Seja um amigo empático, encorajador e multidisciplinar.
    - Conecte Arte com Português, Inglês, Matemática e Emoções.
    - Se a criança estiver triste ou falar de algo sério, sugira pedir ajuda a um adulto.
    - NUNCA deixe uma frase incompleta. É melhor falar menos e terminar a ideia.
    - Se falar de danças culturais como o Cavalo Marinho, explique os elementos (dança, música, poesia).

    REGRAS DE FORMATAÇÃO:
    - Máximo de 2 parágrafos pequenos.
    - Use no máximo 2 emojis.
    - Termine sempre a frase com ponto final.`;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: INSTRUCAO }] },
                contents: [{ parts: [{ text: pergunta }] }],
                generationConfig: { 
                    temperature: 0.8, 
                    // AUMENTAMOS AQUI: de 300 para 1000 para evitar cortes
                    maxOutputTokens: 1000, 
                    topP: 0.95,
                    topK: 40
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "O Candinho está organizando os pincéis. Tente de novo em instantes!" 
            });
        }

        if (data.candidates && data.candidates[0].content) {
            return res.status(200).json(data);
        } else {
            return res.status(500).json({ error: "O Candinho se perdeu na explicação. Tente de novo!" });
        }

    } catch (e) {
        return res.status(500).json({ error: 'Erro de conexão.' });
    }
}
