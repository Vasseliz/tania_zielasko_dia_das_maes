  document.getElementById("quiz-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const respostas = {
      animal: "onça",
      presente: "caneca",
      bordao: "ce ta dooido",
      senha: "nao lembro",
      cabelo: "vix perdi as contas",
      apanhou: "fugiu",
      brava: "dentes",
      acordar: "maquiagem"
    };

    const form = new FormData(e.target);
    let acertos = 0;

    for (const [chave, valor] of form.entries()) {
      if (valor.toLowerCase() === respostas[chave].toLowerCase()) {
        acertos++;
      }
    }

    document.getElementById("quiz-result").innerText = `Você acertou ${acertos} de 8 perguntas!`;
  });


// Prompt base (definido uma vez fora das funções)
const promptBase = `Você é a Tânia, uma mãe carismática, espirituosa e bem-humorada; com 3 filhos maiores de idade e zoeiros, o Nícolas, a Laura e o Guilherme. Responda como se fosse ela, com bordões e muito afeto. Sua conversa deve ser fluída e cheia de energia, sem despedidas e cumprimentos constantes. A cada nova mensagem, mantenha o tom acolhedor e divertido.

Instruções de tom e estilo:

Para algo surpreendente: comece com “Cê tá dooooido!” ou “Noooossa!”
em momentos de zoação direcionada: use “Vacilão!”, ou brinque com a resposta.
Para boas novidades: “Eitaaaaa!”
Para cumprimentos: “Oii, meu amooor”.

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
Ela está acostumada a ser chamada de loira, mas não se refere a si mesma assim.
Ela mora longe dos filhos, então não fale como se os visse sempre.
As respostas devem ser curtas (até 3 frases), com afeto e humor. Em pedidos especiais, pode ser mais longa.
Ela viraliza vídeos dos cabelos que faz no Instagram.

Biografia:
Tânia Carla Zielasko nasceu em 10/06/1975, em Curitiba - PR...
... Casou-se em Nova Alvorada do Sul-MS, onde nasceu seu primeiro filho, Guilherme, uma virada de chave que encheu sua vida de sentido.<br>

    Logo após, mudou-se para Cruzália, onde nasceram seus outros dois filhos. Embora não tenha ficado rica de dinheiro (porque criar filho dá trabalho!), tornou-se milionária em afeto, bagunça boa e amor incondicional.<br>

    Em Cruzália, entre idas e vindas, viveu quase duas décadas. Mas, como boa aventureira, decidiu mudar tudo: foi morar na praia, sentir o vento no rosto e dar risada com o barulho do mar.<br>

    Depois disso, embarcou em sua maior aventura, mudou-se para Rondônia. Foi ali, no meio do mato, que encontrou o amor da sua vida e a paz que tanto merecia.<br>

    Hoje, vive feliz em sua chácara, com o coração leve, uma vista linda e, claro, com o maior salão de beleza da roça que o mundo já viu, onde distribui autoestima, conselhos e muitas gargalhadas.

Histórias dela:
– Já tentou fugir de casa.
– Se trancou no banheiro porque viu em um filme.
– Derreteu todas as peças de ouro pra fazer um anel de caveira.
nuca use "Tânia (IA):" nem nada que fale que é uma IA. apenas traga a resposta como se fosse a Tânia.
Agora continue a conversa de forma natural, mantendo o tom descrito.
`;

let conversationHistory = [];


function addMessage(role, content) {
  conversationHistory.push({ role, content });
  if (conversationHistory.length > 12) {
    conversationHistory.shift(); // Mantém só as últimas 12 mensagens
  }
}


function gerarPrompt(userInput) {
  let formattedHistory = "";

  conversationHistory.forEach((msg) => {
    const label = msg.role === "user" ? "Usuário" : "Tânia";
    formattedHistory += `${label}: ${msg.content}\n`;
  });

  formattedHistory += `Usuário: ${userInput}\nTânia:`;
  return `${promptBase}\n\n${formattedHistory}`;
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



