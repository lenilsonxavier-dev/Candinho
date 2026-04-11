export async function POST(req) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ resposta: "Erro: API Key não configurada." }), { status: 500 });

    const { mensagem } = await req.json();
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // CORREÇÃO: Use gemini-pro ou gemini-1.5-pro
    const model = genAI.getGenerativeModel({
      model: "gemini-pro", 
      systemInstruction: {
        parts: [{ text: "Você é o Candinho..." }],
      },
    });
    
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
