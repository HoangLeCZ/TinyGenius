'use client'
import { useEffect, useState } from 'react'
import GameEngine from '@/components/core/GameEngine'
import { generateVocabQuestion, resetVocab } from '@/components/games/vocab.logic'
export default function VocabPage(){
  const [lang, setLang] = useState<'cs'|'en'|'vi'>('cs')
  useEffect(()=>{ setLang((localStorage.getItem('lang') as any)||'cs'); resetVocab() }, [])
  return <GameEngine title={{cs:'Slovíčka', en:'Vocabulary', vi:'Từ vựng'}} subtitle={{cs:'Vyber správný obrázek', en:'Pick the right picture', vi:'Chọn hình đúng'}} total={10} theme="purple" backRoute="/" generateQuestion={() => generateVocabQuestion(lang, 'all')} getAnswerText={(a) => String(a)} />
}