# 🎮 Iara Games

**Iara Games** é uma plataforma independente dedicada a divulgar e valorizar **jogos brasileiros**.  
O projeto funciona como uma vitrine digital, com catálogo pesquisável, favoritos persistentes e detalhes ricos de cada título.

🌐 Deploys:  
- [GitHub Pages](https://naiaraaparecida.github.io/iara-games/)  
- [Netlify](https://iara-games.netlify.app/)  

---

## ✨ Funcionalidades

- 📚 **Catálogo de jogos** com busca, filtros por gênero/faixa de preço e ordenação.
- ❤️ **Favoritos persistentes** com LocalStorage.
- 🔥 **Ranking de popularidade** (ordenado pelos mais favoritados).
- 🎬 **Página de detalhes** com descrição, trailer do YouTube e link de compra/site oficial.
- 🌙 **Tema claro/escuro** com preferência salva.
- 📱 **Layout responsivo** com sidebar de navegação no mobile.
- 📝 **Formulário público** para envio de novos jogos (com aprovação manual).
- 🕹️ **404 personalizado** no estilo gamer.

---

## 🛠️ Tecnologias

- **HTML5, CSS3, JavaScript (ES6+)**
- **Vanilla JS** para rotas, estados e favoritos
- **LocalStorage** para persistência no navegador
- **Netlify / GitHub Pages** para deploy
- **Formspree** para envio de formulários

---

## 📂 Estrutura do projeto
```plaintext
/
├── index.html
├── novidades.html
├── favoritos.html
├── sobre.html
├── enviar-jogo.html
├── 404.html
├── assets/
├── css/main.css
├── js/
│   ├── loader.js
│   ├── ui.js
│   ├── favorites.js
│   ├── theme.js
│   ├── nav.js
│   ├── page-*.js
└── games.json


---

## 🚀 Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/NaiaraAparecida/iara-games.git

# Entre na pasta
cd iara-games

# Abra o index.html no navegador
