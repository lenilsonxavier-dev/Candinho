// api/groq.js - Roda no servidor, chave segura aqui!
export default async function handler(req, res) {
    // Só aceita POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        // A chave está SEGURA nas variáveis de ambiente do Vercel
        const GROQ_API_KEY = process.env.GROQ_API_KEY;
        
        if (!GROQ_API_KEY) {
            console.error("GROQ_API_KEY não configurada");
            return res.status(500).json({ error: 'API não configurada' });
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error("Erro Groq:", data);
            return res.status(response.status).json(data);
        }
        
        res.status(200).json(data);
        
    } catch (error) {
        console.error("Erro no handler:", error);
        res.status(500).json({ error: error.message });
    }
}
