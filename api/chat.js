import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Se não for POST, ignora
  if (req.method !== 'POST') return res.status(405).send('Use POST');

  const { mensagem } = req.body;
  
  // Puxa a chave da Vercel
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Comando para o Candinho
    const prompt = `Você é o Candinho, um assistente infantil amigável. Responda de forma lúdica: ${mensagem}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Envia a resposta de volta
    res.status(200).json({ resposta: text });
  } catch (error) {
    // Se der erro, ele vai avisar o que foi
    res.status(500).json({ resposta: "Erro no servidor: " + error.message });
  }
}
