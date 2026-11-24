(() => {
  const root = document.querySelector('.guide-browser');
  if (!root) return;
  const find = id => document.getElementById(id);
  const papers = [...root.querySelectorAll('.guide-paper')];
  const links = [...root.querySelectorAll('.model-button')];
  const search = find('searchInput');
  const browse = find('browseModels');
  const clear = find('clearFilters');
  function setOpen(open) {
    browse.setAttribute('aria-expanded', String(open));
    browse.textContent = open ? 'Hide guide list' : 'Browse guides';
  }
  function select() {
    const target = find(location.hash.slice(1));
    const paper = target?.closest('.guide-paper') || papers[0];
    for (const item of papers) item.hidden = item !== paper;
    for (const link of links) {
      const active = link.hash === '#' + paper.id;
      link.classList.toggle('active',active);
      if (active) link.setAttribute('aria-current','true'); else link.removeAttribute('aria-current');
    }
    const sections = [...paper.querySelectorAll('.section-card')];
    const section = target?.closest('.section-card') || sections[0];
    for (const item of sections) item.hidden = item !== section;
    for (const tab of paper.querySelectorAll('.tab-button')) {
      const active = tab.hash === '#' + section.id;
      tab.classList.toggle('active',active);
      if (active) tab.setAttribute('aria-current','true'); else tab.removeAttribute('aria-current');
    }
    paper.querySelector('select').value = section.id;
    if (target) {
      const heading = (target === paper ? paper.querySelector('h2') : section.querySelector('h3'));
      heading.focus({preventScroll:true});
      if (heading.getBoundingClientRect().top < 0 || heading.getBoundingClientRect().top > innerHeight) heading.scrollIntoView({block:'start'});
    }
  }
  function filter() {
    const terms = search.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    let count = 0;
    for (const link of links) {
      const text = link.textContent.toLocaleLowerCase();
      link.hidden = !terms.every(term => text.includes(term));
      if (!link.hidden) count++;
    }
    find('modelCount').textContent = count + (count === 1 ? ' guide' : ' guides');
    find('empty').hidden = count !== 0;
    clear.disabled = terms.length === 0;
  }
  root.classList.add('enhanced');
  root.querySelectorAll('[data-js]').forEach(el => el.hidden=false);
  for (const paper of papers) paper.querySelector('select').addEventListener('change',event => location.hash = event.target.value);
  links.forEach(link=>link.addEventListener('click',()=>setOpen(false)));
  clear.addEventListener('click',()=>{search.value='';filter();search.focus()});
  search.addEventListener('input',filter);
  browse.addEventListener('click',()=>setOpen(browse.getAttribute('aria-expanded')!=='true'));
  window.addEventListener('hashchange',select);
  filter(); select();
})();
