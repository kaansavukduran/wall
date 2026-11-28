const copy = {
  tr: {
    retry:'Kaynakları yeniden incele. Hangisi bu iddiayı destekliyor?',
    draft:'Bunu ilk kez öğrenen birine nasıl açıklarsın? (İsteğe bağlı)',
    storage:'Taslağın bu tarayıcıda saklanır.',
    sources:'Örnekteki kaynaklar',
  },
  en: {
    retry:'Revisit the sources. Which one supports the claim?',
    draft:'How would you explain this to someone new to the subject? (Optional)',
    storage:'Your draft stays in this browser.',
    sources:'Sources for this example',
  },
  he: {
    retry:'עיינו שוב במקורות. איזה מהם תומך בטענה?',
    draft:'איך תסבירו את זה למי שלומד את הנושא בפעם הראשונה? (רשות)',
    storage:'הטיוטה שלכם נשמרת בדפדפן הזה.',
    sources:'מקורות לדוגמה',
  },
  az: {
    retry:'Mənbələrə yenidən bax. Hansı mənbə bu fikri dəstəkləyir?',
    draft:'Bunu mövzunu ilk dəfə öyrənən birinə necə izah edərdin? (Könüllü)',
    storage:'Qaralaman bu brauzerdə saxlanılır.',
    sources:'Bu nümunənin mənbələri',
  },
};

export function mountTransfer(panel, language, lesson, memory) {
  const fragment = document.getElementById('transfer-template').content.cloneNode(true);
  const [scenario, options, feedback, explanation, references] = fragment.children;
  const [model, draftLabel, draft, storage] = explanation.children;
  const [sourcesLabel, links] = references.children;
  const labels = copy[language];
  const key = 'wall.transfer.' + lesson.chapter;
  let solved = memory.read(key + '.solved') === 'true';

  scenario.textContent = lesson.scenario[language];
  model.textContent = lesson.explain[language];
  draftLabel.textContent = labels.draft;
  storage.textContent = labels.storage;
  draft.value = memory.read(key + '.draft') ?? '';
  draft.addEventListener('input', () => memory.store(key + '.draft', draft.value));
  explanation.hidden = !solved;
  if (solved) feedback.textContent = lesson.feedback[language];

  for (let position = 0; position < lesson.choices.length; position++) {
    const choice = (position + lesson.chapter) % lesson.choices.length;
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.transferChoice = String(choice);
    button.textContent = lesson.choices[choice][language];
    button.setAttribute('aria-pressed', String(solved && choice === lesson.correct));
    options.append(button);
    button.addEventListener('click', () => {
      for (const option of options.children) option.setAttribute('aria-pressed', String(option === button));
      if (choice !== lesson.correct) {
        feedback.textContent = labels.retry;
        explanation.hidden = !solved;
        return;
      }
      if (!solved) memory.store(key + '.solved', 'true');
      solved = true;
      feedback.textContent = lesson.feedback[language];
      explanation.hidden = false;
    });
  }

  sourcesLabel.textContent = labels.sources;
  for (const source of lesson.sources) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = source.url;
    link.textContent = source.title;
    link.dir = 'auto';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    item.append(link);
    links.append(item);
  }
  panel.replaceChildren(fragment);
}
