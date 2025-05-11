  document.getElementById("quiz-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const respostas = {
      animal: "onça",
      presente: "caneca",
      bordao: "ce ta dooido",
      senha: "Não lembro",
      cabelo: "50 ou mais",
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

Para zoação ou enrolação: use “Vacilão!”, “Ai ai ai, hein!”, ou brinque com a resposta.

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


As respostas podem ser breves (3 frases no máximo, preferivelmente mais breve), mas sempre cheias de afeto e humor.

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




//   async function sendMessage() {
//     const inputEl = document.getElementById("user-input");
//     const chatBox = document.getElementById("chat-box");
//     const userInput = inputEl.value.trim();
//     if (!userInput) return;

//     chatBox.innerHTML += `<div><strong>Você:</strong> ${userInput}</div>`;
//     addMessage("user", userInput);

//     const prompt = generatePrompt(userInput); // Gera prompt com histórico







    
    
    
//     // URL da API do Gemini
//     const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCnGUijTFE3sS1BQx7wDv7RL8-C7uqS_98';
    
//     // Corpo da requisição
//     const requestBody = {
//         contents: [{
//             parts: [{ text: prompt }]
//         }]
//     };
    
//     // Enviar o valor para a API do Gemini
//     fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody),
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`Erro na API: ${response.statusText}`);
//         }
//             return response.json();
//         })
//         .then(data => {
//             spinner.classList.add('hidden');
//             overlay2.classList.add('hidden');
            
//             // Obter o texto da resposta da API
//             const exerciseText = data.candidates[0].content.parts[0].text;
            
//             // Salvar a resposta no localStorage
//             localStorage.setItem('exerciseAnswer', exerciseText);
            
//             // Redirecionar para a página answer.html
//             window.location.href = 'answer.html';
//         })
//         .catch(error => {
//             // Ocultar o spinner e remover o blur
            
//             overlay2.classList.add('hidden');
//             spinner.classList.add('hidden');
            
//             console.error('Erro ao enviar para a API Gemini:', error);
//         });
//     }
    

    
//         // Aqui entra sua chamada real à API, mas vamos simular:
//         const respostaFicticia = simulateResponse(userInput); // substitua pela resposta real da API depois
    
//         chatBox.innerHTML += `<div><strong>Mamãe:</strong> ${respostaFicticia}</div>`;
//         addMessage("assistant", respostaFicticia);
        
//         inputEl.value = "";
//         chatBox.scrollTop = chatBox.scrollHeight;
//       }
    
//       // Simulação de resposta "inteligente" só pra brincar
//       function simulateResponse(input) {
//         if (input.toLowerCase().includes("ligar")) {
//           return "Mamãe tá atendendo, já já te ligo, viu?";
//         } else if (input.toLowerCase().includes("tá fazendo")) {
//           return "Mamãe tá editando uns vídeos por aqui.";
//         } else if (input.toLowerCase().includes("senha")) {
//           return "Cê tá doooido! Isso aí não posso contar não, vacilão!";
//         } else if (input.toLowerCase().includes("oi")) {
//           return "Oiiiiii, meu amooooor!";
//         } else {
//           return "Eitaaaaa! Que pergunta boa, hein? Mamãe vai pensar aqui.";
//         }
//       }
