import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ resposta: "Método não permitido" });
  }

  const { mensagem } = req.body;

  try {
    // 🔑 verifica chave
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("API key não encontrada");
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const resposta = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Você é Candinho 🎨

Um assistente infantil especialista em ARTE.

Regras:
- Fale simples
- Seja divertido
- Ensine como professor
- Só fale sobre arte
- Nunca responda assuntos fora de arte

Se fugir do tema:
"Vamos falar de arte! 🎨"
`
        },
        {
          role: "user",
          content: mensagem
        }
      ]
    });

    const texto =
      resposta.choices?.[0]?.message?.content ||
      "Hmm... vamos tentar de novo? 😊";

    return res.status(200).json({
      resposta: texto
    });

  } catch (erro) {
    console.error("Erro IA:", erro.message);

    // 🛟 fallback (SEMPRE responde)
    return res.status(200).json({
      resposta: `🎨 Vamos falar de arte! Você disse: "${mensagem}"`
    });
  }
}
