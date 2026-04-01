let memoria = {}; // memória em runtime (simples)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { pergunta, contexto, userId } = req.body;

  if (!memoria[userId]) {
    memoria[userId] = [];
  }

  // salvar pergunta
  memoria[userId].push({ role: "user", content: pergunta });

  // limitar histórico
  memoria[userId] = memoria[userId].slice(-6);

  const messages = [
    {
      role: "system",
      content: "Você é um professor. Nunca dê respostas diretas. Ajude o aluno a pensar."
    },
    {
      role: "system",
      content: `Use apenas este conteúdo:\n${contexto.substring(0, 3000)}`
    },
    ...memoria[userId]
  ];

  const response = await fetch("https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GOOGLE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages
    })
  });

  const data = await response.json();

  const resposta = data.choices[0].message.content;

  // salvar resposta
  memoria[userId].push({ role: "assistant", content: resposta });

  res.status(200).json({ resposta });
}