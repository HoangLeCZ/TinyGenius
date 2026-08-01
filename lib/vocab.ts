export type VocabWord = {
  cs: string
  en: string
  vi: string
  img: string
  emoji: string
  category: 'animals' | 'food' | 'school' | 'general'
}

export const vocabList: VocabWord[] = [
  // ANIMALS
  { cs: 'pes', en: 'dog', vi: 'chó', emoji: '🐶', img: 'https://cdn.pixabay.com/photo/2017/09/25/13/12/puppy-2785074_1280.jpg', category: 'animals' },
  { cs: 'kočka', en: 'cat', vi: 'mèo', emoji: '🐱', img: 'https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_1280.jpg', category: 'animals' },

  // FOOD
  { cs: 'jablko', en: 'apple', vi: 'táo', emoji: '🍎', img: 'https://cdn.pixabay.com/photo/2017/10/09/19/29/eat-2843313_1280.jpg', category: 'food' },
  { cs: 'chléb', en: 'bread', vi: 'bánh mì', emoji: '🍞', img: 'https://cdn.pixabay.com/photo/2017/05/07/08/56/bread-2293339_1280.jpg', category: 'food' },

  // SCHOOL
  { cs: 'kniha', en: 'book', vi: 'sách', emoji: '📖', img: 'https://cdn.pixabay.com/photo/2015/11/19/21/10/glasses-1052010_1280.jpg', category: 'school' },
  { cs: 'tužka', en: 'pencil', vi: 'bút chì', emoji: '✏️', img: 'https://cdn.pixabay.com/photo/2017/01/20/15/06/pencil-1995840_1280.jpg', category: 'school' },
]