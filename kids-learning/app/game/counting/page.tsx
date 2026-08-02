'use client'
import GameEngine from '@/components/core/GameEngine'
import { generateCountingQuestion } from '@/components/games/counting.logic'
import { useSearchParams } from 'next/navigation'
export default function CountingPage(){
  const lang = useSearchParams().get('lang') as 'en'|'vi' || 'en'
  return <GameEngine
    title={{en:'Counting', vi:'Đếm số'}}
    total={10}
    theme="green"
    backRoute="/"
    generateQuestion={generateCountingQuestion}
    getAnswerText={(a) => String(a)}
    lang={lang}
  />
}