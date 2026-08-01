'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Baloo_2, Comic_Neue } from 'next/font/google'

const baloo = Baloo_2({ subsets: ['latin'], weight: ['600', '800'] })
const comic = Comic_Neue({ subsets: ['latin'], weight: ['400', '700'] })

const categories = [
  {
    id: 'math',
    icon: '🔢',
    title: {cs: 'Matematika', en: 'Math', vi: 'Toán học'},
    desc: {cs: 'Počítání, sčítání, slovní úlohy', en: 'Counting, Add, Word problems', vi: 'Đếm, Cộng, Toán đố'},
    bg: 'bg-blue-100',
    buttonColor: 'bg-blue-500'
  },
  {
    id: 'vocab',
    icon: '📚',
    title: {cs: 'Slovní zásoba', en: 'Vocabulary', vi: 'Từ vựng'},
    desc: {cs: 'Uč se nová slova', en: 'Learn new words', vi: 'Học từ mới'},
    bg: 'bg-green-100',
    buttonColor: 'bg-green-500'
  },
  {
    id: 'memory',
    icon: '🧠',
    title: {cs: 'Paměť', en: 'Memory', vi: 'Trí nhớ'},
    desc: {cs: 'Hry na paměť', en: 'Memory games', vi: 'Trò chơi trí nhớ'},
    bg: 'bg-purple-100',
    buttonColor: 'bg-purple-500'
  },
]

export default function Home() {
  const [lang, setLang] = useState<'cs'|'en'|'vi'>('cs')
  const router = useRouter()

  useEffect(()=>{
    const saved = localStorage.getItem('lang') as 'cs'|'en'|'vi' || 'cs'
    setLang(saved)
  },[])

  const setLangAndSave = (l: 'cs'|'en'|'vi') => {
    setLang(l)
    localStorage.setItem('lang', l)
  }

  const t = {
    title: {cs: 'Učící Hry', en: 'Learning Games', vi: 'Trò Chơi Học Tập'},
    choose: {cs: 'Vyber kategorii', en: 'Choose a category', vi: 'Chọn danh mục'},
  }

  return (
    <main className={`${comic.className} min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 flex-col items-center p-6`}>
      <div className="flex gap-2 mb-6">
        {(['cs','en','vi'] as const).map(l => (
          <button key={l} onClick={()=>setLangAndSave(l)}
            className={`px-4 py-2 rounded-2xl font-bold border-4 ${lang===l? 'bg-purple-500 text-white border-purple-900' : 'bg-white text-purple-900 border-purple-300'}`}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="text-6xl mb-2">🤖</div>
      <h1 className={`${baloo.className} text-5xl text-purple-900 mb-2`}>{t.title[lang]}</h1>
      <p className="text-xl text-purple-800 mb-8 font-bold">{t.choose[lang]}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {categories.map(cat => (
          <button key={cat.id} onClick={()=>router.push(`/category/${cat.id}`)}
            className={`${cat.bg} rounded-3xl p-8 border-4 border-purple-300 shadow-xl hover:scale-105 transition`}>
            <div className="text-6xl mb-3">{cat.icon}</div>
            <h2 className={`${baloo.className} text-3xl text-purple-900 mb-2`}>{cat.title[lang]}</h2>
            <p className="text-purple-800 font-bold">{cat.desc[lang]}</p>
          </button>
        ))}
      </div>
    </main>
  )
}