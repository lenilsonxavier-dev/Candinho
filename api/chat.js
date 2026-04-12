// api/chat.js
export default async function handler(req, res) {
    // Permite apenas requisições POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { pergunta } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY; // A chave virá das variáveis de ambiente

    const INSTRUCAO = `Você é o 'Candinho', um tutor de arte para crianças de 10 anos.
    FOCO: História da arte e criatividade. 
    REGRAS: Respostas curtas (máximo 3 frases), linguagem simples, se não for arte, recuse gentilmente.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: pergunta }] }],
                system_instruction: { parts: [{ text: INSTRUCAO }] },
                tools: [{ google_search_retrieval: {} }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 250 }
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar o Gemini' });
    }
}
