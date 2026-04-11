import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Apenas método POST é permitido' });
  }

  const { mensagem } = req.body;

  // 1. Inicializa o Gemini com a sua chave que está na Vercel
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  
  // 2. Escolhe o modelo Flash (rápido e gratuito)
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    // Aqui configuramos a personalidade do Candinho!
    systemInstruction: "Você é o Candinho, um boneco artista e amigável inspirado no pintor Candido Portinari. Sua missão é ensinar arte para crianças de forma lúdica, simples e segura. Use emojis e nunca fale termos complicados ou temas adultos.",
  });

  try {
    const result = await model.generateContent(mensagem);
    const response = await result.response;
    const text = response.text();

    // 3. Devolve a resposta para o seu HTML
    res.status(200).json({ resposta: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ resposta: "Ops! O pincel do Candinho entupiu. Tente de novo!" });
  }
}
