import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  try {
    const { mensagem } = req.body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const resposta = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é Candinho 🎨, professor infantil de arte."
        },
        {
          role: "user",
          content: mensagem
        }
      ]
    });

    const texto = resposta.choices?.[0]?.message?.content || "Sem resposta 😢";

    return res.status(200).json({
      resposta: texto
    });

  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      resposta: "Erro interno 😢",
      detalhe: erro.message
    });
  }
}
