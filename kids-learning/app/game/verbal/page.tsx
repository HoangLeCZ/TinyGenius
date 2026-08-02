'use client'
import GameEngine from '@/components/core/GameEngine'
import { generateVerbalQuestion } from '@/components/games/verbal.logic'
import { useSearchParams } from 'next/navigation'
export default function VerbalPage(){
  const lang = useSearchParams().get('lang') as 'en'|'vi' || 'en'
  return <GameEngine
    title={{en:'Verbal Math', vi:'Toán lời văn'}}
    total={10}
    theme="orange"
    backRoute="/"
    generateQuestion={generateVerbalQuestion}
    getAnswerText={(a) => String(a)}
    lang={lang}
    speakQuestion={true}
    secondsPerQuestion={30} // NEW: 30 seconds for reading
  />
}