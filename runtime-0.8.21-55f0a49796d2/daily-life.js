import { dailyCards } from './daily-lessons.js';
import { objectSprite } from './object-sprite.js';

const sheet = new URL('./assets/daily-props.png', import.meta.url);
export const dailyCases = [
  {
    id:'support',
    answer:'tzedakah',
    alternatives:['kashrut','synagogue-beit-midrash'],
    question:['Maimonides, bir kişinin geçimini sağlayabilmesi için iş bulmasına yardım etmeyi hangi bağlamda tartışır?',
      'In what context does Maimonides discuss helping a person find work to support themselves?',
      'באיזה הקשר הרמב״ם דן בעזרה לאדם למצוא עבודה כדי שיוכל להתפרנס?',
      'Maymonid bir insana dolanışıq üçün iş tapmaqda köməyi hansı mövzuda müzakirə edir?'],
    feedback:['Yoksullara Yardım 10:7, geçim olanağı sağlayan desteği tzedakah örneği olarak ele alır.',
      'Gifts to the Poor 10:7 includes helping someone gain a livelihood as an example of tzedakah.',
      'הלכות מתנות עניים י׳:ז׳ כוללות סיוע בהשגת פרנסה כדוגמה לצדקה.',
      'Yoxsullara Yardım 10:7 dolanışıq imkanı yaratmağı tzedakah nümunəsi kimi göstərir.'],
  },
  {
    id:'writing',
    answer:'halakhah-minhag-responsa',
    alternatives:['ketubah-marriage','synagogue-beit-midrash'],
    question:['Bir haham, kendisine gönderilen yeni bir hukuk sorusuna yazılı yanıt veriyor. Bu yanıtın yer aldığı metin türünü hangi kart açıklar?',
      'A rabbi writes an answer to a new legal question sent to them. Which card explains this kind of text?',
      'רב עונה בכתב על שאלה הלכתית חדשה שהופנתה אליו. איזה כרטיס מסביר את סוג הטקסט הזה?',
      'Ravvin ona göndərilən yeni hüquqi suala yazılı cavab verir. Bu mətn növünü hansı kart izah edir?'],
    feedback:['Responsa, soruya verilen yazılı cevaptır. Halaha hukuk geleneğini, minhag ise yerleşmiş uygulamayı anlatır.',
      'A responsum is a written answer to a question. Halakhah names the legal tradition and minhag an established custom.',
      'תשובה היא מענה בכתב לשאלה. הלכה מציינת את מסורת הדין ומנהג נוהג שהשתרש.',
      'Responsum suala yazılı cavabdır. Halaxa hüquq ənənəsini, minhag isə kök salmış adəti bildirir.'],
  },
  {
    id:'document',
    answer:'ketubah-marriage',
    alternatives:['birth-naming-covenant','bar-bat-mitzvah'],
    question:['Bir müze, geleneksel bir Yahudi evliliğindeki mali yükümlülükleri yazılı bir nesneyle açıklıyor. Hangi kartı seçersin?',
      'A museum uses a written object to explain financial obligations in traditional Jewish marriage. Which card fits?',
      'מוזיאון מציג מסמך המסביר התחייבויות כלכליות בנישואים יהודיים מסורתיים. איזה כרטיס מתאים?',
      'Muzey ənənəvi yəhudi nikahındakı maddi öhdəlikləri yazılı sənədlə izah edir. Hansı kart uyğundur?'],
    feedback:['Ketuba bir evlilik belgesidir. Mişna Ketubot, dönemin evlilik hukukunu tartışmak için okunabilir.',
      'A ketubah is a marriage document. Mishnah Ketubot provides context on rabbinic marriage law.',
      'כתובה היא מסמך נישואים. משנה כתובות מספקת הקשר לדיני הנישואים של חכמים.',
      'Ketuba nikah sənədidir. Mişna Ketubot ravvin nikah hüququnun kontekstini izah edir.'],
  },
];

const copy = {
  tr:{topic:'Konu', groups:['Ev ve cemaat','Yaşam dönemeçleri'], sources:'Kaynaklar',
    exercise:'Bir gündelik durumu incele', item:'Durum', number:n=>'Durum '+n,
    retry:'Bu durum için kartlardaki açıklamaları karşılaştır.'},
  en:{topic:'Topic', groups:['Home and community','Life events'], sources:'Sources',
    exercise:'Explore an everyday situation', item:'Situation', number:n=>'Situation '+n,
    retry:'Compare the explanations in the cards for this situation.'},
  he:{topic:'נושא', groups:['בית וקהילה','תחנות בחיים'], sources:'מקורות',
    exercise:'בדקו מצב מחיי היום־יום', item:'מצב', number:n=>'מצב '+n,
    retry:'השוו את ההסברים בכרטיסים כדי למצוא את התשובה.'},
  az:{topic:'Mövzu', groups:['Ev və icma','Həyat mərhələləri'], sources:'Mənbələr',
    exercise:'Gündəlik vəziyyəti araşdır', item:'Vəziyyət', number:n=>'Vəziyyət '+n,
    retry:'Bu vəziyyət üçün kartlardakı izahları müqayisə et.'},
};

export function mountDailyLife(panel, language, locale) {
  const fragment = document.getElementById('daily-template').content.cloneNode(true);
  const labels = copy[language];
  const select = fragment.querySelector('#daily-topic');
  const [heading, object, variation, sourcePanel] = fragment.querySelector('.visit-reading').children;
  const [canvas, meaning] = object.children;
  const [sourceLabel, sources] = sourcePanel.children;
  const [summary, exampleLabel, example, question, options, feedback] = fragment.querySelector('.daily-exercise').children;
  const showObject = objectSprite(canvas, sheet, 4);
  const cards = new Map(dailyCards.map(card=>[card.id,card]));
  const number = new Intl.NumberFormat(language);

  function showCard() {
    const card = cards.get(select.value);
    heading.textContent = card.topic[language];
    meaning.textContent = card.meaning[language];
    variation.textContent = card.variation[language];
    sources.replaceChildren(...[card.source,card.relatedSource].filter(Boolean).map(source => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.textContent = source.title;
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.dir = 'auto';
      item.append(link);
      return item;
    }));
    showObject(select.selectedIndex);
  }

  function showCase() {
    const sample = dailyCases[example.selectedIndex];
    const choices = [...sample.alternatives,sample.answer];
    const offset = example.selectedIndex % choices.length;
    question.textContent = sample.question[locale];
    feedback.textContent = '';
    options.replaceChildren(...choices.map((_,index) => {
      const id = choices[(index + offset) % choices.length];
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = cards.get(id).topic[language];
      button.dataset.dailyChoice = id;
      button.setAttribute('aria-pressed','false');
      button.addEventListener('click', () => {
        for (const sibling of options.children) sibling.setAttribute('aria-pressed',String(sibling === button));
        feedback.textContent = id === sample.answer ? sample.feedback[locale] : labels.retry;
      });
      return button;
    }));
  }

  fragment.querySelector('[for="daily-topic"]').textContent = labels.topic;
  exampleLabel.textContent = labels.item;
  sourceLabel.textContent = labels.sources;
  summary.textContent = labels.exercise;
  select.replaceChildren(...labels.groups.map((label,index) => {
    const group = document.createElement('optgroup');
    group.label = label;
    group.append(...dailyCards.slice(index*4,index*4+4).map(card => new Option(card.topic[language],card.id)));
    return group;
  }));
  example.replaceChildren(...dailyCases.map((sample,index) => new Option(labels.number(number.format(index+1)),sample.id)));
  select.addEventListener('change',showCard);
  example.addEventListener('change',showCase);
  showCard();
  showCase();
  panel.replaceChildren(fragment);
}
