'use client'
export const dynamic = 'force-dynamic'
import { useSearchParams } from 'next/navigation'
import GameEngine, { GameQuestion } from '@/components/core/GameEngine'
import { Suspense } from 'react'

function VerbalGame() {
  const searchParams = useSearchParams()
  const lang = (searchParams.get('lang') as 'en' | 'vi') || 'en'

  const templates = [
    {
      en: (a: number, b: number) => `Sara has ${a} apples. She buys ${b} more. How many apples does she have in total?`,
      vi: (a: number, b: number) => `Sara có ${a} quả táo. Cô ấy mua thêm ${b} quả nữa. Hỏi Sara có tất cả bao nhiêu quả táo?`,
      calc: (a: number, b: number) => a + b
    },
    {
      en: (a: number, b: number) => `There were ${a} birds on a tree. ${b} birds flew away. How many are left?`,
      vi: (a: number, b: number) => `Có ${a} con chim trên cây. ${b} con bay đi. Hỏi còn lại bao nhiêu con?`,
      calc: (a: number, b: number) => a - b
    },
    {
      en: (a: number, b: number) => `Each box has ${a} pencils. There are ${b} boxes. How many pencils in total?`,
      vi: (a: number, b: number) => `Mỗi hộp có ${a} cây bút chì. Có ${b} hộp. Hỏi có tất cả bao nhiêu cây bút chì?`,
      calc: (a: number, b: number) => a * b
    },
  ]

  // FIX: pridat async a Promise<>
  const generateVerbalQuestion = async (): Promise<GameQuestion<string>> => {
    const t = templates[Math.floor(Math.random() * templates.length)]
    let a = Math.floor(Math.random() * 9) + 2
    let b = Math.floor(Math.random() * 9) + 2
    if (t.calc === templates[1].calc && a < b) [a, b] = [b, a]

    const answerNum = t.calc(a, b)
    const correctAnswer = String(answerNum)

    const wrongAnswers = new Set<string>()
    while(wrongAnswers.size < 3){
      const wrong = answerNum + Math.floor(Math.random() * 5) - 2
      if(wrong >= 0 && wrong!== answerNum) wrongAnswers.add(String(wrong))
    }

    const choices = [correctAnswer,...Array.from(wrongAnswers)].sort(() => Math.random() - 0.5)

    return {
      id: Date.now().toString() + Math.random(),
      questionUI: <div className="text-center text-2xl font-bold text-black px-4 leading-relaxed max-w-2xl mx-auto">{lang === 'en'? t.en(a,b) : t.vi(a,b)}</div>,
      answer: correctAnswer,
      choices: choices,
      speakText: { en: t.en(a,b), vi: t.vi(a,b) }
    }
  }

  return (
    <GameEngine<string>
      title={{en: "Verbal Math", vi: "Toán Đọc"}}
      total={10}
      theme="orange"
      backRoute="/"
      generateQuestion={generateVerbalQuestion} // uz bez erroru
      getAnswerText={(a) => String(a)}
      lang={lang}
      speakQuestion={true}
      showSubtitle={false}
    />
  )
}

export default function VerbalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-orange-100 flex items-center justify-center">Loading...</div>}>
      <VerbalGame />
    </Suspense>
  )
}