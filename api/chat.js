import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = {
  runtime: 'edge',
};

export async function POST(req) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ resposta: "Erro: API Key não configurada." }), { status: 500 });
    }

    const { mensagem } = await req.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // CORREÇÃO: Usando 'gemini-1.5-flash' (ou 'gemini-1.5-flash-latest')
    // A propriedade systemInstruction só funciona nas versões mais recentes da biblioteca
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", 
    }, { apiVersion: 'v1beta' }); // Força o uso da v1beta que suporta System Instructions

    // Configurando as instruções de sistema de forma explícita se o modelo acima não aceitar
    const chat = model.startChat({
      history: [],
      systemInstruction: "Você é o Candinho, um assistente infantil amigável e criativo. Seu objetivo é ensinar arte para crianças. REGRAS: 1. Responda APENAS sobre arte (pintura, desenho, cores, artistas famosos). 2. Se a criança perguntar sobre outros temas (matemática, política, jogos, etc), diga de forma gentil que você só entende de artes e convide-a a desenhar algo. 3. Use emojis e linguagem simples.",
    });

    const result = await chat.sendMessage(mensagem);
    const response = await result.response;
    const text = response.text();
    
    return new Response(JSON.stringify({ resposta: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Erro na API:", error);
    return new Response(JSON.stringify({ 
      resposta: "Ih, deu um errinho! Vamos tentar de novo?", 
      detalhe: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
