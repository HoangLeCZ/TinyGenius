'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Confetti from '../ui/Confetti'
import { speak, sounds } from '@/lib/sounds'
import { Baloo_2 } from 'next/font/google'
const baloo = Baloo_2({ subsets: ['latin'], weight: ['800'] })

export type GameQuestion<T> = {
  id: string; 
  questionUI: React.ReactNode; 
  answer: T; 
  choices: T[];
  itemName?: {en:string, vi:string}, 
  speakText?: {en:string, vi:string}
}

export default function GameEngine<T>({ title, total, theme, backRoute, generateQuestion, getAnswerText, lang, speakQuestion }:{
  title: {en:string, vi:string}, 
  total: number, 
  theme: 'green'|'blue'|'purple'|'orange', 
  backRoute: string,
  generateQuestion: () => GameQuestion<T>, 
  getAnswerText: (a:T) => string, 
  lang: 'en'|'vi', 
  speakQuestion?: boolean
}){
  const themeBg = theme === 'green'? 'bg-green-100' : theme === 'blue'? 'bg-blue-100' : theme === 'purple'? 'bg-purple-100' : 'bg-orange-100'
  
  const [gameStarted, setGameStarted] = useState(false)
  const [secondsPerQuestion, setSecondsPerQuestion] = useState(10) // DEFAULT 10s
  
  const [q, setQ] = useState<GameQuestion<T> | null>(null)
  const [score, setScore] = useState(0)
  const [qNum, setQNum] = useState(1)
  const [muted, setMuted] = useState(false)
  const [selected, setSelected] = useState<T | null>(null)
  const [time, setTime] = useState(10)
  const [showConfetti, setShowConfetti] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [totalTimeLeft, setTotalTimeLeft] = useState(0)
  const router = useRouter()
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startGame = (seconds: number) => {
    setSecondsPerQuestion(seconds);
    setTime(seconds);
    setGameStarted(true);
  }

  const getStars = () => {
    const scorePercent = score / total;
    const timeBonus = totalTimeLeft / (total * secondsPerQuestion);
    const finalScore = scorePercent + timeBonus * 0.5;
    if(finalScore >= 0.9) return 5; 
    if(finalScore >= 0.7) return 4; 
    if(finalScore >= 0.5) return 3;
    if(finalScore >= 0.3) return 2; 
    if(finalScore >= 0.1) return 1; 
    return 0;
  }

  const getSubtitleFromItem = (item: GameQuestion<T> | null) => {
    if(!item) return {en:'', vi:''};
    if(speakQuestion && item.speakText) return item.speakText;
    if(item.itemName) {
      const plural = item.answer > 1? 's' : '';
      return { en: `How many ${item.itemName.en}${plural}?`, vi: `Có bao nhiêu ${item.itemName.vi}?` }
    }
    return {en:'', vi:''};
  }

  const nextQ = useCallback(() => {
    if(qNum > total) { setGameOver(true); return; }
    const newQ = generateQuestion();
    setQ(newQ); 
    setSelected(null); 
    setTime(secondsPerQuestion);
    const subtitle = getSubtitleFromItem(newQ);
    setTimeout(() => speak(subtitle[lang], muted, lang), 200);
  }, [qNum, total, generateQuestion, muted, lang, speakQuestion, secondsPerQuestion])

  useEffect(() => { if(gameStarted) nextQ() }, [gameStarted, nextQ])

  useEffect(() => {
    if(!q || gameOver || !gameStarted) return;
    timerRef.current = setInterval(() => setTime(t => t - 1), 1000);
    return () => { if(timerRef.current) clearInterval(timerRef.current) };
  }, [q, gameOver, gameStarted])

  useEffect(() => { if(time <= 0 &&!gameOver && gameStarted) handleAnswer(null); }, [time, gameOver, gameStarted])

  const handleAnswer = (choice: T | null) => {
    if(selected!== null || gameOver) return;
    if(timerRef.current) clearInterval(timerRef.current);
    setSelected(choice);
    const correct = choice === q!.answer;
    if(correct) { 
      setScore(s => s + 1); 
      setTotalTimeLeft(t => t + time); 
      speak(sounds.correct[lang], muted, lang); 
    }
    else { 
      speak(sounds.wrong[lang], muted, lang); 
    }
    setTimeout(() => {
      if(qNum === total) { 
        setGameOver(true); 
        setShowConfetti(true); 
        speak(sounds.done[lang], muted, lang); 
      }
      else { 
        setQNum(n => n + 1); 
      }
    }, 1200);
  }

  // START SCREEN WITH DEFAULT
// START SCREEN WITH DEFAULT
  if(!gameStarted){
    return (
      <div className={`min-h-screen flex-col items-center ${baloo.className} ${themeBg} p-8 pt-20`}>

        <div className="w-full max-w-6xl flex justify-start mb-6">
          <button onClick={() => router.push(backRoute)} className="bg-white px-4 py-2 rounded-xl border-2 border-black text-black text-2xl font-bold hover:scale-105">
            🏠 {lang==='en'?'Home':'Trang chủ'}
          </button>
        </div>

        <h1 className="text-6xl font-extrabold text-black mb-4 text-center">{title[lang]}</h1>
        <p className="text-3xl text-black mb-8 text-center">{lang==='en'?'Choose your speed':'Chọn tốc độ'}</p>

        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {/* HARD = 10s */}
          <button onClick={() => startGame(10)} className="bg-red-400 border-4 border-red-700 rounded-3xl p-8 text-black hover:scale-110 transition">
            <div className="text-6xl mb-2">🐆</div>
            <div className="text-3xl font-extrabold">{lang==='en'?'Hard':'Khó'}</div>
            <div className="text-2xl">10s</div>
          </button>

          {/* NORMAL = 20s */}
          <button onClick={() => startGame(20)} className="bg-blue-400 border-4 border-blue-700 rounded-3xl p-8 text-black hover:scale-110 transition">
            <div className="text-6xl mb-2">🚶</div>
            <div className="text-3xl font-extrabold">{lang==='en'?'Normal':'TB'}</div>
            <div className="text-2xl">20s</div>
          </button>

          {/* EASY = 30s */}
          <button onClick={() => startGame(30)} className="bg-green-400 border-4 border-green-700 rounded-3xl p-8 text-black hover:scale-110 transition">
            <div className="text-6xl mb-2">🐢</div>
            <div className="text-3xl font-extrabold">{lang==='en'?'Easy':'Dễ'}</div>
            <div className="text-2xl">30s</div>
          </button>
        </div>


      </div>
    )
  }


  // GAME OVER SCREEN
  if(gameOver) {
    const stars = getStars();
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${baloo.className} ${themeBg} p-8`}>
        {showConfetti && <Confetti />}
        <h1 className="text-7xl font-extrabold text-black mb-4">{lang==='en'?'Finished!':'Hoàn thành!'}</h1>
        <div className="text-8xl mb-4">{'⭐'.repeat(stars)}{'☆'.repeat(5 - stars)}</div>
        <p className="text-4xl text-black mb-2">{score} / {total}</p>
        <p className="text-2xl text-black mb-8">
          {stars === 5 && (lang==='en'?'Perfect!':'Tuyệt vời!')}
          {stars === 4 && (lang==='en'?'Great job!':'Làm tốt lắm!')}
          {stars === 3 && (lang==='en'?'Good work!':'Khá lắm!')}
          {stars <= 2 && (lang==='en'?'Keep trying!':'Cố gắng nữa nhé!')}
        </p>
        <button onClick={() => setGameStarted(false)} className="px-8 py-4 bg-blue-500 text-white text-2xl rounded-2xl hover:scale-105 transition">{lang==='en'?'Play Again':'Chơi lại'}</button>
      </div>
    )
  }

  // GAME SCREEN
  const subtitle = getSubtitleFromItem(q);
  return (
    <div className={`min-h-screen p-8 ${baloo.className} ${themeBg}`}>
      <div className="flex justify-between items-center mb-4 text-black text-2xl font-bold">
        <button onClick={() => setGameStarted(false)} className="bg-white px-4 py-2 rounded-xl border-2 border-black hover:scale-105">🏠 {lang==='en'?'Home':'Trang chủ'}</button>
        <span>{title[lang]}: {qNum}/{total}</span>
        <div className="flex gap-4">
          <span>⏱️ {time}s</span>
          <button onClick={() => setMuted(!muted)}>{muted? '🔇' : '🔊'}</button>
        </div>
      </div>
      <h2 className="text-center text-4xl font-bold text-black mb-8 px-4">{subtitle[lang]}</h2>
      {q?.questionUI}
      <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
        {q?.choices.map(choice => {
          const isCorrect = choice === q.answer; 
          const isSelected = choice === selected;
          let bg = 'bg-white border-black'; 
          if(isSelected) bg = isCorrect? 'bg-green-400 border-green-700' : 'bg-red-400 border-red-700';
          return (
            <button key={getAnswerText(choice)} onClick={() => handleAnswer(choice)}
              className={`${bg} border-4 text-5xl font-extrabold text-black rounded-2xl p-8 transition-all duration-300 hover:scale-105`}>
              {getAnswerText(choice)}
            </button>
          )
        })}
      </div>
    </div>
  )
}