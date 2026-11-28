export const appearanceKey = 'wall.appearance.v1';
const themes = ['dark','light','system','contrast'];
const motionOptions = ['system','reduce'];

const labels = {
  tr:{
    form:'Görünüm ve hareket', theme:'Renk düzeni', motion:'Hareket',
    size:'Yazı ve kontrol boyutu', reset:'Boyutu sıfırla',
    themes:['Koyu','Açık','Sistem','Yüksek kontrast'], motions:['Sistem','Hareketi azalt'],
  },
  en:{
    form:'Appearance and motion', theme:'Color theme', motion:'Motion',
    size:'Text and control size', reset:'Reset size',
    themes:['Dark','Light','System','High contrast'], motions:['System','Reduce motion'],
  },
  he:{
    form:'מראה ותנועה', theme:'ערכת צבעים', motion:'תנועה',
    size:'גודל הטקסט והפקדים', reset:'אפסו את הגודל',
    themes:['כהה','בהירה','לפי המערכת','ניגודיות גבוהה'], motions:['לפי המערכת','הפחיתו תנועה'],
  },
  az:{
    form:'Görünüş və hərəkət', theme:'Rəng mövzusu', motion:'Hərəkət',
    size:'Mətn və idarə ölçüsü', reset:'Ölçünü sıfırla',
    themes:['Tünd','Açıq','Sistem','Yüksək kontrast'], motions:['Sistem','Hərəkəti azalt'],
  },
};

export function parseAppearance(raw) {
  try {
    const {theme,motion,size} = JSON.parse(raw);
    if (!themes.includes(theme) || !motionOptions.includes(motion) ||
        !Number.isInteger(size) || size < 80 || size > 200 || size % 5 !== 0) return null;
    return {theme,motion,size};
  } catch {
    return null;
  }
}

export function connectAppearance(panel, read, store) {
  const root = document.documentElement;
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const state = parseAppearance(read(appearanceKey)) ?? {theme:'dark',motion:'system',size:100};
  const [legend, themeLabel, theme, sizeRow, size, reset, motionLabel, motion] = panel.children;
  const [sizeLabel, value] = sizeRow.children;
  let number = new Intl.NumberFormat(undefined,{style:'percent'});

  function applyPalette() {
    const system = systemTheme.matches ? 'dark' : 'light';
    root.dataset.theme = state.theme === 'system' ? system : state.theme;
  }

  function applySize() {
    root.style.setProperty('--wall-text-size',state.size + '%');
    value.textContent = number.format(state.size / 100);
    size.setAttribute('aria-valuetext',value.textContent);
  }

  function save() { store(appearanceKey,JSON.stringify(state)); }

  theme.addEventListener('change',() => {
    state.theme = theme.value;
    applyPalette();
    save();
  });
  motion.addEventListener('change',() => {
    state.motion = motion.value;
    root.toggleAttribute('data-reduced-motion',state.motion === 'reduce');
    save();
  });
  size.addEventListener('input',() => {
    state.size = size.valueAsNumber;
    applySize();
  });
  size.addEventListener('change',save);
  reset.addEventListener('click',() => {
    size.value = '100';
    state.size = 100;
    applySize();
    save();
  });

  systemTheme.addEventListener?.('change',applyPalette);
  root.toggleAttribute('data-reduced-motion',state.motion === 'reduce');
  size.value = String(state.size);
  applyPalette();
  applySize();

  return {
    render(language) {
      const copy = labels[language];
      number = new Intl.NumberFormat(language,{style:'percent'});
      legend.textContent = copy.form;
      themeLabel.textContent = copy.theme;
      motionLabel.textContent = copy.motion;
      sizeLabel.textContent = copy.size;
      reset.textContent = copy.reset;
      theme.replaceChildren(...themes.map((id,index) => new Option(copy.themes[index],id)));
      motion.replaceChildren(...motionOptions.map((id,index) => new Option(copy.motions[index],id)));
      theme.value = state.theme;
      motion.value = state.motion;
      applySize();
    },
    reducedMotion:{
      get matches() { return state.motion === 'reduce' || systemMotion.matches; },
    },
  };
}
