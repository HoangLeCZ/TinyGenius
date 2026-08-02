'use client'
export const dynamic = 'force-dynamic' // STOPS PRERENDER CRASH
import GameEngine, { GameQuestion } from '@/components/core/GameEngine'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function MultiDivGame(){
  const searchParams = useSearchParams()
  const lang = (searchParams.get('lang') as 'en'|'vi') || 'en'

  // FIX: pridal jsem async a Promise<GameQuestion<number>>
  const generateMultiDivQuestion = async (): Promise<GameQuestion<number>> => {
    const isMultiply = Math.random() > 0.5
    let a = Math.floor(Math.random() * 10) + 1
    let b = Math.floor(Math.random() * 10) + 1
    const answer = isMultiply? a * b : a
    if(!isMultiply) a = answer * b // make sure division is clean: 12 / 3 = 4
    const symbol = isMultiply? '×' : '÷'

    // lepsí choices bez duplikátů
    const choicesSet = new Set<number>([answer])
    while(choicesSet.size < 4){
      choicesSet.add(Math.max(1, answer + Math.floor(Math.random() * 5) - 2))
    }
    const choices = Array.from(choicesSet).sort(() => Math.random() - 0.5)

    return {
      id: crypto.randomUUID(),
      questionUI: <div className="text-center text-7xl font-extrabold text-black">{a} {symbol} {b} =?</div>,
      answer: answer,
      choices: choices,
      speakText: {
        en: isMultiply? `What is ${a} times ${b}?` : `What is ${a} divided by ${b}?`,
        vi: isMultiply? `${a} nhân ${b} bằng bao nhiêu?` : `${a} chia ${b} bằng bao nhiêu?`
      }
    }
  }

  return (
    <GameEngine<number>
      title={{en:'Multiply & Divide', vi:'Nhân & Chia'}}
      total={10}
      theme="purple"
      backRoute="/"
      generateQuestion={generateMultiDivQuestion} // uz bez erroru
      getAnswerText={(a) => String(a)}
      lang={lang}
      speakQuestion={true}
    />
  )
}

export default function MultiDivPage(){
  return (
    <Suspense fallback={<div className="min-h-screen bg-purple-100" />}>
      <MultiDivGame />
    </Suspense>
  )
}