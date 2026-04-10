import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function filtroSeguro(texto) {
  const proibidos = ["sexo", "arma", "matar", "droga"];
  return !proibidos.some(p => texto.toLowerCase().includes(p));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Método não permitido");
  }

  const { mensagem } = req.body;

  if (!filtroSeguro(mensagem)) {
    return res.json({
      resposta: "Vamos focar nos estudos 😊"
    });
  }

  try {
    const resposta = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Você é Candinho 🤖📚

Uma IA infantil educativa.

Regras:
- Fale simples
- Seja divertido
- Ensine passo a passo
- Nunca fale temas adultos
`
        },
        {
          role: "user",
          content: mensagem
        }
      ]
    });

    return res.json({
      resposta: resposta.choices[0].message.content
    });

  } catch (e) {
    return res.json({
      resposta: "Tive um errinho 😢 tenta de novo!"
    });
  }
}
