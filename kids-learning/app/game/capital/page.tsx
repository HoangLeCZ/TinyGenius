'use client'
export const dynamic = 'force-dynamic'
import WorldEngine, { WorldQuestion } from '@/components/core/WorldEngine'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'

type Country = {
  name: { en: string, vi: string }
  capital: { en: string, vi: string }
}

function CapitalGame() {
  const searchParams = useSearchParams()
  const lang = (searchParams.get('lang') as 'en'|'vi') || 'en'
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)

  const FALLBACK_COUNTRIES: Country[] = [
    {name: {en: 'Vietnam', vi: 'Việt Nam'}, capital: {en: 'Hanoi', vi: 'Hà Nội'}},
    {name: {en: 'China', vi: 'Trung Quốc'}, capital: {en: 'Beijing', vi: 'Bắc Kinh'}},
    {name: {en: 'Japan', vi: 'Nhật Bản'}, capital: {en: 'Tokyo', vi: 'Tokyo'}},
    {name: {en: 'South Korea', vi: 'Hàn Quốc'}, capital: {en: 'Seoul', vi: 'Seoul'}},
    {name: {en: 'India', vi: 'Ấn Độ'}, capital: {en: 'New Delhi', vi: 'New Delhi'}},
    {name: {en: 'Thailand', vi: 'Thái Lan'}, capital: {en: 'Bangkok', vi: 'Bangkok'}},
    {name: {en: 'France', vi: 'Pháp'}, capital: {en: 'Paris', vi: 'Paris'}},
    {name: {en: 'Germany', vi: 'Đức'}, capital: {en: 'Berlin', vi: 'Berlin'}},
    {name: {en: 'United Kingdom', vi: 'Vương quốc Anh'}, capital: {en: 'London', vi: 'London'}},
    {name: {en: 'Italy', vi: 'Ý'}, capital: {en: 'Rome', vi: 'Rome'}},
    {name: {en: 'Spain', vi: 'Tây Ban Nha'}, capital: {en: 'Madrid', vi: 'Madrid'}},
    {name: {en: 'USA', vi: 'Hoa Kỳ'}, capital: {en: 'Washington, D.C.', vi: 'Washington D.C'}},
    {name: {en: 'Canada', vi: 'Canada'}, capital: {en: 'Ottawa', vi: 'Ottawa'}},
    {name: {en: 'Mexico', vi: 'Mexico'}, capital: {en: 'Mexico City', vi: 'Mexico City'}},
    {name: {en: 'Brazil', vi: 'Brazil'}, capital: {en: 'Brasília', vi: 'Brasília'}},
    {name: {en: 'Argentina', vi: 'Argentina'}, capital: {en: 'Buenos Aires', vi: 'Buenos Aires'}},
    {name: {en: 'Australia', vi: 'Úc'}, capital: {en: 'Canberra', vi: 'Canberra'}},
    {name: {en: 'Egypt', vi: 'Ai Cập'}, capital: {en: 'Cairo', vi: 'Cairo'}},
    {name: {en: 'South Africa', vi: 'Nam Phi'}, capital: {en: 'Pretoria', vi: 'Pretoria'}},
    {name: {en: 'Turkey', vi: 'Thổ Nhĩ Kỳ'}, capital: {en: 'Ankara', vi: 'Ankara'}},
  ]

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,capital')
        if(!res.ok) throw new Error('API failed')
        const data = await res.json()

        const formatted: Country[] = data
         .filter((c: any) => c.capital?.[0])
         .slice(0, 60)
         .map((c: any) => ({
            name: { en: c.name.common, vi: c.name.common }, // fallback to EN
            capital: { en: c.capital[0], vi: c.capital[0] }
          }))
        setCountries(formatted.length > 10? formatted : FALLBACK_COUNTRIES)
      } catch (e) {
        console.warn('API failed, using fallback', e)
        setCountries(FALLBACK_COUNTRIES)
      } finally {
        setLoading(false)
      }
    }
    fetchCountries()
  }, [])

  const generateCapitalQuestion = async (): Promise<WorldQuestion<string>> => {
    const pool = countries.length > 10? countries : FALLBACK_COUNTRIES // safety
    const correct = pool[Math.floor(Math.random() * pool.length)]

    // remove duplicates and the correct answer
    const wrongs = pool
     .filter(c => c.capital.en!== correct.capital.en)
     .sort(() => 0.5 - Math.random())
     .slice(0,3)

    const choices = [correct.capital[lang],...wrongs.map(w => w.capital[lang])]
     .filter((v,i,a)=>a.indexOf(v)===i) // remove duplicate capitals
     .sort(() => 0.5 - Math.random())

    return {
      id: crypto.randomUUID(),
      questionUI: (
        <div className="flex justify-center items-center mb-8 flex-col gap-4">
          <div className="text-8xl">🌍</div>
          <h3 className="text-5xl font-extrabold text-black text-center px-4">
            {lang==='en'? `Capital of ${correct.name.en}?` : `Thủ đô của ${correct.name.vi} là gì?`}
          </h3>
        </div>
      ),
      answer: correct.capital[lang],
      choices: choices,
      fact: {
        en: `${correct.name.en}'s capital is ${correct.capital.en}`,
        vi: `Thủ đô của ${correct.name.vi} là ${correct.capital.vi}`
      },
      speakText: {
        en: `What is the capital of ${correct.name.en}?`,
        vi: `Thủ đô của ${correct.name.vi} là gì?`
      }
    }
  }

  if(loading) {
    return <div className="min-h-screen flex items-center justify-center bg-blue-100 text-5xl font-bold">Loading...</div>
  }

  return (
    <WorldEngine<string>
      title={{en: "World Capitals", vi: "Thủ Đô Thế Giới"}}
      total={10}
      theme="blue"
      backRoute="/"
      generateQuestion={generateCapitalQuestion}
      getAnswerText={(a) => a}
      lang={lang}
    />
  )
}

export default function CapitalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-blue-100" />}>
      <CapitalGame />
    </Suspense>
  )
}