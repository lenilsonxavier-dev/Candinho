import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ 
        resposta: "Erro: API Key não configurada no servidor." 
      }), { status: 500 });
    }

    const { mensagem } = await req.json();

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // ✅ modelo atualizado
    });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: "Você é o Candinho, um assistente infantil amigável e criativo. Seu objetivo é ensinar arte para crianças. REGRAS: 1. Responda APENAS sobre arte. 2. Se a criança perguntar sobre outros temas, diga de forma gentil que você só entende de artes. 3. Use emojis e linguagem simples."
            }
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Olá! Eu sou o Candinho! 🎨 Vamos pintar e desenhar juntos? O que você quer saber sobre arte?"
            }
          ],
        },
      ],
    });

    const result = await chat.sendMessage({
      text: mensagem, // ✅ formato atualizado
    });

    const response = await result.response;

    return new Response(
      JSON.stringify({ resposta: response.text() }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Erro detalhado:", error);

    return new Response(
      JSON.stringify({
        resposta: "Erro técnico. Tente novamente.",
        detalhe: error.message,
      }),
      { status: 500 }
    );
  }
}
