'use client'
export const dynamic = 'force-dynamic' // <- ADD THIS

import { useState, useEffect } from 'react'
import GameEngine, { GameQuestion } from '@/components/core/GameEngine'
import { Suspense } from 'react' // <- ADD THIS

function VocabGame() {
  const [lang, setLang] = useState<'en'|'vi'>('en')
  
  useEffect(()=>{ 
    setLang((localStorage.getItem('lang') as 'en'|'vi') || 'en');
  }, [])

  const generateVocabQuestion = (): GameQuestion<string> => {
    const items = [
      {emoji: '🐱', en: "cat", vi: "mèo"},
      {emoji: '🐶', en: "dog", vi: "chó"},
      {emoji: '🐦', en: "bird", vi: "chim"},
      {emoji: '🐟', en: "fish", vi: "cá"},
    ]
    const item = items[Math.floor(Math.random() * items.length)]
    const choices = items.map(i => i.en).sort(() => Math.random() - 0.5)

    return {
      id: crypto.randomUUID(),
      questionUI: <div className="text-center text-8xl">{item.emoji}</div>,
      answer: item.en,
      choices: choices,
      itemName: {en: item.en, vi: item.vi},
      speakText: {en: `What animal is this?`, vi: `Đây là con gì?`}
    }
  }

  return (
    <GameEngine<string>
      title={{en:'Vocabulary', vi:'Từ vựng'}}
      total={10}
      theme="purple"
      backRoute="/"
      generateQuestion={generateVocabQuestion}
      getAnswerText={(a) => String(a)}
      lang={lang}
      speakQuestion={true}
    />
  )
}

export default function VocabPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-purple-100" />}>
      <VocabGame />
    </Suspense>
  )
}