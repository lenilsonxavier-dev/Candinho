export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ resposta: "Método não permitido" });
  }

  const { mensagem } = req.body;

  // resposta simulada (pra testar tudo funcionando)
  return res.status(200).json({
    resposta: `🎨 Vamos falar de arte! Você disse: "${mensagem}"`
  });
}
