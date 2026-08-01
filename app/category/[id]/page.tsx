'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Baloo_2, Comic_Neue } from 'next/font/google'

const baloo = Baloo_2({ subsets: ['latin'], weight: ['600', '800'] })
const comic = Comic_Neue({ subsets: ['latin'], weight: ['400', '700'] })

const gamesByCategory = {
  math: [
    { mode: 'counting', title: {cs: 'Počítání', en: 'Counting', vi: 'Đếm'}, subtitle: {cs: 'Počítej předměty', en: 'Count objects', vi: 'Đếm đồ vật'}, total: 10, bg: 'bg-green-100', buttonColor: 'bg-green-500' },
    { mode: 'addsub', title: {cs: 'Sčítání a odčítání', en: 'Add & Subtract', vi: 'Cộng & Trừ'}, subtitle: {cs: 'Do 100', en: 'Up to 100', vi: 'Đến 100'}, total: 10, bg: 'bg-blue-100', buttonColor: 'bg-blue-500' },
    { mode: 'multdiv', title: {cs: 'Násobení a dělení', en: 'Multiply & Divide', vi: 'Nhân & Chia'}, subtitle: {cs: '1-10', en: '1-10', vi: '1-10'}, total: 10, bg: 'bg-purple-100', buttonColor: 'bg-purple-500' },
    { mode: 'word', title: {cs: 'Slovní úlohy', en: 'Word Problems', vi: 'Toán đố'}, subtitle: {cs: 'Příběhy', en: 'Stories', vi: 'Câu chuyện'}, total: 10, bg: 'bg-amber-100', buttonColor: 'bg-amber-500' },
  ],
vocab: [ 
    { 
      mode: 'vocab', // General picture vocab - 500 words
      title: {cs: 'Slovíčka s obrázky', en: 'Picture Vocabulary', vi: 'Từ vựng qua hình'},
      subtitle: {cs: 'Co je to na obrázku?', en: 'What is this?', vi: 'Đây là gì?'},
      total: 10, bg: 'bg-purple-100', buttonColor: 'bg-purple-500' 
    },
    { 
      mode: 'animals', // Animals only
      title: {cs: 'Zvířata', en: 'Animals', vi: 'Động vật'},
      subtitle: {cs: 'Poznej zvíře', en: 'Guess the animal', vi: 'Đoán con vật'},
      total: 10, bg: 'bg-green-100', buttonColor: 'bg-green-500' 
    },
    { 
      mode: 'food', // Food only
      title: {cs: 'Jídlo', en: 'Food', vi: 'Đồ ăn'},
      subtitle: {cs: 'Co to je k jídlu?', en: 'What food is this?', vi: 'Đây là đồ ăn gì?'},
      total: 10, bg: 'bg-orange-100', buttonColor: 'bg-orange-500' 
    },
    { 
      mode: 'school', // School items
      title: {cs: 'Ve škole', en: 'At School', vi: 'Ở trường'},
      subtitle: {cs: 'Školní potřeby', en: 'School supplies', vi: 'Đồ dùng học tập'},
      total: 10, bg: 'bg-blue-100', buttonColor: 'bg-blue-500' 
    },
  ],
  memory: [
    { mode: 'cards', title: {cs: 'Pexeso', en: 'Memory Cards', vi: 'Lật thẻ'}, subtitle: {cs: 'Najdi dvojice', en: 'Find pairs', vi: 'Tìm cặp'}, total: 10, bg: 'bg-pink-100', buttonColor: 'bg-pink-500' },
  ]
}

const categoryTitles = {
  math: {cs: 'Matematika', en: 'Math', vi: 'Toán học'},
  vocab: {cs: 'Slovní zásoba', en: 'Vocabulary', vi: 'Từ vựng'},
  memory: {cs: 'Paměť', en: 'Memory', vi: 'Trí nhớ'},
}

export default function CategoryPage() {
  const { id } = useParams()
  const router = useRouter()
  const [lang, setLang] = useState<'cs'|'en'|'vi'>('cs') // FIX 1: ADD STATE

  useEffect(()=>{ // FIX 2: READ FROM LOCALSTORAGE
    const saved = localStorage.getItem('lang') as 'cs'|'en'|'vi' || 'cs'
    setLang(saved)
  },[])

  const games = gamesByCategory[id as keyof typeof gamesByCategory] || []
  const catTitle = categoryTitles[id as keyof typeof categoryTitles] || {cs:'',en:'',vi:''}

  const t = {
    back: {cs: 'Zpět', en: 'Back', vi: 'Quay lại'},
    play: {cs: 'Hrát', en: 'Play', vi: 'Chơi'}
  }

  return (
    <main className={`${comic.className} min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 p-6`}>
      <button onClick={()=>router.push('/')} className="bg-white px-4 py-2 rounded-2xl shadow text-2xl mb-6">🏠 {t.back[lang]}</button>

      <h1 className={`${baloo.className} text-4xl text-purple-900 mb-6`}>{catTitle[lang]}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {games.map(game => (
          <button key={game.mode} onClick={()=>router.push(`/game/${game.mode}`)}
            className={`${game.bg} rounded-3xl p-8 border-4 border-purple-300 shadow-xl hover:scale-105 transition`}>
            <h2 className={`${baloo.className} text-3xl text-purple-900 mb-2`}>{game.title[lang]}</h2>
            <p className="text-purple-800 font-bold mb-4">{game.subtitle[lang]}</p>
            <div className={`${game.buttonColor} text-white py-3 px-6 rounded-2xl text-xl font-bold`}>{t.play[lang]} ▶️</div>
          </button>
        ))}
      </div>
    </main>
  )
}