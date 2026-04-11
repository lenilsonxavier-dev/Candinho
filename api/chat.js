import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. Configuração de Headers para evitar erros de CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method !== 'POST') {
    return res.status(405).json({ resposta: 'Por favor, use POST' });
  }

  try {
    // 2. Verifica se a chave existe
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("Chave API não encontrada na Vercel");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 3. Usando o modelo flash (mais estável)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "Você é o Candinho, um assistente infantil inspirado em Portinari. Seja lúdico e amigável."
    });

    const { mensagem } = req.body;

    if (!mensagem) {
      return res.status(400).json({ resposta: "Escreva algo para o Candinho!" });
    }

    const result = await model.generateContent(mensagem);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ resposta: text });

  } catch (error) {
    console.error("Erro no Candinho:", error);
    return res.status(500).json({ resposta: "Erro: " + error.message });
  }
}
