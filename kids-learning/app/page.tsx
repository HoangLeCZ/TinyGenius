'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Baloo_2 } from 'next/font/google'
const baloo = Baloo_2({ subsets: ['latin'], weight: ['800'] })

type Lang = 'en' | 'vi'

const MATH_GAMES = [
  { name: {en:'Counting', vi:'Đếm số'}, emoji: '🍎', route: '/game/counting', color: 'bg-green-300 border-green-500' },
  { name: {en:'Add & Subtract', vi:'Cộng & Trừ'}, emoji: '➕', route: '/game/addsub', color: 'bg-blue-300 border-blue-500' },
  { name: {en:'Multiply & Divide', vi:'Nhân & Chia'}, emoji: '✖️', route: '/game/multidiv', color: 'bg-purple-300 border-purple-500' },
  { name: {en:'Verbal Math', vi:'Toán lời văn'}, emoji: '💬', route: '/game/verbal', color: 'bg-orange-300 border-orange-500' },
]

const OTHER_GAMES = [
  { name: {en:'Vocabulary', vi:'Từ vựng'}, emoji: '📚', route: '/game/vocab', color: 'bg-yellow-300 border-yellow-500' },
  { name: {en:'Reading', vi:'Đọc hiểu'}, emoji: '📖', route: '/game/reading', color: 'bg-pink-300 border-pink-500' },
  { name: {en:'Reasoning', vi:'Tư duy'}, emoji: '🧠', route: '/game/reasoning', color: 'bg-indigo-300 border-indigo-500' },
]

export default function HomePage() {
  const router = useRouter()
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    setLang(localStorage.getItem('lang') as Lang || 'en')
  }, [])

  const changeLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem('lang', l)
  }

  const GameGrid = ({games}:{games: typeof MATH_GAMES}) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
      {games.map(g =>
        <button
          key={g.route}
          onClick={() => router.push(`${g.route}?lang=${lang}`)}
          className={`${g.color} border-4 rounded-3xl p-8 shadow-2xl hover:scale-110 transition`}>
            <div className="text-7xl mb-4">{g.emoji}</div>
            <div className="text-2xl font-extrabold text-black">{g.name[lang]}</div>
        </button>
      )}
    </div>
  )

  return (
    <div className={`min-h-screen bg-gradient-to-b from-green-200 to-yellow-100 p-8 ${baloo.className}`}>
      <div className="flex justify-center gap-6 mb-8">
        <button onClick={() => changeLang('en')} className={`text-6xl transition ${lang==='en'?'scale-125':''}`}>🇺🇸</button>
        <button onClick={() => changeLang('vi')} className={`text-6xl transition ${lang==='vi'?'scale-125':''}`}>🇻🇳</button>
      </div>

      <h1 className="text-center text-6xl font-extrabold text-black mb-4">🌲 Forest Learning 🌲</h1>
      <p className="text-center text-2xl text-black mb-12 font-bold">{lang==='en'?'Pick a game!':'Chọn một trò chơi!'}</p>

      {/* MATH SECTION */}
      <div className="mb-16">
        <h2 className="text-center text-5xl font-extrabold text-black mb-8">📐 {lang==='en'?'Math':'Toán học'}</h2>
        <GameGrid games={MATH_GAMES} />
      </div>

      {/* OTHER SECTION */}
      <div>
        <h2 className="text-center text-5xl font-extrabold text-black mb-8">✨ {lang==='en'?'Language & Thinking':'Ngôn ngữ & Tư duy'}</h2>
        <GameGrid games={OTHER_GAMES} />
      </div>

    </div>
  )
}