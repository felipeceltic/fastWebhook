import Fastify from "fastify";

const fastify = Fastify({ logger: true });

let requisicoes = [];
let clientesSSE = [];

// POST: recebe novas requisições
fastify.post("/", async (request, reply) => {
    requisicoes.push(request.body);

    // Notifica clientes conectados
    clientesSSE.forEach((res) => res.write(`data: update\n\n`));

    return reply.status(200).send();
});

// GET: lista as requisições
fastify.get("/", async (request, reply) => {
    return reply.status(200).send(requisicoes);
});

// SSE: stream para atualização automática
fastify.get("/stream", async (request, reply) => {
    reply.raw.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
    });

    reply.raw.write(`data: connected\n\n`);
    clientesSSE.push(reply.raw);

    request.raw.on("close", () => {
        clientesSSE = clientesSSE.filter((c) => c !== reply.raw);
    });
});

// DELETE: limpa todas as requisições
fastify.delete("/limpar", async (request, reply) => {
    requisicoes = [];
    clientesSSE.forEach((res) => res.write(`data: update\n\n`));
    return reply.status(200).send({ status: "limpo" });
});

// Página visual
fastify.get("/visualizar", async (request, reply) => {
    const html = `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Visualizador de Requisições</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background: #f4f4f4;
        margin: 0;
        height: 100vh;
        display: flex;
        flex-direction: column;
      }
      header {
        background: #333;
        color: #fff;
        padding: 10px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      header h1 {
        margin: 0;
        font-size: 18px;
      }
      header button {
        background: #d9534f;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 5px;
        cursor: pointer;
      }
      header button:hover { background: #c9302c; }

      main {
        flex: 1;
        display: flex;
        overflow: hidden;
      }

      /* Painel esquerdo */
      #sidebar {
        width: 250px;
        background: #fff;
        border-right: 1px solid #ccc;
        overflow-y: auto;
      }
      #sidebar h2 {
        margin: 10px;
        font-size: 16px;
        color: #333;
      }
      #lista {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .item {
        padding: 10px 15px;
        border-bottom: 1px solid #eee;
        cursor: pointer;
        transition: background 0.2s;
      }
      .item:hover {
        background: #f0f0f0;
      }
      .item.active {
        background: #007bff;
        color: white;
      }

      /* Painel direito */
      #conteudo-area {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
      }
      pre {
        background: #1e1e1e;
        color: #00ff9c;
        padding: 15px;
        border-radius: 8px;
        white-space: pre-wrap;
        word-break: break-word;
        overflow-x: auto;
      }
      #status {
        font-size: 0.9em;
        color: #666;
        margin-bottom: 10px;
      }

      @media (max-width: 700px) {
        #sidebar {
          width: 100px;
        }
        .item {
          font-size: 12px;
          padding: 8px;
        }
      }
    </style>
  </head>
  <body>
    <header>
      <h1>📦 Visualizador de Requisições</h1>
      <div>
        <span id="status">🟢 Aguardando novas requisições...</span>
        <button id="limpar">🗑️ Limpar</button>
      </div>
    </header>

    <main>
      <aside id="sidebar">
        <h2>Requisições</h2>
        <ul id="lista"></ul>
      </aside>
      <section id="conteudo-area">
        <h2>Conteúdo selecionado:</h2>
        <pre id="conteudo">Nenhum item selecionado</pre>
      </section>
    </main>

    <script>
      let selecionado = null;

      async function carregar() {
        const res = await fetch("/");
        const data = await res.json();
        const lista = document.getElementById("lista");
        lista.innerHTML = "";

        data.forEach((_, i) => {
          const li = document.createElement("li");
          li.className = "item" + (i === selecionado ? " active" : "");
          li.textContent = "Requisição " + i;
          li.onclick = () => {
            selecionado = i;
            document.querySelectorAll(".item").forEach(el => el.classList.remove("active"));
            li.classList.add("active");
            document.getElementById("conteudo").textContent = JSON.stringify(data[i], null, 2);
          };
          lista.appendChild(li);
        });

        // Se nada estiver selecionado, limpa o conteúdo
        if (selecionado === null || !data[selecionado]) {
          document.getElementById("conteudo").textContent = "Nenhum item selecionado";
        }
      }

      // Limpar requisições
      document.getElementById("limpar").onclick = async () => {
        if (confirm("Tem certeza que deseja apagar todas as requisições?")) {
          await fetch("/limpar", { method: "DELETE" });
          selecionado = null;
          carregar();
        }
      };

      // Atualiza lista inicial
      carregar();

      // Escuta novas requisições em tempo real
      const eventSource = new EventSource("/stream");
      eventSource.onmessage = (event) => {
        if (event.data === "update") {
          document.getElementById("status").textContent = "🔄 Atualizando...";
          carregar().then(() => {
            document.getElementById("status").textContent = "🟢 Atualizado";
          });
        }
      };
    </script>
  </body>
  </html>
  `;
    reply.type("text/html").send(html);
});

// Status simples
fastify.get("/status", async () => ({ status: "ok" }));

// Inicia o servidor
try {
    await fastify.listen({ port: 3001 });
    console.log("🚀 Servidor rodando em http://localhost:3001");
    console.log("👀 Visualizador: http://localhost:3001/visualizar");
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
