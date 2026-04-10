import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔒 filtro de segurança
function filtroSeguro(texto) {
  const proibidos = ["sexo", "arma", "matar", "droga"];
  return !proibidos.some(p => texto.toLowerCase().includes(p));
}

// 🎨 filtro de arte
function assuntoArte(texto) {
  const palavras = [
    "arte", "desenho", "pintura", "cor",
    "artista", "quadro", "museu", "escultura"
  ];

  return palavras.some(p => texto.toLowerCase().includes(p));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Método não permitido");
  }

  const { mensagem } = req.body;

  // 🔒 segurança
  if (!filtroSeguro(mensagem)) {
    return res.json({
      resposta: "Vamos focar nos estudos 😊"
    });
  }

  // 🎨 bloqueio fora da arte
  if (!assuntoArte(mensagem)) {
    return res.json({
      resposta: "Vamos falar de arte! 🎨"
    });
  }

  try {
    const resposta = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Você é Candinho 🎨

Um assistente infantil especializado em ARTE.

Você só pode falar sobre:
- pintura
- desenho
- artistas
- história da arte
- cores e técnicas

Regras:
- Fale simples e divertido
- Ensine passo a passo
- Nunca fale temas adultos
- Nunca responda assuntos fora da arte

Se sair do tema:
"Vamos falar de arte! 🎨 Que tal desenhar algo comigo?"
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
