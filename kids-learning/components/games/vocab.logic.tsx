'use client'
import { vocabData } from '@/lib/data/vocab.data'
import React from 'react'
let used: string[] = []
export const resetVocab = () => { used = [] }
export const generateVocabQuestion = (lang: 'cs'|'en'|'vi', category: string) => {
  const pool = category === 'all'? vocabData : vocabData.filter(w => w.category === category)
  let available = pool.filter(w =>!used.includes(w.en))
  if(available.length === 0) { used = []; available = pool }
  const correct = available[Math.floor(Math.random()*available.length)]
  used.push(correct.en)
  const answer = correct[lang]
  let choices = [answer]
  while(choices.length < 4){
    const wrong = pool[Math.floor(Math.random()*pool.length)][lang]
    if(!choices.includes(wrong)) choices.push(wrong)
  }
  return { id: correct.en, questionUI: <img src={correct.img} alt={correct.en} className="w-72 h-72 object-contain mx-auto rounded-2xl border-4 border-purple-200 bg-purple-50"/>, answer, choices: choices.sort(() => Math.random() - 0.5) }
}