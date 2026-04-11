import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = {
  runtime: 'edge',
};

export async function POST(req) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ resposta: "Erro: API Key não configurada." }), { status: 500 });

    const { mensagem } = await req.json();
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Pegamos o modelo sem passar a instrução de sistema aqui (para evitar o erro 400)
    const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Tente mudar para "gemini-1.5-flash" ou "gemini-pro"
  systemInstruction: {
    parts: [{ text: "Você é o Candinho..." }],
  },
});
    // Passamos a instrução dentro do "chat" como se fosse a primeira mensagem
    // Isso é aceito por todas as versões da API e funciona igual!
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Você é o Candinho, um assistente infantil amigável e criativo. Seu objetivo é ensinar arte para crianças. REGRAS: 1. Responda APENAS sobre arte. 2. Se a criança perguntar sobre outros temas, diga de forma gentil que você só entende de artes. 3. Use emojis e linguagem simples." }],
        },
        {
          role: "model",
          parts: [{ text: "Olá! Eu sou o Candinho! 🎨 Vamos pintar e desenhar juntos? O que você quer saber sobre arte?" }],
        },
      ],
    });

    const result = await chat.sendMessage(mensagem);
    const response = await result.response;
    
    return new Response(JSON.stringify({ resposta: response.text() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Erro na API:", error);
    return new Response(JSON.stringify({ 
      resposta: "Ih, deu um erro! Vamos tentar de novo?", 
      detalhe: error.message 
    }), { status: 500 });
  }
}
