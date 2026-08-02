'use client'
import GameEngine from '@/components/core/GameEngine'
import { generateAddSubQuestion } from '@/components/games/addsub.logic'
import { useSearchParams } from 'next/navigation'
export default function AddSubPage(){
  const lang = useSearchParams().get('lang') as 'en'|'vi' || 'en'
  return <GameEngine
    title={{en:'Add & Subtract', vi:'Cộng & Trừ'}}
    total={10}
    theme="blue"
    backRoute="/"
    generateQuestion={generateAddSubQuestion}
    getAnswerText={(a) => String(a)}
    lang={lang}
    speakQuestion={true} // NEW
  />
}