'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Confetti from '../Confetti'
import { Baloo_2, Comic_Neue } from 'next/font/google'
import { speak, sounds, setSoundLang } from '@/lib/sounds'

const baloo = Baloo_2({ subsets: ['latin'], weight: ['800'] })
const comic = Comic_Neue({ subsets: ['latin'], weight: ['700'] })

type Props = { mode: 'word', title: any, subtitle: any, total: number, bg: string, buttonColor: string }

export default function WordGame({title, subtitle, total, bg, buttonColor}: Props){
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
      () => { const n = Math.floor(Math.random()*4)+2; return { text: {cs:`Na farmě jsou ${n} slepice. Kolik mají celkem nohou?`, en:`There are ${n} chickens on the farm. How many legs total?`, vi:`Có ${n} con gà. Tổng cộng bao nhiêu cái chân?`}, ans: n*2 } },
      () => { const n = Math.floor(Math.random()*3)+2; return { text: {cs:`${n} pejskové si hrají. Kolik mají uší?`, en:`${n} puppies are playing. How many ears?`, vi:`${n} chú chó. Bao nhiêu cái tai?`}, ans: n*2 } },
      () => { const n = Math.floor(Math.random()*3)+1; return { text: {cs:`Vidíš ${n} pavouky. Kolik mají nohou?`, en:`You see ${n} spiders. How many legs?`, vi:`${n} con nhện. Bao nhiêu chân?`}, ans: n*8 } },
      () => { const n = Math.floor(Math.random()*3)+2; return { text: {cs:`Máme ${n} pizzy. V každé je 8 kousků. Kolik kousků celkem?`, en:`We have ${n} pizzas. 8 slices each. How many slices total?`, vi:`Có ${n} bánh pizza. Mỗi cái 8 miếng. Tổng bao nhiêu?`}, ans: n*8 } },
      () => { const n = Math.floor(Math.random()*10)+5; const m = Math.floor(Math.random()*4)+1; return { text: {cs:`Měl jsem ${n} kopečků zmrzliny. ${m} spadly. Kolik zbylo?`, en:`I had ${n} scoops of ice cream. ${m} fell. How many left?`, vi:`Có ${n} viên kem. Rơi ${m} viên. Còn lại?`}, ans: n-m } },
      () => { const a = Math.floor(Math.random()*10)+5; const b = Math.floor(Math.random()*10)+5; return { text: {cs:`V penálu mám ${a} tužek a ${b} per. Kolik psacích potřeb?`, en:`I have ${a} pencils and ${b} pens. How many writing tools?`, vi:`Có ${a} bút chì và ${b} bút mực. Tổng bao nhiêu?`}, ans: a+b } },
      () => { const n = Math.floor(Math.random()*5)+3; return { text: {cs:`Čtu ${n} stránky každý den. Za 2 dny kolik stránek?`, en:`I read ${n} pages every day. How many in 2 days?`, vi:`Đọc ${n} trang mỗi ngày. 2 ngày bao nhiêu?`}, ans: n*2 } },
      () => { return { text: {cs:`Ve třídě je 48 žáků. Rozdělíme je do skupin po 8. Kolik skupin?`, en:`There are 48 students. Split into groups of 8. How many groups?`, vi:`Có 48 học sinh. Chia nhóm 8 người. Bao nhiêu nhóm?`}, ans: 48/8 } },
      () => { const n = Math.floor(Math.random()*4)+2; return { text: {cs:`${n} krabice. V každé je 12 vajec. Kolik vajec celkem?`, en:`${n} boxes. 12 eggs in each. How many eggs total?`, vi:`${n} hộp. Mỗi hộp 12 quả trứng. Tổng bao nhiêu?`}, ans: n*12 } },
      () => { const n = Math.floor(Math.random()*3)+2; return { text: {cs:`Přiletěli ${n} mimozemšťané. Každý má 3 oči. Kolik očí?`, en:`${n} aliens landed. Each has 3 eyes. How many eyes?`, vi:`${n} người ngoài hành tinh. Mỗi người 3 mắt. Bao nhiêu mắt?`}, ans: n*3 } },
      () => { const n = Math.floor(Math.random()*4)+2; return { text: {cs:`Postavil jsem ${n} roboty. Každý má 2 ruce a 2 nohy. Kolik končetin?`, en:`I built ${n} robots. 2 arms and 2 legs each. How many limbs?`, vi:`Chế tạo ${n} robot. Mỗi con 2 tay 2 chân. Bao nhiêu chi?`}, ans: n*4 } },
      () => { const n = Math.floor(Math.random()*20)+10; return { text: {cs:`Sarah měla ${n} jablek. Dala 8 kamarádovi. Kolik jí zbylo?`, en:`Sarah had ${n} apples. She gave 8 to a friend. How many left?`, vi:`Sarah có ${n} quả táo. Cho bạn 8 quả. Còn lại?`}, ans: n-8 } },
      () => { return { text: {cs:`Lisa koupila 3 knihy po $10 a 2 časopisy po $5. Kolik utratila?`, en:`Lisa bought 3 books for $10 and 2 magazines for $5. How much total?`, vi:`Lisa mua 3 sách \$10 và 2 tạp chí \$5. Tổng bao nhiêu?`}, ans: 3*10 + 2*5 } },
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
    let opts = [problem.ans]; while(opts.length < 4){ const wrong = problem.ans + Math.floor(Math.random()*10)-5; if(wrong > 0 &&!opts.includes(wrong)) opts.push(wrong) }
    setChoices(opts.sort(()=>Math.random()-0.5)); speak(problem.text[lang], muted)
  }

  const handleAnswer = (choice: number) => {
    if(feedback) return; speechSynthesis.cancel()
    if(choice === answer){
      setScore(score+1); setFeedback('correct'); speak(sounds.correct[lang], muted)
      setTimeout(()=>{ if(num >= total) setDone(true); else { setNum(num+1); setFeedback(null); gen() } }, 1500)
    } else { setFeedback('wrong'); speak(sounds.wrong[lang], muted); setTimeout(()=>setFeedback(null), 1200) }
  }

  if(done) return (<div className={`${comic.className} min-h-screen ${bg} flex items-center justify-center p-6`}><Confetti/><div className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-purple-300 text-center"><div className="text-6xl mb-4">🎉</div><h1 className={`${baloo.className} text-black text-5xl mb-2`}>{title[lang]}</h1><p className="text-black text-3xl mb-6">{lang==='cs'?'Skóre':'Score'}: {score}/{total}</p><button onClick={()=>{initQuestionPool();setNum(1);setScore(0);setDone(false);gen()}} className={`${buttonColor} text-white px-8 py-4 rounded-2xl text-2xl font-extrabold mr-4`}>{lang==='cs'?'Hrát znovu':'Play Again'}</button><button onClick={()=>router.push('/')} className="bg-gray-700 text-white px-8 py-4 rounded-2xl text-2xl font-extrabold">{lang==='cs'?'Domů':'Home'}</button></div></div>)

  return (<div className={`${comic.className} min-h-screen ${bg} p-6`}><div className="flex justify-between mb-6"><button onClick={()=>router.push('/')} className="bg-white text-black px-4 py-2 rounded-2xl shadow text-2xl font-bold">🏠 {lang==='cs'?'Zpět':'Back'}</button><button onClick={()=>{const m=!muted;setMuted(m);localStorage.setItem('muted',String(m));if(m)speechSynthesis.cancel()}} className="bg-white text-black px-4 py-2 rounded-2xl shadow text-2xl">{muted?'🔇':'🔊'}</button></div><div className="max-w-3xl mx-auto"><h1 className={`${baloo.className} text-black text-5xl text-center mb-2`}>{title[lang]}</h1><p className="text-black text-center text-2xl mb-6 font-bold">{subtitle[lang]}</p><div className="bg-amber-50 rounded-3xl p-10 shadow-2xl border-4 border-amber-300"><div className="flex justify-between mb-6"><p className="text-black text-2xl font-extrabold">{lang==='cs'?'Otázka':'Question'} {num}/{total}</p><p className="text-black text-2xl font-extrabold">{lang==='cs'?'Skóre':'Score'}: {score}</p></div><div className={`${comic.className} text-black text-4xl md:text-5xl text-center mb-10 min-h-[120px] flex items-center justify-center leading-tight`}>{question}</div><div className="grid grid-cols-2 gap-6">{choices.map(c => (<button key={c} onClick={()=>handleAnswer(c)} className={`py-8 rounded-2xl text-black text-4xl font-extrabold border-4 bg-amber-200 border-amber-500 hover:scale-105 shadow-md`}>{c}</button>))}</div>{feedback && <p className="text-black text-center text-3xl mt-6 font-extrabold">{feedback==='correct'? (lang==='cs'?'Správně!':'Correct!') : (lang==='cs'?'Zkus to znovu':'Try again')}</p>}</div></div></div>)
}