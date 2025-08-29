import {
    HomeView
} from './views/HomeView.js';
import {
    NovidadesView
} from './views/NovidadesView.js';
import {
    GameView
} from './views/GameView.js';
import {
    FavoritosView
} from './views/FavoritosView.js';

// util: navegação SPA
function navigateTo(url) {
    history.pushState(null, null, url);
    router();
}

// intercepta <a data-link>
document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-link]');
    if (a) {
        e.preventDefault();
        navigateTo(a.href);
    }
});

// mapeia rotas
const routes = [{
        path: /^\/$/,
        view: HomeView
    },
    {
        path: /^\/novidades\/?$/,
        view: NovidadesView
    },
    {
        path: /^\/favoritos\/?$/,
        view: FavoritosView
    },
    {
        path: /^\/jogo\/([^/]+)\/?$/,
        view: GameView
    }, // :slug
];

async function router() {
    const potential = routes.map(r => ({
        route: r,
        match: location.pathname.match(r.path)
    }));
    const active = potential.find(p => p.match);
    const root = document.getElementById('app');

    if (!active) {
        // fallback para Home
        const View = HomeView;
        root.innerHTML = await View.render();
        await View.mount();
        return;
    }

    const View = active.route.view;
    const params = active.match.slice(1); // ex.: [slug]
    root.innerHTML = await View.render(...params);
    await View.mount(...params);
}

window.addEventListener('popstate', router);
document.addEventListener('DOMContentLoaded', router);