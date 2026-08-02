'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Confetti from '../ui/Confetti'
import { sounds } from '@/lib/sounds'
import { Baloo_2 } from 'next/font/google'
const baloo = Baloo_2({ subsets: ['latin'], weight: ['800'] })

export type GameQuestion<T> = {
  id: string
  questionUI: React.ReactNode
  answer: T
  choices: T[]
  itemName?: {en:string, vi:string}
  speakText?: {en:string, vi:string}
}

type GameEngineProps<T extends string | number> = {
  title: {en:string, vi:string}
  total: number
  theme: 'green'|'blue'|'purple'|'orange'
  backRoute: string
  generateQuestion: () => Promise<GameQuestion<T>>
  getAnswerText: (a:T) => string
  lang: 'en'|'vi'
  speakQuestion?: boolean
  showSubtitle?: boolean
}

export default function GameEngine<T extends string | number>({
  title, total, theme, backRoute, generateQuestion, getAnswerText, lang, speakQuestion, showSubtitle = true
}: GameEngineProps<T>){
  const themeBg = theme === 'green'? 'bg-green-100' : theme === 'blue'? 'bg-blue-100' : theme === 'purple'? 'bg-purple-100' : 'bg-orange-100'
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voicesReady, setVoicesReady] = useState(false) // NEW: track if voices loaded
  const [q, setQ] = useState<GameQuestion<T> | null>(null)
  const [score, setScore] = useState(0)
  const [qNum, setQNum] = useState(1)
  const [muted, setMuted] = useState(false)
  const [selected, setSelected] = useState<T | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [totalTime, setTotalTime] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const speakQueue = useRef<string[]>([]) // NEW: queue if voices not ready

  // FIX 1: Load voices + prime TTS so it works on first instance
  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices()
      if(v.length > 0) {
        setVoices(v)
        setVoicesReady(true)
      }
    }
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices

    // Prime: wake up speechSynthesis
    if('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance('')
      u.volume = 0
      window.speechSynthesis.speak(u)
    }
  }, [])

  // FIX 2: Best voice selection for EN + VI + retry if not ready
  const speakText = useCallback((text: string, ttsLang: 'en'|'vi') => {
    if (muted ||!('speechSynthesis' in window) ||!text) return

    // If voices not ready yet, queue it and retry in 300ms
    if(!voicesReady) {
      speakQueue.current.push(text + '|' + ttsLang)
      setTimeout(() => {
        const next = speakQueue.current.shift()
        if(next) {
          const [t, l] = next.split('|')
          speakText(t, l as 'en'|'vi')
        }
      }, 300)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)

    if (ttsLang === 'vi') {
      // Best VI: Google > Microsoft > any vi-VN
      const bestVi = voices.find(v => v.lang === 'vi-VN' && v.name.includes('Google'))
        || voices.find(v => v.lang === 'vi-VN' && v.name.includes('Microsoft'))
        || voices.find(v => v.lang === 'vi-VN')
        || null
      utterance.voice = bestVi
      utterance.lang = 'vi-VN'
      utterance.rate = 0.85
      utterance.pitch = 1.1
    } else {
      // FIX: Best EN: Google US > Google UK > Microsoft > any en-US/en-GB
      const bestEn = voices.find(v => v.lang === 'en-US' && v.name.includes('Google'))
        || voices.find(v => v.lang === 'en-GB' && v.name.includes('Google'))
        || voices.find(v => v.lang === 'en-US' && v.name.includes('Microsoft'))
        || voices.find(v => v.lang.startsWith('en-'))
        || null
      utterance.voice = bestEn
      utterance.lang = bestEn?.lang || 'en-US'
      utterance.rate = 0.95
      utterance.pitch = 1
    }
    window.speechSynthesis.speak(utterance)
  }, [voices, muted, voicesReady])

  const playSound = useCallback((type: 'correct'|'wrong'|'done') => {
    if (muted) return
    const audio = new Audio(sounds[type][lang])
    audio.play().catch(()=>{})
  }, [muted, lang])

  const getStars = () => {
    const scorePercent = score / total
    const avgTime = totalTime / total
    const timeBonus = Math.max(0, 1 - (avgTime / 60))
    const finalScore = scorePercent * 0.7 + timeBonus * 0.3
    if(finalScore >= 0.9) return 5
    if(finalScore >= 0.7) return 4
    if(finalScore >= 0.5) return 3
    if(finalScore >= 0.3) return 2
    if(finalScore >= 0.1) return 1
    return 0
  }

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const getFontSize = (text: string) => {
    if(text.length > 12) return 'text-2xl'
    if(text.length > 8) return 'text-3xl'
    return 'text-4xl'
  }

  const getSubtitleFromItem = (item: GameQuestion<T> | null) => {
    if(!item) return {en:'', vi:''}
    if(speakQuestion && item.speakText) return item.speakText
    if(item.itemName) {
      const answerNum = typeof item.answer === 'number'? item.answer : parseInt(String(item.answer))
      const plural = answerNum > 1? 's' : ''
      return { en: `How many ${item.itemName.en}${plural}?`, vi: `Có bao nhiêu ${item.itemName.vi}?` }
    }
    return {en:'', vi:''}
  }

  const nextQ = useCallback(async () => {
    setLoading(true)
    if(qNum > total) {
      setTotalTime((Date.now() - startTime) / 1000)
      setGameOver(true)
      setShowConfetti(true)
      playSound('done')
      speakText(lang==='en'?'Finished!':'Hoàn thành rồi!', lang)
      setLoading(false)
      return
    }
    const newQ = await generateQuestion()
    setQ(newQ)
    setSelected(null)
    setLoading(false)
    const subtitle = getSubtitleFromItem(newQ)

    // FIX 3: Wait a bit longer for first question to ensure voices loaded
    setTimeout(() => speakText(subtitle[lang], lang), voicesReady? 200 : 600)
  }, [qNum, total, generateQuestion, lang, startTime, speakText, playSound, voicesReady])

  useEffect(() => { nextQ() }, [])
  useEffect(() => { if(qNum > 1) nextQ() }, [qNum])

  const handleAnswer = (choice: T) => {
    if(selected!== null || gameOver || loading) return
    setSelected(choice)
    const correct = choice === q!.answer
    if(correct) {
      setScore(s => s + 1)
      playSound('correct')
      speakText(lang==='en'?'Correct!':'Đúng rồi!', lang)
    } else {
      playSound('wrong')
      speakText(lang==='en'?'Try again':'Sai rồi', lang)
    }
    setTimeout(() => { setQNum(n => n + 1) }, 1200)
  }

  const restartGame = () => {
    window.speechSynthesis.cancel()
    setStartTime(Date.now())
    setTotalTime(0)
    setScore(0)
    setQNum(1)
    setGameOver(false)
    setShowConfetti(false)
  }

  if(gameOver) {
    const stars = getStars()
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${baloo.className} ${themeBg} p-8`}>
        {showConfetti && <Confetti />}
        <h1 className="text-7xl font-extrabold text-black mb-4">{lang==='en'?'Finished!':'Hoàn thành!'}</h1>
        <div className="text-8xl mb-4">{'⭐'.repeat(stars)}{'☆'.repeat(5 - stars)}</div>
        <p className="text-5xl text-black mb-2">{score} / {total}</p>
        <p className="text-3xl text-black mb-2">{lang==='en'?'Total Time:' : 'Tổng thời gian:'} {formatTime(totalTime)}</p>
        <p className="text-2xl text-black mb-8">{lang==='en'?'Avg:' : 'TB:'} {formatTime(totalTime / total)} {lang==='en'?'per question' : 'mỗi câu'}</p>
        <div className="flex gap-4">
          <button onClick={restartGame} className="px-8 py-4 bg-blue-500 text-white text-2xl rounded-2xl hover:scale-105">{lang==='en'?'Play Again':'Chơi lại'}</button>
          <button onClick={() => router.push(backRoute)} className="px-8 py-4 bg-gray-500 text-white text-2xl rounded-2xl hover:scale-105">{lang==='en'?'Home':'Trang chủ'}</button>
        </div>
      </div>
    )
  }

  if(loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${baloo.className} ${themeBg}`}>
        <p className="text-5xl font-bold text-black">Loading...</p>
      </div>
    )
  }

  const subtitle = getSubtitleFromItem(q)
  return (
    <div className={`min-h-screen p-4 md:p-8 ${baloo.className} ${themeBg}`}>
      <div className="flex justify-between items-center mb-4 text-black text-xl md:text-2xl font-bold">
        <button onClick={() => {window.speechSynthesis.cancel(); router.push(backRoute)}} className="bg-white px-4 py-2 rounded-xl border-2 border-black hover:scale-105">🏠 {lang==='en'?'Home':'Trang chủ'}</button>
        <span>{title[lang]}: {qNum}/{total}</span>
        <button onClick={() => setMuted(!muted)}>{muted? '🔇' : '🔊'}</button>
      </div>
      {showSubtitle && subtitle[lang] && (
        <h2 className="text-center text-2xl md:text-4xl font-bold text-black mb-8 px-4">{subtitle[lang]}</h2>
      )}
      <div key={q?.id}>{q?.questionUI}</div> {/* key forces remount */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mt-8">
        {q?.choices.map(choice => {
          const isCorrect = choice === q.answer
          const isSelected = choice === selected
          let bg = 'bg-white border-black'
          if(isSelected) bg = isCorrect? 'bg-green-400 border-green-700' : 'bg-red-400 border-red-700'
          const text = getAnswerText(choice)
          return (
            <button key={text} onClick={() => handleAnswer(choice)} disabled={selected!== null}
              className={` ${bg} border-4 text-black rounded-2xl p-6 hover:scale-105 disabled:opacity-70 flex items-center justify-center min-h-[110px] md:min-h-[130px] ${getFontSize(text)} font-extrabold break-words whitespace-normal text-center leading-tight `}>
              <span>{text}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}