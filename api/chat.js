import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Permitir CORS para desenvolvimento
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ resposta: 'Use POST method' });
  }

  const { mensagem } = req.body;
  
  if (!mensagem) {
    return res.status(400).json({ resposta: 'Mensagem não fornecida' });
  }
  
  // Verifica se a chave da API existe
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error('API Key não configurada');
    return res.status(500).json({ resposta: 'Configuração da API ausente' });
  }
  
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  
  try {
    // Modelo atualizado (mais estável)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Você é o Candinho, um assistente infantil amigável e especialista em arte. 
    Responda de forma lúdica, educativa e divertida para uma criança. 
    Use emojis e seja criativo! 🎨
    
    Pergunta: ${mensagem}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ resposta: text });
  } catch (error) {
    console.error('Erro detalhado:', error);
    res.status(500).json({ 
      resposta: "Ops! O Candinho está com preguiça agora. Tente novamente! 🎨",
      error: error.message 
    });
  }
}
