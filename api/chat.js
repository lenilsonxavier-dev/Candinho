import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ resposta: 'Use POST' });

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Pegamos a mensagem e garantimos que ela existe
    const { mensagem } = req.body;
    
    if (!mensagem) {
      return res.status(400).json({ resposta: "Opa! Você esqueceu de escrever algo. 🎨" });
    }

    const prompt = `Você é o Candinho, um assistente infantil amigável. Responda para uma criança: ${mensagem}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ resposta: text });

  } catch (error) {
    console.error(error);
    // Isso vai nos mostrar o erro real se a "preguiça" continuar
    return res.status(500).json({ resposta: "O Candinho disse: " + error.message });
  }
}
