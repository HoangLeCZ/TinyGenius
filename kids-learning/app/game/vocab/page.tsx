'use client'
import { useState, useEffect } from 'react'
import GameEngine, { GameQuestion } from '@/components/core/GameEngine'

export default function VocabPage() {
  const [lang, setLang] = useState<'en'|'vi'>('en') // REMOVE cs
  
  useEffect(()=>{ 
    setLang((localStorage.getItem('lang') as 'en'|'vi') || 'en'); // REMOVE cs
  }, [])

  const generateVocabQuestion = (): GameQuestion<string> => {
    return {
      id: crypto.randomUUID(),
      questionUI: <div className="text-center text-6xl">🐱</div>,
      answer: "cat",
      choices: ["cat", "dog", "bird", "fish"],
      itemName: {en: "cat", vi: "mèo"} // REMOVE cs
    }
  }

  return (
    <GameEngine<string>
      title={{en:'Vocabulary', vi:'Từ vựng'}} // REMOVE cs
      total={10}
      theme="purple"
      backRoute="/"
      generateQuestion={generateVocabQuestion}
      getAnswerText={(a) => String(a)}
      lang={lang}
    />
  )
}