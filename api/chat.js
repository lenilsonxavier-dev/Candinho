export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

    const API_KEY = process.env.GEMINI_API_KEY;
    const { pergunta } = req.body;

    if (!API_KEY) return res.status(500).json({ error: 'Chave não encontrada.' });

    // INSTRUÇÃO ESPECIALIZADA: Simulamos o acesso a fontes confiáveis
    const INSTRUCAO = `Você é o Candinho, um tutor de arte para crianças de 10 anos.
    Sua base de conhecimento é estritamente focada em: Wikipédia, Google Arts & Culture, Livros de História da Arte e arquivos de museus como Louvre e MASP.
    
    REGRAS:
    1. Responda apenas sobre arte, pintores, esculturas e cultura.
    2. Use linguagem simples, mas cite curiosidades históricas reais.
    3. Sempre que falar de um quadro, se possível, sugira que a criança procure o título no "Google Arts & Culture" para ver em alta definição.
    4. Responda em no máximo 3 frases.
    5. Se pedirem algo fora de arte, diga: "Meu pincel só desenha história da arte! Vamos falar sobre um pintor?"`;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: INSTRUCAO }] },
                contents: [{ parts: [{ text: pergunta }] }],
                generationConfig: { 
                    temperature: 0.6, // Menor temperatura para ser mais preciso nos fatos históricos
                    maxOutputTokens: 500 
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "O museu está fechado para limpeza! (Erro de Quota/Demanda). Tente em 1 minuto." 
            });
        }

        return res.status(200).json(data);

    } catch (e) {
        return res.status(500).json({ error: 'Erro de conexão com o servidor.' });
    }
}
