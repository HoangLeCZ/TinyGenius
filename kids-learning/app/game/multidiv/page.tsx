'use client' 
import GameEngine, { GameQuestion } from '@/components/core/GameEngine' 
import { useSearchParams } from 'next/navigation' 

export default function MultiDivPage(){ 
  const searchParams = useSearchParams()
  const lang = (searchParams.get('lang') as 'en'|'vi') || 'en' 

  const generateMultiDivQuestion = (): GameQuestion<number> => { // 1. MUST RETURN ID
    const isMultiply = Math.random() > 0.5
    let a = Math.floor(Math.random() * 10) + 1
    let b = Math.floor(Math.random() * 10) + 1
    
    const answer = isMultiply ? a * b : a
    if(!isMultiply) a = answer * b // make sure division is clean: 12 / 3 = 4
    
    const symbol = isMultiply ? '×' : '÷'

    return {
      id: crypto.randomUUID(), // 2. ADD THIS - GameEngine requires it
      questionUI: <div className="text-center text-7xl font-extrabold text-black">{a} {symbol} {b} = ?</div>,
      answer: answer,
      choices: [answer, answer+1, answer-1, answer+2].filter(n => n > 0).sort(() => Math.random() - 0.5),
      speakText: { 
        en: isMultiply ? `What is ${a} times ${b}?` : `What is ${a} divided by ${b}?`,
        vi: isMultiply ? `${a} nhân ${b} bằng bao nhiêu?` : `${a} chia ${b} bằng bao nhiêu?`
      }
    }
  }

  return (
    <GameEngine<number> // 3. TELL IT <number>
      title={{en:'Multiply & Divide', vi:'Nhân & Chia'}} 
      total={10} 
      theme="purple" 
      backRoute="/" 
      generateQuestion={generateMultiDivQuestion} 
      getAnswerText={(a) => String(a)} 
      lang={lang} 
      speakQuestion={true} 
    /> 
  )
}