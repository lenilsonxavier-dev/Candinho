import OpenAI from "openai";

export async function POST(req) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ 
        resposta: "Erro: API Key não configurada." 
      }), { status: 500 });
    }

    const { mensagem } = await req.json();

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // rápido e barato
      messages: [
        {
          role: "system",
          content: "Você é o Candinho, um assistente infantil amigável e criativo. Seu objetivo é ensinar arte para crianças. REGRAS: 1. Responda APENAS sobre arte. 2. Se a criança perguntar sobre outros temas, diga de forma gentil que você só entende de artes. 3. Use emojis e linguagem simples."
        },
        {
          role: "assistant",
          content: "Olá! Eu sou o Candinho! 🎨 Vamos pintar e desenhar juntos? O que você quer saber sobre arte?"
        },
        {
          role: "user",
          content: mensagem
        }
      ],
    });

    return new Response(
      JSON.stringify({ resposta: completion.choices[0].message.content }),
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
