<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Candinho - Assistente para crianças de 10 anos</title>
    <style>
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        
        .container {
            max-width: 700px;
            margin: 0 auto;
            background: #0f3460;
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        
        .header {
            display: flex;
            align-items: center;
            gap: 20px;
            background: #e94560;
            padding: 15px 20px;
            border-radius: 15px;
            margin-bottom: 20px;
        }
        
        .avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #fff;
            padding: 5px;
            box-shadow: 0 0 0 3px #ffd700;
        }
        
        .avatar img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
        }
        
        .title h1 {
            margin: 0;
            color: white;
            font-size: 28px;
        }
        
        .title p {
            margin: 5px 0 0;
            color: #ffe0e0;
        }
        
        .chat-area {
            background: #1a1a2e;
            border-radius: 15px;
            padding: 20px;
            height: 450px;
            overflow-y: auto;
            margin-bottom: 20px;
        }
        
        .mensagem {
            margin: 15px 0;
            padding: 12px 18px;
            border-radius: 18px;
            max-width: 85%;
            word-wrap: break-word;
            font-size: 15px;
            line-height: 1.4;
        }
        
        .usuario {
            background: #e94560;
            color: white;
            margin-left: auto;
            text-align: right;
            border-bottom-right-radius: 5px;
        }
        
        .candinho {
            background: #533483;
            color: white;
            border-bottom-left-radius: 5px;
        }
        
        .input-area {
            display: flex;
            gap: 12px;
        }
        
        input {
            flex: 1;
            padding: 14px;
            border: none;
            border-radius: 25px;
            font-size: 15px;
            font-family: inherit;
            background: #f0f0f0;
        }
        
        button {
            background: #e94560;
            color: white;
            border: none;
            padding: 14px 28px;
            border-radius: 25px;
            font-size: 15px;
            cursor: pointer;
            font-weight: bold;
        }
        
        button:hover {
            background: #d63454;
        }
        
        .status {
            font-size: 12px;
            text-align: center;
            margin-top: 15px;
            color: #aaa;
        }
        
        @keyframes blink {
            0% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        
        .pensando {
            animation: blink 1s infinite;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="avatar">
                <img src="https://i.imgur.com/iWmEdZz.jpg" alt="Avatar do Candinho">
            </div>
            <div class="title">
                <h1>Candinho</h1>
                <p>Assistente para crianças de 10 anos</p>
            </div>
        </div>
        
        <div class="chat-area" id="chat">
            <div class="mensagem candinho">
                E aí, beleza? Sou o Candinho. Pode perguntar qualquer coisa.
            </div>
        </div>
        
        <div class="input-area">
            <input type="text" id="pergunta" placeholder="Digite sua mensagem..." 
                   onkeypress="if(event.key === 'Enter') enviarMensagem()">
            <button onclick="enviarMensagem()">Enviar</button>
        </div>
        <div class="status">
            🔒 Seguro para crianças de 10 anos | Linguagem direta
        </div>
    </div>

    <script>
        // SUA CHAVE DO GEMINI AQUI (grátis em aistudio.google.com)
        const API_KEY = "AIzaSyCG2LNKnOPUkvHuAMlT3d8wpMuWReuZNIw";
        
        const INSTRUCAO = `Você é o 'Candinho', assistente para crianças de 10 anos.
        
REGRAS:
- Use linguagem normal de pré-adolescente, SEM diminutivos
- Seja legal e direto, sem tratar a criança como bebê
- Máximo 1 emoji por resposta
- Respostas curtas (máximo 2 frases)
- Se for perigoso: "Melhor chamar um adulto para ajudar"
- Termine com "--- Candinho"`;
        
        async function enviarMensagem() {
            const input = document.getElementById('pergunta');
            const pergunta = input.value.trim();
            
            if (!pergunta) return;
            
            const chatDiv = document.getElementById('chat');
            
            // Mostra mensagem do usuário
            const msgUsuario = document.createElement('div');
            msgUsuario.className = 'mensagem usuario';
            msgUsuario.textContent = pergunta;
            chatDiv.appendChild(msgUsuario);
            
            input.value = '';
            chatDiv.scrollTop = chatDiv.scrollHeight;
            
            // Indicador de digitação
            const pensando = document.createElement('div');
            pensando.className = 'mensagem candinho pensando';
            pensando.textContent = 'Candinho está digitando...';
            chatDiv.appendChild(pensando);
            chatDiv.scrollTop = chatDiv.scrollHeight;
            
            try {
                const resposta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        system_instruction: { parts: [{ text: INSTRUCAO }] },
                        contents: [{ parts: [{ text: pergunta }] }],
                        generationConfig: { temperature: 0.8, maxOutputTokens: 120 }
                    })
                });
                
                const dados = await resposta.json();
                chatDiv.removeChild(pensando);
                
                let textoResposta = "Não entendi, tenta de novo. --- Candinho";
                if (dados.candidates && dados.candidates[0]) {
                    textoResposta = dados.candidates[0].content.parts[0].text;
                }
                
                const msgCandinho = document.createElement('div');
                msgCandinho.className = 'mensagem candinho';
                msgCandinho.textContent = textoResposta;
                chatDiv.appendChild(msgCandinho);
                
            } catch (erro) {
                chatDiv.removeChild(pensando);
                const msgErro = document.createElement('div');
                msgErro.className = 'mensagem candinho';
                msgErro.textContent = 'Erro de conexão. Tenta de novo. --- Candinho';
                chatDiv.appendChild(msgErro);
                console.error(erro);
            }
            
            chatDiv.scrollTop = chatDiv.scrollHeight;
        }
    </script>
</body>
</html>
