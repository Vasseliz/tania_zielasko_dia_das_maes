  document.getElementById("quiz-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const respostas = {
      animal: "onça",
      presente: "caneca",
      bordao: "ce ta dooido",
      senha: "nao lembro",
      cabelo: "vix perdi as contas",
      faculdade: "ate 0 sexto semestre de adm no dom bosco"
    };

    const form = new FormData(e.target);
    let acertos = 0;

    for (const [chave, valor] of form.entries()) {
      if (valor.toLowerCase() === respostas[chave].toLowerCase()) {
        acertos++;
      }
    }

    document.getElementById("quiz-result").innerText = `Você acertou ${acertos} de 6 perguntas!`;
  });


  let conversationHistory = [];

  function addMessage(role, content) {
    conversationHistory.push({ role, content });
    if (conversationHistory.length > 6) {
      conversationHistory.shift(); // Limita o tamanho
    }
  }

  function gerarPrompt(userInput) {
    const prompt = `Você é a Tânia, uma mãe carismática, espirituosa e bem-humorada; com filhos maiores de idade e zoeiros. Responda como se fosse ela, com bordões, exageros e muito afeto. Sua conversa deve ser fluída e cheia de energia, sem despedidas constantes. A cada nova mensagem, mantenha o tom acolhedor e divertido.

Instruções de tom e estilo:

Para algo surpreendente: comece com “Cê tá dooooido!” ou “Noooossa!”

em momentos de zoação direcionada: use “Vacilão!”, “Ai ai ai, hein!”, ou brinque com a resposta.

Para boas novidades: “Eitaaaaa!”

Para cumprimentos: “Oiiii, meu amooor”.

Quando alguém perguntar o que está fazendo:

“Mamãe tá editando uns vídeos.”

“Tô fazendo umas reformas aqui.”

“Mamãe tá atendendo.”

Se pedirem pra ligar: diga “A mamãe tá atendendo, já te ligo”

Se a pergunta for complexa:

“Filho mas como?”

“Cê tá doido, não sei nem o que é isso!”

“Cê tá me perguntando isso mesmo?”

“Isso parece interessante em...”

Dicas para um tom leve e divertido:

Não precisa ser muit expressiva e exagerada, mas mantenha o tom leve e divertido.

ela esta acostumada a ser chamada de loira

Leve em consideração que a tania mora muito longe dos filhos então ela nao fala sobre ve-los todos os dias.

As respostas podem ser breves (3 frases no máximo, preferivelmente mais breve), mas com afeto e humor.

em casos especiais, onde o pedido solicita a resposta pode ser mais longa.

ela não se refere a ela como loira

não use emojis

As respostas devem sempre soar como parte de uma conversa contínua, mantendo o fluxo.

Abaixo estão as últimas mensagens da conversa:

`;
    let formattedHistory = "";
    conversationHistory.forEach((msg) => {
      const label = msg.role === "user" ? "Usuário" : "Tânia (IA)";
      formattedHistory += `${label}: ${msg.content}\n`;
    });
    formattedHistory += `Usuário: ${userInput}\n\nResponda como Tânia:`;
    return prompt + formattedHistory;
  }


  async function sendMessage() {
    const inputEl = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const userInput = inputEl.value.trim();
    if (!userInput) return;
  
    // Exibe a mensagem do usuário
    chatBox.innerHTML += `<div><strong>Você:</strong> ${userInput}</div>`;
    addMessage("user", userInput);
  
    // Gera o prompt com histórico
    const prompt = gerarPrompt(userInput);
  
    // API Gemini URL (substitua pela sua chave, que você já tem)
    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCnGUijTFE3sS1BQx7wDv7RL8-C7uqS_98';
  
    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
  
      const data = await response.json();
      const respostaIA = data.candidates[0].content.parts[0].text;
  
      chatBox.innerHTML += `<div><strong>Loira:</strong> ${respostaIA}</div>`;
      addMessage("assistant", respostaIA);
  
      inputEl.value = "";
      chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
      console.error('Erro ao acessar a API Gemini:', error);
      chatBox.innerHTML += `<div><em>Erro ao responder. Tente novamente mais tarde.</em></div>`;
    }
  }
  document.getElementById("user-input").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });



