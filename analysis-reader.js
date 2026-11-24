(() => {
  const reader = document.querySelector('[data-guide-reader]');
  if (!reader) return;
  const guides = [...reader.querySelectorAll('article')];
  const picker = document.getElementById('guide-choice');
  const outline = document.getElementById('guide-index');
  const controls = document.getElementById('guide-controls');

  function showGuide() {
    const target = document.getElementById(location.hash.slice(1));
    const current = target?.closest('article') || guides[0];
    for (const guide of guides) guide.hidden = guide !== current;
    picker.value = current.id;
    if (target && current.contains(target)) target.scrollIntoView({block: 'start'});
  }

  picker.addEventListener('change', () => {
    location.hash = picker.value;
    const heading = document.getElementById(picker.value).querySelector('h3');
    showGuide();
    heading.focus({preventScroll: true});
  });
  window.addEventListener('hashchange', showGuide);
  showGuide();
  controls.hidden = false;
  outline.hidden = true;
})();
