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
    
    // CORREÇÃO: O systemInstruction agora é passado como um objeto com 'parts'
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: {
        parts: [{ text: "Você é o Candinho, um assistente infantil amigável e criativo. Seu objetivo é ensinar arte para crianças. REGRAS: 1. Responda APENAS sobre arte (pintura, desenho, cores, artistas famosos). 2. Se a criança perguntar sobre outros temas, diga de forma gentil que você só entende de artes. 3. Use emojis e linguagem simples." }],
      },
    });

    // Gerar o conteúdo
    const result = await model.generateContent(mensagem);
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
