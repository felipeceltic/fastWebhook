# ⚡ fastWebhook

![Node.js](https://img.shields.io/badge/Node.js-20.x-brightgreen?logo=node.js)
![Fastify](https://img.shields.io/badge/Fastify-Framework-blue?logo=fastify)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange)

### Serviço leve para visualizar requisições Webhook em tempo real  
Ferramenta simples e prática para testes de integração — ideal para implementações de **webhooks no Zendesk** ou outras plataformas de automação.

---

## 🚀 Funcionalidades
- Visualização instantânea das requisições recebidas (JSON formatado)  
- Atualização **em tempo real** via *Server-Sent Events (SSE)*  
- Interface limpa e responsiva, com lista lateral e conteúdo detalhado  
- Botão para **limpar** as requisições recebidas  
- Endpoint de status para verificação de saúde do serviço

---

## 📸 Exemplo visual

Interface simples e intuitiva para acompanhar requisições em tempo real:

![Demonstração do fastWebhook](assets/demo-fastwebhook.gif)

💡 O painel da esquerda lista as requisições recebidas.  
Ao clicar em uma delas, o conteúdo completo é exibido à direita em formato JSON.

---

## 🛠️ Instalação

```bash
git clone https://github.com/seuusuario/fastWebhook.git
cd fastWebhook
npm install
```

> 💡 O projeto usa apenas o **Fastify** — leve, rápido e sem dependências extras.

---

## ▶️ Execução

```bash
node server.js
```

O servidor será iniciado em:

```
http://localhost:3001
```
---
## 🌍 Integração com o Zendesk (usando ngrok)

Para receber requisições do Zendesk ou qualquer outro serviço externo, é necessário expor o servidor local com uma URL pública.

-Instale o ngrok (caso ainda não tenha):
👉 https://ngrok.com/download

No terminal, execute o comando abaixo para expor sua porta local (3001):
```bash
ngrok http 3001
```

Copie a URL gerada (exemplo: https://a1b2c3d4.ngrok.io) e utilize-a ao configurar seu webhook no Zendesk:

Endpoint do webhook:
```bash
https://a1b2c3d4.ngrok.io/
```

As requisições enviadas pelo Zendesk aparecerão automaticamente no painel visual:
👉 http://localhost:3001/visualizar

⚠️ Importante: a URL do ngrok muda a cada reinicialização, a menos que você tenha uma conta com domínio fixo.
---

## 🌐 Endpoints

| Método | Caminho | Descrição |
|:-------|:--------|:-----------|
| **POST** | `/` | Recebe e armazena o corpo da requisição (ex: payload do webhook) |
| **GET** | `/` | Retorna todas as requisições armazenadas em formato JSON |
| **GET** | `/visualizar` | Interface visual para explorar as requisições |
| **DELETE** | `/limpar` | Remove todas as requisições da memória |
| **GET** | `/status` | Retorna `{ status: "ok" }` para monitoramento |
| **GET** | `/stream` | Endpoint interno usado pela página para atualização em tempo real |

---

## 💻 Exemplo de uso (via cURL)

Envie uma requisição POST com JSON:

```bash
curl -X POST http://localhost:3001/      -H "Content-Type: application/json"      -d '{"mensagem": "teste webhook"}'
```

Depois acesse:

**[http://localhost:3001/visualizar](http://localhost:3001/visualizar)**

E veja o item aparecer **automaticamente** na lista lateral.

---

## 🧩 Caso de uso com Zendesk

Ideal para testar:
- Webhooks configurados em **Triggers** e **Automations** do Zendesk  
- Eventos de **SunCo / Sunshine Conversations**  
- Integrações com **Botpress**, **Power Automate** ou outros serviços que disparam POSTs JSON

---

## ⚙️ Tecnologias

- **Node.js** (ES Modules)  
- **Fastify**  
- **HTML / CSS Vanilla**  
- **Server-Sent Events (SSE)** para atualização em tempo real

---

## 🧹 Limitações

- Os dados são armazenados **em memória** e se perdem ao reiniciar o servidor  
- Projeto voltado para testes locais e de desenvolvimento

---

## 📄 Licença

Distribuído sob a licença **MIT**  
Sinta-se à vontade para modificar e adaptar conforme suas necessidades.

---

✉️ Desenvolvido por **Luiz Felipe** — Consultor Zendesk & Engenheiro de Soluções CX  
💼 [LinkedIn](https://www.linkedin.com/in/luizfelipew/)