import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Use POST');

  const { mensagem } = req.body;
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  
  try {
    // Usando o nome "gemini-pro" que é o mais estável para evitar o erro 404
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Você é o Candinho, um assistente infantil amigável. Responda de forma lúdica: ${mensagem}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ resposta: text });
  } catch (error) {
    res.status(500).json({ resposta: "Erro no servidor: " + error.message });
  }
}
