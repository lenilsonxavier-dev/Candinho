import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  try {
    const { mensagem } = req.body;

    const resposta = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Você é Candinho 🎨
Um assistente infantil que fala apenas sobre arte.
Use linguagem simples e divertida.
Nunca responda fora do tema arte.
`
        },
        {
          role: "user",
          content: mensagem
        }
      ]
    });

    return res.status(200).json({
      resposta: resposta.choices[0].message.content
    });

  } catch (erro) {
    console.error("ERRO:", erro);

    return res.status(500).json({
      resposta: "Erro interno 😢",
      detalhe: erro.message
    });
  }
}
