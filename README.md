# 🧩 Maze Adventure Game

Maze Adventure Game é um jogo de labirinto com um personagem virtual controlado por inteligência artificial, desenvolvido em **React** com renderização em **p5.js**. Oferece múltiplos níveis temáticos, modos de jogo, música ambiente, placar online e sistema de progresso persistente.

---

## 🎮 Visão Geral

Este projeto inclui:

- Labirintos dinâmicos com temas variados:
  - 🌲 **Enchanted Forest**
  - 💎 **Crystal Cave**
  - 🌋 **Volcano Bowels**
  - ❄️ **Perma Frost**
- Animações fluídas do personagem com **p5.js**
- Personagem com movimentação autônoma baseada em IA
- 🔓 **Modo Infinito** desbloqueável com níveis aleatórios
- 🏆 **Ranking online** via API
- 🎵 Música ambiente e efeitos sonoros imersivos
- 🖥️ Telas completas: menu, vitória, derrota e placar
- 💾 Progresso salvo com `localStorage`
- 🕹️ Estilo visual retrô com CSS customizado e imagens temáticas

---

## 🕹️ Como Jogar

O jogador **não controla diretamente** o personagem.

O personagem é um agente virtual que:

- Explora automaticamente o labirinto usando backtracking  
- Reage à presença de inimigos com estados de alerta e pânico  
- Pode ser pausado ou ter sua velocidade ajustada  
- Utiliza poderes especiais para eliminar inimigos automaticamente  

---

## 🤖 Movimentação do Personagem

### 🔁 Backtracking

- Explora todas as rotas do labirinto  
- Garante que todos os caminhos sejam visitados até encontrar a saída  

### 🔺 Estado de Alerta

- Ativado durante a exploração normal ao detectar um inimigo à frente  
- Salva o caminho atual e entra em modo de retorno seguro  
- Finaliza ao encontrar uma nova rota livre de ameaça ou quando o movimento não for mais possível  

### 🔻 Estado de Pânico

- Ativado durante o backtracking, se o inimigo for detectado novamente  
- Marca células visitadas (`superVisited`) e evita passos repetidos  
- Objetivo: fugir rapidamente e com segurança  
- Termina após **40 passos em pânico** ou se o personagem ficar **encurralado**  

### ⚔️ Combate Automático

- O personagem pode eliminar inimigos próximos automaticamente usando seu poder especial  
- O jogador não intervém diretamente no combate  

---

## 👾 Tipos de Inimigos

### 🐌 Inimigo 1

- Movimento lento  
- Usa backtracking simples  
- Não detecta o personagem  

### 👁️ Inimigo 2

- Detecta o personagem em células adjacentes e linha de visão  
- Entra em modo de perseguição com aumento de velocidade  

### 🌀 Inimigo 3

- Pode "pular" paredes e obstáculos  
- Usa teletransporte com tempo de recarga (cooldown)  

---

## 🎯 Modos de Jogo

### 📘 Modo Normal

- Níveis temáticos com dificuldade crescente  

### ♾️ Modo Infinito

- Desbloqueável após vencer os níveis principais  
- Gera labirintos aleatórios infinitos com progresso salvo  

---

## 🧭 Interface e Controles

- Menu inicial com:
  - Início do jogo
  - Alternância de modo infinito
  - Acesso ao placar
  - Ativação do modo desenvolvedor

- Controles:
  - Pausar/resumir movimento do personagem
  - Ajustar velocidade da movimentação

- Telas com transições suaves:
  - Vitória
  - Derrota
  - Ranking

---

## 📈 Progresso e Ranking

- Progresso salvo via `localStorage`:
  - Níveis desbloqueados
  - Modo infinito ativo

- Placar online:
  - Integrado com API REST
  - Ranking separado para modos **Normal** e **Infinito**
  - Toda a pontuação permanece salva no banco de dados MongoDB

---

## 🎵 Música e Efeitos Sonoros

- Música ambiente muda conforme:
  - Tema do nível
  - Estado do jogo (menu, vitória, derrota, etc)

- Efeitos sonoros:
  - Coleta de itens

---

## 🧠 Tecnologias e Funcionalidades

### Frontend
- ⚛️ **React** – Interface e gerenciamento de estado  
- 🎨 **p5.js** – Renderização do labirinto e animações do personagem  
- 💅 **CSS Customizado** – Visual retrô e estilo pixel art  
- 💾 **localStorage** – Armazenamento de progresso local  

### Backend (Node.js + MongoDB + Prisma)
- 🔐 **Autenticação JWT** – Middleware de autenticação com tokens JWT para proteger rotas  
- 🛡️ **dotenv** – Gerenciamento seguro de variáveis de ambiente  
- 🗃️ **MongoDB** – Banco de dados NoSQL para persistência de dados dos usuários, jogadores e níveis  
- 📦 **Prisma Client** – ORM com suporte ao MongoDB para manipulação segura e tipada dos dados  
- 🌐 **API RESTful** – Estrutura modular com rotas, middlewares e controle de acesso  
- 📁 **Organização de pastas** – Separação de responsabilidades em `middlewares/`, `routes/`, `prisma/`, entre outras  

> ⚠️ A API backend é externa e não está incluída diretamente neste repositório, mas está integrada ao frontend para funcionalidades como login, placar online e gerenciamento de níveis.

> 🌐 **A API pode ser acessada em:** [https://github.com/ianmenezesss/MazeApi](https://github.com/ianmenezesss/MazeApi)
