'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Confetti from '../ui/Confetti'
import { sounds } from '@/lib/sounds'
import { Baloo_2 } from 'next/font/google'
const baloo = Baloo_2({ subsets: ['latin'], weight: ['800'] })

export type LanguageQuestion<T> = {
  id: string
  mediaUI: React.ReactNode // image/video/audio instead of just questionUI
  prompt: {en:string, vi:string} // "What is this?" / "Đây là gì?"
  answer: T
  choices: T[]
  word: {en:string, vi:string} // the vocab word for TTS + display
}

type LanguageEngineProps<T extends string | number> = {
  title: {en:string, vi:string}
  subtitle: {en:string, vi:string} // "Learn Animals" / "Học về Động vật"
  total: number
  theme: 'green'|'blue'|'purple'|'orange'
  backRoute: string
  generateQuestion: () => Promise<LanguageQuestion<T>>
  getAnswerText: (a:T) => string
  lang: 'en'|'vi'
  mode: 'vocab' | 'listen' | 'spell' // vocab=see pic, listen=hear word, spell=type word
}

export default function LanguageEngine<T extends string | number>({
  title, subtitle, total, theme, backRoute, generateQuestion, getAnswerText, lang, mode
}: LanguageEngineProps<T>) {

  const themeBg = theme === 'green'? 'bg-green-100' : theme === 'blue'? 'bg-blue-100' : theme === 'purple'? 'bg-purple-100' : 'bg-orange-100'

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [q, setQ] = useState<LanguageQuestion<T> | null>(null)
  const [score, setScore] = useState(0)
  const [qNum, setQNum] = useState(1)
  const [muted, setMuted] = useState(false)
  const [selected, setSelected] = useState<T | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Load TTS Voices
  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices())
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [])

const speak = useCallback((text: string, ttsLang: 'en'|'vi' = lang) => {
  if (muted ||!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  
  if (ttsLang === 'vi') {
    const bestVi = voices.find(v => v.lang === 'vi-VN' && v.name.includes('Google'))
      || voices.find(v => v.lang === 'vi-VN')
      || null // <-- add this
    utterance.voice = bestVi
    utterance.lang = 'vi-VN'; utterance.rate = 0.85; utterance.pitch = 1.1
  } else {
    const bestEn = voices.find(v => v.lang === 'en-US' && v.name.includes('Google'))
      || voices.find(v => v.lang === 'en-US')
      || null // <-- add this
    utterance.voice = bestEn
    utterance.lang = 'en-US'; utterance.rate = 0.95
  }
  window.speechSynthesis.speak(utterance)
}, [voices, muted, lang])

  const playSound = useCallback((type: 'correct'|'wrong'|'done') => {
    if (muted) return
    new Audio(sounds[type][lang]).play().catch(()=>{})
  }, [muted, lang])

  const nextQ = useCallback(async () => {
    setLoading(true)
    if(qNum > total) {
      setGameOver(true); setShowConfetti(true); playSound('done')
      speak(lang==='en'?'Great job!':'Tuyệt vời!'); setLoading(false); return
    }
    const newQ = await generateQuestion()
    setQ(newQ); setSelected(null); setLoading(false)

    // Auto speak based on mode
    setTimeout(() => {
      if(mode === 'listen') speak(newQ.word[lang], lang) // "Hear the word"
      else speak(newQ.prompt[lang], lang) // "What is this?"
    }, 300)
  }, [qNum, total, generateQuestion, lang, speak, playSound, mode])

  useEffect(() => { nextQ() }, [])
  useEffect(() => { if(qNum > 1) nextQ() }, [qNum])

  const handleAnswer = (choice: T) => {
    if(selected!== null || gameOver || loading) return
    setSelected(choice)
    const correct = choice === q!.answer
    if(correct) {
      setScore(s => s + 1); playSound('correct')
      speak(lang==='en'?`Correct! ${q!.word[lang]}`:`Đúng rồi! ${q!.word[lang]}`, lang)
    } else {
      playSound('wrong'); speak(lang==='en'?'Try again':'Sai rồi', lang)
    }
    setTimeout(() => { setQNum(n => n + 1) }, 1500)
  }

  const restartGame = () => {
    window.speechSynthesis.cancel()
    setScore(0); setQNum(1); setGameOver(false); setShowConfetti(false)
  }

  if(gameOver) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${baloo.className} ${themeBg} p-8`}>
        {showConfetti && <Confetti />}
        <h1 className="text-7xl font-extrabold text-black mb-4">{lang==='en'?'Amazing!':'Tuyệt vời!'}</h1>
        <div className="text-8xl mb-4">{'⭐'.repeat(Math.ceil(score/total*5))}</div>
        <p className="text-5xl text-black mb-8">{score} / {total}</p>
        <div className="flex gap-4">
          <button onClick={restartGame} className="px-8 py-4 bg-blue-500 text-white text-2xl rounded-2xl">{lang==='en'?'Play Again':'Chơi lại'}</button>
          <button onClick={() => router.push(backRoute)} className="px-8 py-4 bg-gray-500 text-white text-2xl rounded-2xl">{lang==='en'?'Home':'Trang chủ'}</button>
        </div>
      </div>
    )
  }

  if(loading) return <div className={`min-h-screen flex items-center justify-center ${baloo.className} ${themeBg}`}><p className="text-5xl font-bold text-black">Loading...</p></div>

  return (
    <div className={`min-h-screen p-4 md:p-8 ${baloo.className} ${themeBg}`}>
      <div className="flex justify-between items-center mb-2 text-black text-xl md:text-2xl font-bold">
        <button onClick={() => {window.speechSynthesis.cancel(); router.push(backRoute)}} className="bg-white px-4 py-2 rounded-xl border-2 border-black">🏠 {lang==='en'?'Home':'Trang chủ'}</button>
        <span>{title[lang]}: {qNum}/{total}</span>
        <button onClick={() => setMuted(!muted)}>{muted? '🔇' : '🔊'}</button>
      </div>
      <p className="text-center text-xl text-black mb-6">{subtitle[lang]}</p>

      <h2 className="text-center text-3xl md:text-5xl font-bold text-black mb-8">{q?.prompt[lang]}</h2>

      <div key={q?.id}> {/* THIS fixes the photo not changing */}
        {q?.mediaUI}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mt-8">
        {q?.choices.map(choice => {
          const isCorrect = choice === q.answer
          const isSelected = choice === selected
          let bg = 'bg-white border-black'
          if(isSelected) bg = isCorrect? 'bg-green-400 border-green-700' : 'bg-red-400 border-red-700'
          return (
            <button key={String(choice)} onClick={() => handleAnswer(choice)} disabled={selected!== null}
              className={`${bg} border-4 text-black rounded-2xl p-6 hover:scale-105 disabled:opacity-70 flex items-center justify-center min-h-[110px] text-3xl font-extrabold`}>
              {getAnswerText(choice)}
            </button>
          )
        })}
      </div>
    </div>
  )
}