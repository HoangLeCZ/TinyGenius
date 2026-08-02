'use client'
import GameEngine, { GameQuestion } from '@/components/core/GameEngine'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function CountingPage(){
  const searchParams = useSearchParams()
  const lang = (searchParams.get('lang') as 'en'|'vi') || 'en'

  const emojis = ['🍎', '🍌', '⭐', '🚗', '⚽', '🐶', '🌸', '🍓']
  const [currentEmoji, setCurrentEmoji] = useState(emojis[0])

  const generateCountingQuestion = (): GameQuestion<number> => {
    const count = Math.floor(Math.random() * 9) + 2 // 2 to 10
    const emoji = emojis[Math.floor(Math.random() * emojis.length)]
    setCurrentEmoji(emoji)

    const wrong1 = count + 1
    const wrong2 = count - 1
    const wrong3 = count + 2

    return {
      id: crypto.randomUUID(), // REQUIRED
      questionUI: (
        <div className="text-center">
          <div className="text-6xl mb-4 flex flex-wrap justify-center gap-2 max-w-md mx-auto">
            {Array.from({length: count}).map((_, i) => <span key={i}>{emoji}</span>)}
          </div>
        </div>
      ),
      answer: count,
      choices: [count, wrong1, wrong2, wrong3].filter(n => n > 0).sort(() => Math.random() - 0.5),
      itemName: {
        en: emoji === '🍎'? 'apple' : emoji === '🍌'? 'banana' : 'item',
        vi: emoji === '🍎'? 'quả táo' : emoji === '🍌'? 'quả chuối' : 'vật'
      }
    }
  }

  return (
    <GameEngine<number> // TELL IT <number>
      title={{en:'Counting', vi:'Đếm số'}}
      total={10}
      theme="green"
      backRoute="/"
      generateQuestion={generateCountingQuestion}
      getAnswerText={(a) => String(a)}
      lang={lang}
      speakQuestion={true}
    />
  )
}