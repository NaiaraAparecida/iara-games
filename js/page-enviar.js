const FORM_ENDPOINT = "https://formspree.io/f/xkgvqkgjT";

const FALLBACK_EMAIL = "naiaraaparecida95@gmail.com";

const form = document.getElementById('submit-form');
const previewBtn = document.getElementById('previewBtn');
const sendBtn = document.getElementById('sendBtn');
const feedback = document.getElementById('feedback');
const previewWrap = document.getElementById('preview');
const previewGrid = document.getElementById('previewGrid');

// util: transforma FormData -> objeto e normaliza campos
function toJSON(fd){
  const obj = Object.fromEntries(fd.entries());
  // honeypot (se preenchido, tratamos como spam e abortamos silenciosamente)
  if (obj._gotcha && String(obj._gotcha).trim().length > 0) {
    throw new Error('spam-detected');
  }
  obj.genero = (obj.genero || '').split(',').map(s=>s.trim()).filter(Boolean);
  obj.screenshots = (obj.shots || '').split('\n').map(s=>s.trim()).filter(Boolean);
  delete obj.shots;
  delete obj._gotcha;
  return obj;
}

function priceBRL(v){
  const n = Number(v);
  return isFinite(n) ? n.toLocaleString('pt-BR', { style:'currency', currency:'BRL' }) : '';
}

function cardHTML(g){
  const IN_PAGES = location.pathname.includes('/pages/');
  const IMG_PREFIX = IN_PAGES ? '../' : '';
  return `
  <article class="card" tabindex="0">
    <img src="${IMG_PREFIX}${g.img}" alt="Capa do jogo ${g.nome}" loading="lazy" />
    <div class="body">
      <h3>${g.nome}</h3>
      <div class="meta">
        <span class="badge">${g.studio || 'Estúdio'}</span>
        ${(g.genero || []).map(x=>`<span class="badge">${x}</span>`).join('')}
        <span class="badge">${g.ano || ''}</span>
      </div>
      <div class="actions">
        <span class="price">${priceBRL(g.preco)}</span>
        <a class="btn" href="${g.link || '#'}" target="_blank" rel="noopener">Link</a>
      </div>
    </div>
  </article>`;
}

// ---------- PRÉ-VISUALIZAÇÃO ----------
previewBtn?.addEventListener('click', ()=>{
  feedback.textContent = "";
  try {
    const fd = new FormData(form);
    const data = toJSON(fd);

    if(!data.nome || !data.studio || !data.ano || !data.genero.length || !data.link || !data.img){
      feedback.textContent = "Preencha os campos obrigatórios para pré-visualizar.";
      return;
    }
    previewGrid.innerHTML = cardHTML(data);
    previewWrap.hidden = false;
    feedback.textContent = "Prévia gerada. Se estiver tudo certo, clique em Enviar.";
  } catch (err) {
    if (String(err.message) === 'spam-detected') {
      feedback.textContent = "Não foi possível processar (honeypot).";
      return;
    }
    console.error(err);
    feedback.textContent = "Erro ao gerar prévia. Tente novamente.";
  }
});

// ---------- ENVIO ----------
form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  feedback.textContent = "";
  sendBtn.disabled = true;

  let data;
  try {
    const fd = new FormData(form);
    data = toJSON(fd);
  } catch (err) {
    sendBtn.disabled = false;
    if (String(err.message) === 'spam-detected') return; // ignora bots silenciosamente
    feedback.textContent = "Não foi possível enviar. Tente novamente.";
    return;
  }

  // valida obrigatórios
  const required = ['nome','studio','ano','genero','link','img','contato'];
  for(const k of required){
    if(!data[k] || (Array.isArray(data[k]) && !data[k].length)){
      feedback.textContent = "Preencha todos os campos obrigatórios (*).";
      sendBtn.disabled = false;
      return;
    }
  }

  // monta json "compacto" para facilitar sua curadoria
  const compact = {
    slug: String(data.nome || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'') // remove acentos
      .replace(/[^a-z0-9\s-]/g, '')
      .trim().replace(/\s+/g,'-'),
    nome: data.nome,
    preco: Number(data.preco || 0),
    genero: data.genero,
    studio: data.studio,
    ano: Number(data.ano) || new Date().getFullYear(),
    img: data.img,
    link: data.link,
    descricao: data.descricao || "",
    trailer: data.trailer || "",
    screenshots: data.screenshots || [],
    featured: false
  };

  // payload que vai para o Formspree
  const payload = {
    projeto: 'Iara Games — Sugestão de jogo',
    ...data,
    screenshots: (data.screenshots || []).join('\n'),
    json: JSON.stringify(compact, null, 2) // útil no e-mail
  };

  // 1) tenta via Formspree
  if (FORM_ENDPOINT && FORM_ENDPOINT.includes('/f/')) {
    try{
      const r = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(payload)
      });
      if (!r.ok) throw new Error(String(r.status));

      // sucesso → mostra pop-up e redireciona
      afterSuccess();
      return;
    } catch(err){
      console.warn('[Iara][Formspree] falhou, usando fallback mailto:', err);
      // continua para fallback
    }
  }

  // 2) fallback: abrir e-mail do usuário já com dados
  try {
    const mailto = makeMailto(payload);
    window.location.href = mailto;
    afterSuccess(true); // mostra pop-up mesmo no fallback
  } catch (err) {
    console.error(err);
    feedback.textContent = "Não foi possível abrir o cliente de e-mail.";
  } finally {
    sendBtn.disabled = false;
  }
});

// ---------- helpers ----------
function makeMailto(data){
  const assunto = encodeURIComponent("Iara Games — Sugestão de jogo");
  const corpo = encodeURIComponent(
`Nome: ${data.nome}
Estúdio: ${data.studio}
Ano: ${data.ano}
Gêneros: ${(data.genero||[]).join(', ')}
Preço: ${data.preco || ''}
Link: ${data.link}
Capa: ${data.img}
Trailer: ${data.trailer || ''}

Descrição:
${data.descricao || ''}

Screenshots:
${(data.screenshots||'').toString()}

JSON:
${data.json || ''}

Contato do remetente: ${data.contato}
`
  );
  return `mailto:${FALLBACK_EMAIL}?subject=${assunto}&body=${corpo}`;
}

function afterSuccess(fromFallback = false){
  // limpa UI
  form.reset();
  previewWrap.hidden = true;
  feedback.textContent = fromFallback
    ? "Abrindo seu e-mail…"
    : "Enviado! Sua sugestão foi registrada e aguarda curadoria.";

  // pop-up
  const popup = document.getElementById('popup');
  if (popup) {
    popup.hidden = false;
    const close = document.getElementById('popupClose');
    if (close) {
      close.onclick = () => {
        popup.hidden = true;
        window.location.href = "../index.html";
      };
    }
    // auto-redirect em 5s
    setTimeout(() => {
      if (!popup.hidden) {
        popup.hidden = true;
        window.location.href = "../index.html";
      }
    }, 5000);
  }
  sendBtn.disabled = false;
}
