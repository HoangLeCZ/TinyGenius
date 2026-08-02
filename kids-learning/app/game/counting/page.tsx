'use client'
export const dynamic = 'force-dynamic' // <- 1. ADD THIS
import GameEngine, { GameQuestion } from '@/components/core/GameEngine'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react' // <- 2. ADD THIS

const emojis = ['🍎', '🍌', '⭐', '🚗', '⚽', '🐶', '🌸', '🍓']

function CountingGame(){
  const searchParams = useSearchParams()
  const lang = (searchParams.get('lang') as 'en'|'vi') || 'en'

  // FIX: add async and Promise<>
  const generateCountingQuestion = async (): Promise<GameQuestion<number>> => {
    const count = Math.floor(Math.random() * 9) + 2
    const emoji = emojis[Math.floor(Math.random() * emojis.length)]

    // make sure choices are unique
    const choicesSet = new Set<number>([count])
    while(choicesSet.size < 4){
      choicesSet.add(Math.max(1, count + Math.floor(Math.random() * 5) - 2))
    }
    const choices = Array.from(choicesSet).sort(() => Math.random() - 0.5)

    const emojiNameEn = emoji === '🍎'? 'apple' : emoji === '🍌'? 'banana' : emoji === '⭐'? 'star' : emoji === '🚗'? 'car' : emoji === '⚽'? 'ball' : emoji === '🐶'? 'dog' : emoji === '🌸'? 'flower' : emoji === '🍓'? 'strawberry' : 'item'
    const emojiNameVi = emoji === '🍎'? 'quả táo' : emoji === '🍌'? 'quả chuối' : emoji === '⭐'? 'ngôi sao' : emoji === '🚗'? 'ô tô' : emoji === '⚽'? 'quả bóng' : emoji === '🐶'? 'con chó' : emoji === '🌸'? 'bông hoa' : emoji === '🍓'? 'quả dâu' : 'vật'

    return {
      id: crypto.randomUUID(),
      questionUI: (
        <div className="text-center">
          <div className="text-6xl mb-4 flex flex-wrap justify-center gap-3 max-w-lg mx-auto">
            {Array.from({length: count}).map((_, i) => <span key={i}>{emoji}</span>)}
          </div>
        </div>
      ),
      answer: count,
      choices: choices,
      itemName: { en: emojiNameEn, vi: emojiNameVi },
      speakText: {
        en: `How many ${emojiNameEn}s are there?`,
        vi: `Có bao nhiêu ${emojiNameVi}?`
      }
    }
  }

  return (
    <GameEngine<number>
      title={{en:'Counting', vi:'Đếm số'}}
      total={10}
      theme="green"
      backRoute="/"
      generateQuestion={generateCountingQuestion} // no error now
      getAnswerText={(a) => String(a)}
      lang={lang}
      speakQuestion={true}
    />
  )
}

export default function CountingPage(){ // <- 3. WRAP IN SUSPENSE
  return (
    <Suspense fallback={<div className="min-h-screen bg-green-100" />}>
      <CountingGame />
    </Suspense>
  )
}