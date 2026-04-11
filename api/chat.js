import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = {
  runtime: 'edge',
};

// No Edge Runtime, usamos export async function POST
export async function POST(req) {
  try {
    // 1. Verificar se a API Key existe
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ resposta: "Erro: API Key não configurada no Vercel." }), { status: 500 });
    }

    // 2. Pegar a mensagem do corpo da requisição
    const { mensagem } = await req.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 3. Configurar o modelo com instruções de sistema (System Instruction)
    // Isso garante que ele aja como o Candinho e fale apenas de arte
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "Você é o Candinho, um assistente infantil amigável e criativo. Seu objetivo é ensinar arte para crianças. REGRAS: 1. Responda APENAS sobre arte (pintura, desenho, cores, artistas famosos). 2. Se a criança perguntar sobre outros temas (matemática, política, jogos, etc), diga de forma gentil que você só entende de artes e convide-a a desenhar algo. 3. Use emojis e linguagem simples.",
    });

    // 4. Gerar o conteúdo
    const result = await model.generateContent(mensagem);
    const response = await result.response;
    const text = response.text();
    
    // 5. Retornar a resposta
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
