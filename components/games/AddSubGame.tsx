'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Confetti from '../Confetti'
import { Baloo_2, Comic_Neue } from 'next/font/google'
import { speak, sounds, setSoundLang } from '@/lib/sounds'

const baloo = Baloo_2({ subsets: ['latin'], weight: ['800'] })
const comic = Comic_Neue({ subsets: ['latin'], weight: ['700'] })

type Props = { mode: 'addsub', title: any, subtitle: any, total: number, bg: string, buttonColor: string }

export default function AddSubGame({title, subtitle, total, bg, buttonColor}: Props){
  const [num, setNum] = useState(1)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<number|null>(null)
  const [choices, setChoices] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<'correct'|'wrong'|null>(null)
  const [done, setDone] = useState(false)
  const [lang, setLang] = useState<'cs'|'en'|'vi'>('cs')
  const [muted, setMuted] = useState(false)
  const router = useRouter()
  const questionPoolRef = useRef<(() => any)[]>([])
  const usedIndexesRef = useRef<number[]>([])

  useEffect(()=>{
    setLang((localStorage.getItem('lang') as any)||'cs')
    setMuted(localStorage.getItem('muted') === 'true')
    setSoundLang((localStorage.getItem('lang') as any)||'cs')
    initQuestionPool()
    speechSynthesis.getVoices()
    window.speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices()
  },[])

  useEffect(()=>{ setSoundLang(lang); initQuestionPool(); setNum(1); setScore(0); setDone(false); gen() },[lang])
  useEffect(()=>{ if(done) speak(sounds.done[lang], muted) },[done])

  const initQuestionPool = () => {
    const templates: (() => any)[] = [
      () => { const a = Math.floor(Math.random()*10)+1; const b = Math.floor(Math.random()*10)+1; return { text: {cs:`${a} + ${b} =?`, en:`${a} + ${b} =?`, vi:`${a} + ${b} =?`}, ans: a+b } },
      () => { const a = Math.floor(Math.random()*15)+10; const b = Math.floor(Math.random()*9)+1; return { text: {cs:`${a} - ${b} =?`, en:`${a} - ${b} =?`, vi:`${a} - ${b} =?`}, ans: a-b } },
      () => { const a = Math.floor(Math.random()*5)+1; const b = Math.floor(Math.random()*5)+1; return { text: {cs:`${a} + ${b} + ${a} =?`, en:`${a} + ${b} + ${a} =?`, vi:`${a} + ${b} + ${a} =?`}, ans: a+b+a } },
    ]
    questionPoolRef.current = templates.sort(() => Math.random() - 0.5)
    usedIndexesRef.current = []
  }

  const gen = () => {
    let nextIndex = usedIndexesRef.current.length
    if(nextIndex >= questionPoolRef.current.length) { initQuestionPool(); nextIndex = 0 }
    usedIndexesRef.current.push(nextIndex)
    const problem = questionPoolRef.current[nextIndex]()
    setAnswer(problem.ans); setQuestion(problem.text[lang])
    let opts = [problem.ans]; while(opts.length < 4){ const wrong = problem.ans + Math.floor(Math.random()*6)-3; if(wrong >= 0 &&!opts.includes(wrong)) opts.push(wrong) }
    setChoices(opts.sort(()=>Math.random()-0.5)); speak(problem.text[lang], muted)
  }

  const handleAnswer = (choice: number) => {
    if(feedback) return; speechSynthesis.cancel()
    if(choice === answer){
      setScore(score+1); setFeedback('correct'); speak(sounds.correct[lang], muted)
      setTimeout(()=>{ if(num >= total) setDone(true); else { setNum(num+1); setFeedback(null); gen() } }, 1500)
    } else { setFeedback('wrong'); speak(sounds.wrong[lang], muted); setTimeout(()=>setFeedback(null), 1200) }
  }

  if(done) return (<div className={`${comic.className} min-h-screen ${bg} flex items-center justify-center p-6`}><Confetti/><div className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-blue-300 text-center"><div className="text-6xl mb-4">🎉</div><h1 className={`${baloo.className} text-black text-5xl mb-2`}>{title[lang]}</h1><p className="text-black text-3xl mb-6">{lang==='cs'?'Skóre':'Score'}: {score}/{total}</p><button onClick={()=>{initQuestionPool();setNum(1);setScore(0);setDone(false);gen()}} className={`${buttonColor} text-white px-8 py-4 rounded-2xl text-2xl font-extrabold mr-4`}>{lang==='cs'?'Hrát znovu':'Play Again'}</button><button onClick={()=>router.push('/')} className="bg-gray-700 text-white px-8 py-4 rounded-2xl text-2xl font-extrabold">{lang==='cs'?'Domů':'Home'}</button></div></div>)

  return (<div className={`${comic.className} min-h-screen ${bg} p-6`}><div className="flex justify-between mb-6"><button onClick={()=>router.push('/')} className="bg-white text-black px-4 py-2 rounded-2xl shadow text-2xl font-bold">🏠 {lang==='cs'?'Zpět':'Back'}</button><button onClick={()=>{const m=!muted;setMuted(m);localStorage.setItem('muted',String(m));if(m)speechSynthesis.cancel()}} className="bg-white text-black px-4 py-2 rounded-2xl shadow text-2xl">{muted?'🔇':'🔊'}</button></div><div className="max-w-3xl mx-auto"><h1 className={`${baloo.className} text-black text-5xl text-center mb-2`}>{title[lang]}</h1><p className="text-black text-center text-2xl mb-6 font-bold">{subtitle[lang]}</p><div className="bg-blue-50 rounded-3xl p-10 shadow-2xl border-4 border-blue-300"><div className="flex justify-between mb-6"><p className="text-black text-2xl font-extrabold">{lang==='cs'?'Otázka':'Question'} {num}/{total}</p><p className="text-black text-2xl font-extrabold">{lang==='cs'?'Skóre':'Score'}: {score}</p></div><div className={`${comic.className} text-black text-5xl md:text-6xl text-center mb-10 min-h-[120px] flex items-center justify-center leading-tight`}>{question}</div><div className="grid grid-cols-2 gap-6">{choices.map(c => (<button key={c} onClick={()=>handleAnswer(c)} className={`py-8 rounded-2xl text-black text-4xl font-extrabold border-4 bg-blue-200 border-blue-500 hover:scale-105 shadow-md`}>{c}</button>))}</div>{feedback && <p className="text-black text-center text-3xl mt-6 font-extrabold">{feedback==='correct'? (lang==='cs'?'Správně!':'Correct!') : (lang==='cs'?'Zkus to znovu':'Try again')}</p>}</div></div></div>)
}