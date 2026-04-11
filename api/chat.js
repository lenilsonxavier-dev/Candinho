import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Se não for POST, sai fora
  if (req.method !== 'POST') {
    return res.status(405).json({ resposta: 'Método não permitido' });
  }

  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ resposta: 'Erro: Chave API não configurada na Vercel.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { mensagem } = req.body;

    const result = await model.generateContent(`Aja como o Candinho, assistente infantil: ${mensagem}`);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ resposta: text });
  } catch (error) {
    return res.status(500).json({ resposta: "Erro no servidor: " + error.message });
  }
}
