'use client'
export const dynamic = 'force-dynamic'
import WorldEngine, { WorldQuestion } from '@/components/core/WorldEngine'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

// Add more countries here. code = flagcdn code
const COUNTRIES = [
  // ASIA - 10
  {name: {en: 'Vietnam', vi: 'Việt Nam'}, code: 'vn', fact: {en: 'Capital is Hanoi', vi: 'Thủ đô là Hà Nội'}},
  {name: {en: 'China', vi: 'Trung Quốc'}, code: 'cn', fact: {en: 'Has the Great Wall', vi: 'Có Vạn Lý Trường Thành'}},
  {name: {en: 'Japan', vi: 'Nhật Bản'}, code: 'jp', fact: {en: 'Capital is Tokyo', vi: 'Thủ đô là Tokyo'}},
  {name: {en: 'South Korea', vi: 'Hàn Quốc'}, code: 'kr', fact: {en: 'Famous for K-Pop', vi: 'Nổi tiếng với K-Pop'}},
  {name: {en: 'India', vi: 'Ấn Độ'}, code: 'in', fact: {en: 'Has the Taj Mahal', vi: 'Có đền Taj Mahal'}},
  {name: {en: 'Thailand', vi: 'Thái Lan'}, code: 'th', fact: {en: 'Famous for elephants', vi: 'Nổi tiếng với voi'}},
  {name: {en: 'Indonesia', vi: 'Indonesia'}, code: 'id', fact: {en: 'Largest island country', vi: 'Quốc gia đảo lớn nhất'}},
  {name: {en: 'Philippines', vi: 'Philippines'}, code: 'ph', fact: {en: 'Has over 7,000 islands', vi: 'Có hơn 7.000 hòn đảo'}},
  {name: {en: 'Saudi Arabia', vi: 'Ả Rập Saudi'}, code: 'sa', fact: {en: 'Capital is Riyadh', vi: 'Thủ đô là Riyadh'}},
  {name: {en: 'Turkey', vi: 'Thổ Nhĩ Kỳ'}, code: 'tr', fact: {en: 'Between Europe and Asia', vi: 'Giữa châu Âu và châu Á'}},
  
  // EUROPE - 10
  {name: {en: 'France', vi: 'Pháp'}, code: 'fr', fact: {en: 'Capital is Paris', vi: 'Thủ đô là Paris'}},
  {name: {en: 'Germany', vi: 'Đức'}, code: 'de', fact: {en: 'Capital is Berlin', vi: 'Thủ đô là Berlin'}},
  {name: {en: 'United Kingdom', vi: 'Vương quốc Anh'}, code: 'gb', fact: {en: 'Famous for Big Ben', vi: 'Nổi tiếng với Big Ben'}},
  {name: {en: 'Italy', vi: 'Ý'}, code: 'it', fact: {en: 'Famous for pizza', vi: 'Nổi tiếng với pizza'}},
  {name: {en: 'Spain', vi: 'Tây Ban Nha'}, code: 'es', fact: {en: 'Capital is Madrid', vi: 'Thủ đô là Madrid'}},
  {name: {en: 'Portugal', vi: 'Bồ Đào Nha'}, code: 'pt', fact: {en: 'Capital is Lisbon', vi: 'Thủ đô là Lisbon'}},
  {name: {en: 'Greece', vi: 'Hy Lạp'}, code: 'gr', fact: {en: 'Famous for ancient ruins', vi: 'Nổi tiếng với di tích cổ'}},
  {name: {en: 'Poland', vi: 'Ba Lan'}, code: 'pl', fact: {en: 'Capital is Warsaw', vi: 'Thủ đô là Warsaw'}},
  {name: {en: 'Netherlands', vi: 'Hà Lan'}, code: 'nl', fact: {en: 'Famous for windmills', vi: 'Nổi tiếng với cối xay gió'}},
  {name: {en: 'Switzerland', vi: 'Thụy Sĩ'}, code: 'ch', fact: {en: 'Famous for chocolate', vi: 'Nổi tiếng với sô cô la'}},
  
  // AMERICAS - 10
  {name: {en: 'USA', vi: 'Hoa Kỳ'}, code: 'us', fact: {en: 'Capital is Washington D.C', vi: 'Thủ đô là Washington D.C'}},
  {name: {en: 'Canada', vi: 'Canada'}, code: 'ca', fact: {en: 'Famous for maple leaves', vi: 'Nổi tiếng với lá phong'}},
  {name: {en: 'Mexico', vi: 'Mexico'}, code: 'mx', fact: {en: 'Famous for tacos', vi: 'Nổi tiếng với món taco'}},
  {name: {en: 'Brazil', vi: 'Brazil'}, code: 'br', fact: {en: 'Largest in South America', vi: 'Lớn nhất Nam Mỹ'}},
  {name: {en: 'Argentina', vi: 'Argentina'}, code: 'ar', fact: {en: 'Famous for tango', vi: 'Nổi tiếng với tango'}},
  {name: {en: 'Colombia', vi: 'Colombia'}, code: 'co', fact: {en: 'Famous for coffee', vi: 'Nổi tiếng với cà phê'}},
  {name: {en: 'Peru', vi: 'Peru'}, code: 'pe', fact: {en: 'Has Machu Picchu', vi: 'Có Machu Picchu'}},
  {name: {en: 'Chile', vi: 'Chile'}, code: 'cl', fact: {en: 'Longest country in the world', vi: 'Quốc gia dài nhất thế giới'}},
  {name: {en: 'Cuba', vi: 'Cuba'}, code: 'cu', fact: {en: 'Famous for cigars', vi: 'Nổi tiếng với xì gà'}},
  {name: {en: 'Jamaica', vi: 'Jamaica'}, code: 'jm', fact: {en: 'Famous for reggae music', vi: 'Nổi tiếng với nhạc reggae'}},
  
  // AFRICA + OCEANIA - 10
  {name: {en: 'Egypt', vi: 'Ai Cập'}, code: 'eg', fact: {en: 'Has the Pyramids', vi: 'Có kim tự tháp'}},
  {name: {en: 'South Africa', vi: 'Nam Phi'}, code: 'za', fact: {en: 'Famous for safaris', vi: 'Nổi tiếng với safari'}},
  {name: {en: 'Nigeria', vi: 'Nigeria'}, code: 'ng', fact: {en: 'Biggest population in Africa', vi: 'Dân số lớn nhất châu Phi'}},
  {name: {en: 'Kenya', vi: 'Kenya'}, code: 'ke', fact: {en: 'Famous for lions', vi: 'Nổi tiếng với sư tử'}},
  {name: {en: 'Morocco', vi: 'Morocco'}, code: 'ma', fact: {en: 'Capital is Rabat', vi: 'Thủ đô là Rabat'}},
  {name: {en: 'Australia', vi: 'Úc'}, code: 'au', fact: {en: 'Famous for kangaroos', vi: 'Nổi tiếng với chuột túi'}},
  {name: {en: 'New Zealand', vi: 'New Zealand'}, code: 'nz', fact: {en: 'Famous for sheep', vi: 'Nổi tiếng với cừu'}},
  {name: {en: 'Fiji', vi: 'Fiji'}, code: 'fj', fact: {en: 'Famous for beaches', vi: 'Nổi tiếng với bãi biển'}},
  {name: {en: 'UAE', vi: 'Các Tiểu vương quốc Ả Rập'}, code: 'ae', fact: {en: 'Famous for Burj Khalifa', vi: 'Nổi tiếng với Burj Khalifa'}},
  {name: {en: 'Israel', vi: 'Israel'}, code: 'il', fact: {en: 'Capital is Jerusalem', vi: 'Thủ đô là Jerusalem'}},
]

function FlagsGame() {
  const searchParams = useSearchParams()
  const lang = (searchParams.get('lang') as 'en'|'vi') || 'en'

  const generateFlagQuestion = async (): Promise<WorldQuestion<string>> => {
    const correct = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]
    const wrongs = COUNTRIES.filter(c => c.name.en!== correct.name.en).sort(() => 0.5 - Math.random()).slice(0,3)
    const choices = [correct.name[lang],...wrongs.map(w => w.name[lang])].sort(() => 0.5 - Math.random())

    return {
      id: crypto.randomUUID(),
      questionUI: (
        <div className="flex justify-center items-center mb-8">
          <img
            src={`https://flagcdn.com/w320/${correct.code}.png`}
            alt="flag"
            className="w-[280px] h-[180px] md:w-[400px] md:h-[260px] border-4 border-black rounded-xl shadow-2xl"
          />
        </div>
      ), // <- REMOVED EXTRA ), HERE
      answer: correct.name[lang],
      choices: choices,
      fact: correct.fact,
      speakText: {
        en: `Which country does this flag belong to?`,
        vi: `Đây là lá cờ của nước nào?`
      }
    }
  }

  return (
    <WorldEngine<string>
      title={{en: "Guess The Flag", vi: "Đoán Lá Cờ"}}
      total={10}
      theme="orange" // matches your home page bg-orange-300
      backRoute="/"
      generateQuestion={generateFlagQuestion}
      getAnswerText={(a) => a}
      lang={lang}
    />
  )
}

export default function FlagsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-orange-100" />}>
      <FlagsGame />
    </Suspense>
  )
}