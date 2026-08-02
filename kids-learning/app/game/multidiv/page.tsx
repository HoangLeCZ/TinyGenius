'use client'
import GameEngine from '@/components/core/GameEngine'
import { generateMultiDivQuestion } from '@/components/games/multidiv.logic'
import { useSearchParams } from 'next/navigation'
export default function MultiDivPage(){
  const lang = useSearchParams().get('lang') as 'en'|'vi' || 'en'
  return <GameEngine
    title={{en:'Multiply & Divide', vi:'Nhân & Chia'}}
    total={10}
    theme="purple"
    backRoute="/"
    generateQuestion={generateMultiDivQuestion}
    getAnswerText={(a) => String(a)}
    lang={lang}
    speakQuestion={true}
  />
}