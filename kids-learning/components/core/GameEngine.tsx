'use client'
import { useState, useEffect, useCallback } from 'react'
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

export default function GameEngine<T extends string | number>({ 
  title, 
  total, 
  theme, 
  backRoute, 
  generateQuestion, 
  getAnswerText, 
  lang, 
  speakQuestion 
}:{
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
  
  const [q, setQ] = useState<GameQuestion<T> | null>(null)
  const [score, setScore] = useState(0)
  const [qNum, setQNum] = useState(1)
  const [muted, setMuted] = useState(false)
  const [selected, setSelected] = useState<T | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [totalTime, setTotalTime] = useState<number>(0)

  const router = useRouter()

  const getStars = () => {
    const scorePercent = score / total;
    const avgTime = totalTime / total;
    const timeBonus = Math.max(0, 1 - (avgTime / 60));
    const finalScore = scorePercent * 0.7 + timeBonus * 0.3;
    if(finalScore >= 0.9) return 5; 
    if(finalScore >= 0.7) return 4; 
    if(finalScore >= 0.5) return 3;
    if(finalScore >= 0.3) return 2; 
    if(finalScore >= 0.1) return 1; 
    return 0;
  }

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60); 
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const getSubtitleFromItem = (item: GameQuestion<T> | null) => {
    if(!item) return {en:'', vi:''};
    if(speakQuestion && item.speakText) return item.speakText;
    if(item.itemName) {
      const answerNum = typeof item.answer === 'number' ? item.answer : parseInt(String(item.answer))
      const plural = answerNum > 1 ? 's' : '';
      return { en: `How many ${item.itemName.en}${plural}?`, vi: `Có bao nhiêu ${item.itemName.vi}?` }
    }
    return {en:'', vi:''};
  }

  // FIXED: NO INFINITE LOOP
  const nextQ = useCallback(() => {
    if(qNum > total) { 
      setTotalTime((Date.now() - startTime) / 1000); 
      setGameOver(true); 
      setShowConfetti(true);
      speak(sounds.done[lang], muted, lang); 
      return; 
    }
    const newQ = generateQuestion();
    setQ(newQ); 
    setSelected(null); 
    const subtitle = getSubtitleFromItem(newQ);
    setTimeout(() => speak(subtitle[lang], muted, lang), 200);
  }, [qNum, total, generateQuestion, muted, lang, startTime])

  // 1. RUN ONCE TO START GAME
  useEffect(() => { 
    nextQ() 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) 

  // 2. RUN WHEN qNum INCREASES TO LOAD NEXT Q
  useEffect(() => { 
    if(qNum > 1) nextQ() 
  }, [qNum])

  const handleAnswer = (choice: T) => {
    if(selected !== null || gameOver) return;
    setSelected(choice);
    const correct = choice === q!.answer;
    if(correct) { 
      setScore(s => s + 1); 
      speak(sounds.correct[lang], muted, lang); 
    }
    else { 
      speak(sounds.wrong[lang], muted, lang); 
    }
    // Wait 1 sec then go to next question
    setTimeout(() => { setQNum(n => n + 1); }, 1000);
  }

  const restartGame = () => {
    setStartTime(Date.now());
    setTotalTime(0); 
    setScore(0); 
    setQNum(1); 
    setGameOver(false); 
    setShowConfetti(false);
  }

  // GAME OVER SCREEN
  if(gameOver) {
    const stars = getStars();
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

  // GAME SCREEN
  const subtitle = getSubtitleFromItem(q);
  return (
    <div className={`min-h-screen p-8 ${baloo.className} ${themeBg}`}>
      <div className="flex justify-between items-center mb-4 text-black text-2xl font-bold">
        <button onClick={() => router.push(backRoute)} className="bg-white px-4 py-2 rounded-xl border-2 border-black hover:scale-105">🏠 {lang==='en'?'Home':'Trang chủ'}</button>
        <span>{title[lang]}: {qNum}/{total}</span>
        <button onClick={() => setMuted(!muted)}>{muted? '🔇' : '🔊'}</button>
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
            <button key={getAnswerText(choice)} onClick={() => handleAnswer(choice)} disabled={selected !== null}
              className={`${bg} border-4 text-5xl font-extrabold text-black rounded-2xl p-8 hover:scale-105 disabled:opacity-70`}>
              {getAnswerText(choice)}
            </button>
          )
        })}
      </div>
    </div>
  )
}