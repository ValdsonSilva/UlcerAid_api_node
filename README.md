# 🧠 UlcerAId Api Node

API REST desenvolvida com Node.js para gerenciamento de usuários e realização de predições sobre feridas em pés diabéticos, utilizando um modelo de classificação binária treinado com IA.

Esta API é parte de um sistema maior de apoio ao diagnóstico, focado em melhorar o acompanhamento e triagem de úlceras diabéticas a partir de imagens.

---

## 📌 Funcionalidades

- ✅ CRUD de usuários
- ✅ Autenticação e controle de acesso
- ✅ Rota exclusiva para predição de imagens (IA integrada)
- ✅ Arquitetura MVC organizada e escalável

---

## 🚀 Tecnologias Utilizadas

- Node.js
- Express
- Prisma ORM
- MongoDB
- Python (execução do modelo de IA)
- IA com modelo de classificação binária (pré-treinado)

---

## ⚙️ Como Rodar Localmente

1. Clone o repositório:

```bash
git clone https://github.com/ValdsonSilva/UlcerAId-Api-Node.git
```
2. Instale as dependências:
- npm install

3. Inicie a aplicação:
- node app.js

📸 Predição com Imagens
A predição é feita via uma rota específica da API, que recebe uma imagem e executa o script Python já 
integrado ao projeto. O modelo retorna se há ou não a presença de úlceras em pés diabéticos.

Exemplo de endpoint:
POST /api/v1/predict
Content-Type: multipart/form-data
Body: imagem (.jpg, .png)
