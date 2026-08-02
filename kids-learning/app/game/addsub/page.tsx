'use client'
import GameEngine, { GameQuestion } from '@/components/core/GameEngine'
import { useSearchParams } from 'next/navigation'

export default function AddSubPage(){
  const searchParams = useSearchParams()
  const lang = (searchParams.get('lang') as 'en'|'vi') || 'en'

  const generateAddSubQuestion = (): GameQuestion<number> => {
    const isAdd = Math.random() > 0.5
    let a = Math.floor(Math.random() * 10) + 1
    let b = Math.floor(Math.random() * 10) + 1
    
    if(!isAdd && a < b) [a, b] = [b, a] // prevent negatives

    const answer = isAdd ? a + b : a - b
    const symbol = isAdd ? '+' : '-'

    return {
      id: crypto.randomUUID(),
      questionUI: <div className="text-center text-7xl font-extrabold text-black">{a} {symbol} {b} = ?</div>,
      answer: answer,
      choices: [answer, answer+1, Math.max(0, answer-1), answer+2].filter((v, i, arr) => arr.indexOf(v) === i).sort(() => Math.random() - 0.5),
      speakText: { 
        en: isAdd ? `What is ${a} plus ${b}?` : `What is ${a} minus ${b}?`,
        vi: isAdd ? `${a} cộng ${b} bằng bao nhiêu?` : `${a} trừ ${b} bằng bao nhiêu?`
      }
    }
  }

  return (
    <GameEngine<number>
      title={{en: "Add & Subtract", vi: "Cộng & Trừ"}}
      total={10}
      theme="green"
      backRoute="/"
      generateQuestion={generateAddSubQuestion}
      getAnswerText={(a) => String(a)}
      lang={lang}
      speakQuestion={true}
    />
  )
}