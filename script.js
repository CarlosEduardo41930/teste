function getUserId() {
  let id = localStorage.getItem("userId");

  if (!id) {
    id = "user_" + Math.random().toString(36).substring(2);
    localStorage.setItem("userId", id);
  }

  return id;
}

async function carregarContexto() {
  const res = await fetch("context.md");
  return await res.text();
}

async function enviar() {
  const pergunta = document.getElementById("pergunta").value;
  const chat = document.getElementById("chat");

  const contexto = await carregarContexto();
  const userId = getUserId();

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      pergunta,
      contexto,
      userId
    })
  });

  const data = await res.json();

  chat.innerHTML += `<p><b>Você:</b> ${pergunta}</p>`;
  chat.innerHTML += `<p><b>IA:</b> ${data.resposta}</p>`;
}