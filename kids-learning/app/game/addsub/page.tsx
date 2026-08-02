'use client'
export const dynamic = 'force-dynamic' // <- STOPS PRERENDER
import GameEngine, { GameQuestion } from '@/components/core/GameEngine'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AddSubGame() {
  const searchParams = useSearchParams()
  const lang = (searchParams.get('lang') as 'en'|'vi') || 'en'

  // FIX: add async and Promise<>
  const generateAddSubQuestion = async (): Promise<GameQuestion<number>> => {
    const isAdd = Math.random() > 0.5
    let a = Math.floor(Math.random() * 10) + 1
    let b = Math.floor(Math.random() * 10) + 1
    if(!isAdd && a < b) [a, b] = [b, a]
    const answer = isAdd? a + b : a - b
    const symbol = isAdd? '+' : '-'

    // make sure 4 unique choices
    const choicesSet = new Set<number>([answer])
    while(choicesSet.size < 4){
      choicesSet.add(Math.max(0, answer + Math.floor(Math.random() * 5) - 2))
    }
    const choices = Array.from(choicesSet).sort(() => Math.random() - 0.5)

    return {
      id: crypto.randomUUID(),
      questionUI: <div className="text-center text-7xl font-extrabold text-black">{a} {symbol} {b} =?</div>,
      answer: answer,
      choices: choices,
      speakText: {
        en: isAdd? `What is ${a} plus ${b}?` : `What is ${a} minus ${b}?`,
        vi: isAdd? `${a} cộng ${b} bằng bao nhiêu?` : `${a} trừ ${b} bằng bao nhiêu?`
      }
    }
  }

  return (
    <GameEngine<number>
      title={{en: "Add & Subtract", vi: "Cộng & Trừ"}}
      total={10}
      theme="green"
      backRoute="/"
      generateQuestion={generateAddSubQuestion} // no error now
      getAnswerText={(a) => String(a)}
      lang={lang}
      speakQuestion={true}
    />
  )
}

export default function AddSubPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-green-100" />}>
      <AddSubGame />
    </Suspense>
  )
}