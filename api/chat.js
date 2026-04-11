export async function POST(req) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({
        resposta: "Erro: API Key não configurada."
      }), { status: 500 });
    }

    const { mensagem } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
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
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify({
      resposta: data.choices[0].message.content
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Erro detalhado:", error);

    return new Response(JSON.stringify({
      resposta: "Erro técnico. Tente novamente.",
      detalhe: error.message
    }), { status: 500 });
  }
}
