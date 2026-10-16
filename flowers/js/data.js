// Данные каталога. В реальном проекте их можно получать из Google Таблицы или CRM.
// category: mono — монобукеты, author — авторские, box — композиции в коробке
const CATEGORY_NAMES = {
  mono: 'Монобукет',
  author: 'Авторский',
  box: 'В коробке'
};

const PRODUCTS = [
  {
    id: 1,
    title: 'Красные розы «Классика»',
    category: 'mono',
    price: 4900,
    badge: 'Хит',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=700&q=70',
    description: '25 красных роз сорта Freedom (Эквадор) высотой 60 см. Классика, которая всегда к месту.',
    composition: ['Роза Freedom — 25 шт.', 'Крафтовая упаковка', 'Лента атласная'],
    size: '45 × 60 см'
  },
  {
    id: 2,
    title: 'Пионовидные розы',
    category: 'mono',
    price: 6200,
    badge: '',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=700&q=70',
    description: '15 нежно-розовых пионовидных роз Bombastic. Пышные бутоны и тонкий аромат.',
    composition: ['Кустовая роза Bombastic — 15 шт.', 'Упаковка из фетра'],
    size: '35 × 40 см'
  },
  {
    id: 3,
    title: 'Тюльпаны «Весна»',
    category: 'mono',
    price: 3200,
    badge: 'Сезон',
    image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=700&q=70',
    description: '35 разноцветных тюльпанов из Голландии. Лучший способ поздравить с началом весны.',
    composition: ['Тюльпан — 35 шт.', 'Бумажная упаковка'],
    size: '40 × 45 см'
  },
  {
    id: 4,
    title: 'Букет «Прованс»',
    category: 'author',
    price: 5600,
    badge: 'Новинка',
    image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=700&q=70',
    description: 'Воздушный букет в пастельных тонах: розы, эустома и лаванда. Собран флористом вручную.',
    composition: ['Роза кустовая — 5 шт.', 'Эустома — 3 шт.', 'Лаванда', 'Эвкалипт'],
    size: '40 × 50 см'
  },
  {
    id: 5,
    title: 'Букет «Летний сад»',
    category: 'author',
    price: 4300,
    badge: '',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=700&q=70',
    description: 'Яркое сочетание полевых и садовых цветов. Поднимает настроение с первого взгляда.',
    composition: ['Хризантема — 3 шт.', 'Альстромерия — 3 шт.', 'Ромашка', 'Зелень'],
    size: '35 × 45 см'
  },
  {
    id: 6,
    title: 'Букет невесты «Белое облако»',
    category: 'author',
    price: 7800,
    badge: '',
    image: 'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?auto=format&fit=crop&w=700&q=70',
    description: 'Белые пионовидные розы, гортензия и эвкалипт. Собираем за 1 день до церемонии.',
    composition: ['Роза пионовидная — 7 шт.', 'Гортензия — 1 шт.', 'Эвкалипт', 'Шёлковая лента'],
    size: '25 × 30 см'
  },
  {
    id: 7,
    title: 'Шляпная коробка «Нежность»',
    category: 'box',
    price: 5200,
    badge: 'Хит',
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=700&q=70',
    description: 'Розы и диантусы во флористической губке. Не нужна ваза, стоит до 10 дней.',
    composition: ['Роза — 11 шт.', 'Диантус — 4 шт.', 'Шляпная коробка Ø 20 см'],
    size: 'Ø 20 см, высота 25 см'
  },
  {
    id: 8,
    title: 'Коробка «Ягодный микс»',
    category: 'box',
    price: 6900,
    badge: '',
    image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?auto=format&fit=crop&w=700&q=70',
    description: 'Насыщенные бордовые и розовые оттенки, хризантемы и розы в бархатной коробке.',
    composition: ['Роза — 9 шт.', 'Хризантема — 5 шт.', 'Бархатная коробка'],
    size: '25 × 25 см'
  },
  {
    id: 9,
    title: 'Мини-коробка «Комплимент»',
    category: 'box',
    price: 2500,
    badge: '',
    image: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=700&q=70',
    description: 'Небольшая коробка с кустовыми розами. Идеальный знак внимания коллеге или другу.',
    composition: ['Кустовая роза — 5 шт.', 'Мини-коробка Ø 12 см'],
    size: 'Ø 12 см, высота 18 см'
  }
];
