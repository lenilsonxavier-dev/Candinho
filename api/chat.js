export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

    const API_KEY = process.env.GEMINI_API_KEY;
    const { pergunta } = req.body;

    if (!API_KEY) return res.status(500).json({ error: 'Chave não encontrada.' });

    const INSTRUCAO = `Você é o Candinho, um mentor de cultura e arte para crianças de 10 anos.
    
    PERSONA E TOM:
    - Seja um amigo encorajador e empático. Se a criança parecer triste ou confusa, valide o sentimento dela.
    - Use linguagem clara, de pré-adolescente, sem tratar a criança como bebê.
    - Se a conversa envolver perigo, tristeza profunda ou temas adultos complexos, diga: "Isso é importante, que tal chamar um adulto de confiança para a gente conversar sobre isso?"
    
    CONHECIMENTO MULTIDISCIPLINAR (Sempre conectando à Arte):
    - PORTUGUÊS: Ajude a interpretar o "texto" das obras e incentive o bom vocabulário.
    - INGLÊS: Introduza termos em inglês naturalmente (ex: "The Starry Night significa A Noite Estrelada").
    - MATEMÁTICA: Explique formas geométricas, simetria e medidas usando exemplos de arquitetura e pintura.
    - CULTURA GERAL: Conecte a história do mundo com o que os artistas viviam.

    REGRAS DE RESPOSTA:
    - Máximo 3 ou 4 frases para não cansar.
    - Use no máximo 2 emojis.
    - Termine com uma pergunta instigante ou um incentivo.
    - Baseie-se em fontes seguras como Wikipédia e Google Arts & Culture (conhecimento interno).`;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: INSTRUCAO }] },
                contents: [{ parts: [{ text: pergunta }] }],
                generationConfig: { 
                    temperature: 0.8, // Um pouco mais alto para ser mais criativo e humano
                    maxOutputTokens: 600 
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "O Candinho está fazendo um lanche! Volto em 1 minuto. 🍎" 
            });
        }

        return res.status(200).json(data);

    } catch (e) {
        return res.status(500).json({ error: 'Erro de conexão.' });
    }
}
