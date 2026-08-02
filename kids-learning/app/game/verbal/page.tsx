'use client'
import { useSearchParams } from 'next/navigation'
import GameEngine, { GameQuestion } from '@/components/core/GameEngine'

export default function VerbalPage() {
  const searchParams = useSearchParams()
  const lang = (searchParams.get('lang') as 'en' | 'vi') || 'en'

  const generateVerbalQuestion = (): GameQuestion<string> => {
    const operations: {
      symbol: string,
      fn: (a:number, b:number) => number,
      text: { en: (a:number, b:number) => string, vi: (a:number, b:number) => string }
    }[] = [
      { symbol: '+', fn: (a,b) => a + b, text: { en: (a,b) => `What is ${a} plus ${b}?`, vi: (a,b) => `${a} cộng ${b} bằng bao nhiêu?`} },
      { symbol: '-', fn: (a,b) => a - b, text: { en: (a,b) => `What is ${a} minus ${b}?`, vi: (a,b) => `${a} trừ ${b} bằng bao nhiêu?`} },
      { symbol: '×', fn: (a,b) => a * b, text: { en: (a,b) => `What is ${a} times ${b}?`, vi: (a,b) => `${a} nhân ${b} bằng bao nhiêu?`} },
    ]
    
    const op = operations[Math.floor(Math.random() * operations.length)]
    let a = Math.floor(Math.random() * 10) + 1
    let b = Math.floor(Math.random() * 10) + 1
    
    if(op.symbol === '-' && a < b) [a, b] = [b, a]

    const answerNum = op.fn(a,b)
    const correctAnswer = String(answerNum)
    
    const choices = [correctAnswer, String(answerNum + 1), String(answerNum - 1), String(answerNum + 2)]
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .sort(() => Math.random() - 0.5)

    return {
      id: crypto.randomUUID(),
      questionUI: <div className="text-center text-7xl font-extrabold text-black">{a} {op.symbol} {b} = ?</div>,
      answer: correctAnswer,
      choices: choices,
      speakText: { en: op.text.en(a,b), vi: op.text.vi(a,b) }
    }
  }

  return (
    <GameEngine<string>
      title={{en: "Verbal Math", vi: "Toán Đọc"}}
      total={10}
      theme="orange"
      backRoute="/"
      generateQuestion={generateVerbalQuestion}
      getAnswerText={(a) => String(a)}
      lang={lang}
      speakQuestion={true}
    />
  )
}