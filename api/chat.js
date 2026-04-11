import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = {
  runtime: 'edge', // Isso força a Vercel a usar um motor ultra rápido
};

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Use POST', { status: 405 });

  try {
    const { mensagem } = await req.json(); // Forma diferente de ler a mensagem
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(`Aja como o Candinho, assistente infantil: ${mensagem}`);
    const response = await result.response;
    
    return new Response(JSON.stringify({ resposta: response.text() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ resposta: "Erro: " + error.message }), { status: 500 });
  }
}
