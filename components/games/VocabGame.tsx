'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Confetti from '../Confetti'
import { vocabList } from '@/lib/vocab' // <-- TEĎ UŽ EXISTUJE
import { speak, sounds, setSoundLang } from '@/lib/sounds'
import { Baloo_2, Comic_Neue } from 'next/font/google'

const baloo = Baloo_2({ subsets: ['latin'], weight: ['800'] })
const comic = Comic_Neue({ subsets: ['latin'], weight: ['700'] })

export default function VocabGame(){
  const [num, setNum] = useState(1)
  const [word, setWord] = useState<any>(null)
  const [choices, setChoices] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<'correct'|'wrong'|null>(null)
  const [done, setDone] = useState(false)
  const [lang, setLang] = useState<'cs'|'en'|'vi'>('cs')
  const [muted, setMuted] = useState(false)
  const router = useRouter()
  const total = 10

  useEffect(()=>{
    setLang((localStorage.getItem('lang') as any)||'cs')
    setMuted(localStorage.getItem('muted') === 'true')
    setSoundLang((localStorage.getItem('lang') as any)||'cs')
    speechSynthesis.getVoices()
    window.speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices()
    gen()
  },[lang])

  useEffect(()=>{ if(done) speak(sounds.done[lang], muted) },[done])

  const gen = () => {
    const correct = vocabList[Math.floor(Math.random()*vocabList.length)]
    setWord(correct)
    let opts = [correct[lang]]
    while(opts.length < 4){
      const wrong = vocabList[Math.floor(Math.random()*vocabList.length)][lang]
      if(!opts.includes(wrong)) opts.push(wrong)
    }
    setChoices(opts.sort(()=>Math.random()-0.5))
    speak(correct[lang], muted)
  }

  const handleAnswer = (choice: string) => {
    if(feedback) return; speechSynthesis.cancel()
    if(choice === word[lang]){
      setScore(score+1); setFeedback('correct'); speak(sounds.correct[lang], muted)
      setTimeout(()=>{ if(num >= total) setDone(true); else { setNum(num+1); setFeedback(null); gen() } }, 1500)
    } else { setFeedback('wrong'); speak(sounds.wrong[lang], muted); setTimeout(()=>setFeedback(null), 1200) }
  }

  if(done) return (<div className={`${comic.className} min-h-screen bg-purple-100 flex items-center justify-center p-6`}><Confetti/><div className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-purple-300 text-center"><div className="text-6xl mb-4">🎉</div><h1 className={`${baloo.className} text-black text-5xl mb-2`}>{lang==='cs'?'Slovíčka':lang==='vi'?'Từ vựng':'Vocabulary'}</h1><p className="text-black text-3xl mb-6">{lang==='cs'?'Skóre':'Score'}: {score}/{total}</p><button onClick={()=>{setNum(1);setScore(0);setDone(false);gen()}} className="bg-purple-500 text-white px-8 py-4 rounded-2xl text-2xl font-extrabold mr-4">{lang==='cs'?'Hrát znovu':'Play Again'}</button><button onClick={()=>router.push('/')} className="bg-gray-700 text-white px-8 py-4 rounded-2xl text-2xl font-extrabold">{lang==='cs'?'Domů':'Home'}</button></div></div>)

  if(!word) return null

  return (
    <div className={`${comic.className} min-h-screen bg-purple-100 p-6`}>
      <div className="flex justify-between mb-6">
        <button onClick={()=>router.push('/')} className="bg-white text-black px-4 py-2 rounded-2xl shadow text-2xl font-bold">🏠 {lang==='cs'?'Zpět':'Back'}</button>
        <button onClick={()=>{const m=!muted;setMuted(m);localStorage.setItem('muted',String(m));if(m)speechSynthesis.cancel()}} className="bg-white text-black px-4 py-2 rounded-2xl shadow text-2xl">{muted?'🔇':'🔊'}</button>
      </div>
      <div className="max-w-3xl mx-auto">
        <h1 className={`${baloo.className} text-black text-5xl text-center mb-2`}>{lang==='cs'?'Slovíčka':lang==='vi'?'Từ vựng':'Vocabulary'}</h1>
        <p className="text-black text-center text-2xl mb-6 font-bold">{lang==='cs'?'Co je to na obrázku?':lang==='vi'?'Đây là gì?':'What is this?'}</p>
        <div className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-purple-300">
          <div className="flex justify-between mb-6">
            <p className="text-black text-2xl font-extrabold">{lang==='cs'?'Otázka':'Question'} {num}/{total}</p>
            <p className="text-black text-2xl font-extrabold">{lang==='cs'?'Skóre':'Score'}: {score}</p>
          </div>
          <img src={word.img} alt={word.en} className="w-72 h-72 object-contain mx-auto mb-8 rounded-2xl border-4 border-purple-200"/>
          <div className="grid grid-cols-2 gap-6">
            {choices.map(c => (
              <button key={c} onClick={()=>handleAnswer(c)} className={`py-6 rounded-2xl text-black text-3xl font-extrabold border-4 bg-purple-200 border-purple-400 hover:scale-105 shadow-md`}>
                {c}
              </button>
            ))}
          </div>
          {feedback && <p className="text-black text-center text-3xl mt-6 font-extrabold">{feedback==='correct'? (lang==='cs'?'Správně!':'Correct!') : (lang==='cs'?'Zkus to znovu':'Try again')}</p>}
        </div>
      </div>
    </div>
  )
}