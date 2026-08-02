'use client'
import { useState, useEffect, Suspense } from 'react'
import LanguageEngine, { LanguageQuestion } from '@/components/core/LanguageEngine'

// Real Pexels photo URLs
const PEXELS_MAP: Record<string, string> = {
  // ANIMALS 15
  dog: "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&w=400",
  cat: "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&w=400",
  bird: "https://images.pexels.com/photos/349758/pexels-photo-349758.jpeg?auto=compress&w=400",
  fish: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&w=400",
  cow: "https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg?auto=compress&w=400",
  pig: "https://images.pexels.com/photos/259280/pexels-photo-259280.jpeg?auto=compress&w=400",
  horse: "https://images.pexels.com/photos/635499/pexels-photo-635499.jpeg?auto=compress&w=400",
  sheep: "https://images.pexels.com/photos/225853/pexels-photo-225853.jpeg?auto=compress&w=400",
  chicken: "https://images.pexels.com/photos/166993/pexels-photo-166993.jpeg?auto=compress&w=400",
  rabbit: "https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&w=400",
  elephant: "https://images.pexels.com/photos/247376/pexels-photo-247376.jpeg?auto=compress&w=400",
  lion: "https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&w=400",
  monkey: "https://images.pexels.com/photos/330253/pexels-photo-330253.jpeg?auto=compress&w=400",
  bear: "https://images.pexels.com/photos/247376/pexels-photo-247376.jpeg?auto=compress&w=400",
  tiger: "https://images.pexels.com/photos/247376/pexels-photo-247376.jpeg?auto=compress&w=400",
  // FOOD 15
  apple: "https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&w=400",
  banana: "https://images.pexels.com/photos/1093034/pexels-photo-1093034.jpeg?auto=compress&w=400",
  orange: "https://images.pexels.com/photos/161559/background-orange-fruit-161559.jpeg?auto=compress&w=400",
  bread: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&w=400",
  rice: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=400",
  milk: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&w=400",
  cake: "https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg?auto=compress&w=400",
  pizza: "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&w=400",
  burger: "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&w=400",
  egg: "https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&w=400",
  tomato: "https://images.pexels.com/photos/132783/pexels-photo-132783.jpeg?auto=compress&w=400",
  carrot: "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&w=400",
  water: "https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&w=400",
  icecream: "https://images.pexels.com/photos/1352296/pexels-photo-1352296.jpeg?auto=compress&w=400",
  sushi: "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&w=400",
  // OBJECTS / SCHOOL 15
  book: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&w=400",
  pen: "https://images.pexels.com/photos/733745/pexels-photo-733745.jpeg?auto=compress&w=400",
  pencil: "https://images.pexels.com/photos/159775/library-la-trobe-study-students-159775.jpeg?auto=compress&w=400",
  backpack: "https://images.pexels.com/photos/2929992/pexels-photo-2929992.jpeg?auto=compress&w=400",
  chair: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&w=400",
  table: "https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&w=400",
  phone: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&w=400",
  computer: "https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&w=400",
  ball: "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&w=400",
  car: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&w=400",
  bus: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&w=400",
  bicycle: "https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&w=400",
  airplane: "https://images.pexels.com/photos/202632/pexels-photo-202632.jpeg?auto=compress&w=400",
  house: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&w=400",
  clock: "https://images.pexels.com/photos/2113994/pexels-photo-2113994.jpeg?auto=compress&w=400",
  // NATURE 10
  sun: "https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&w=400",
  moon: "https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&w=400",
  tree: "https://images.pexels.com/photos/38136/pexels-photo-38136.jpeg?auto=compress&w=400",
  flower: "https://images.pexels.com/photos/56866/pexels-photo-56866.jpeg?auto=compress&w=400",
  mountain: "https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&w=400",
  river: "https://images.pexels.com/photos/414974/pexels-photo-414974.jpeg?auto=compress&w=400",
  sea: "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&w=400",
  beach: "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&w=400",
  rain: "https://images.pexels.com/photos/1162251/pexels-photo-1162251.jpeg?auto=compress&w=400",
  snow: "https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg?auto=compress&w=400",
  // PEOPLE / JOBS 5
  teacher: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&w=400",
  doctor: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&w=400",
  baby: "https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?auto=compress&w=400",
  mother: "https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?auto=compress&w=400",
  father: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&w=400",
}

const VOCAB_LIST = Object.keys(PEXELS_MAP).map(keyword => ({
  keyword,
  en: keyword === 'icecream'? 'ice cream' : keyword,
  vi: {
    dog: "chó", cat: "mèo", bird: "chim", fish: "cá", cow: "bò", pig: "lợn", horse: "ngựa", sheep: "cừu", chicken: "gà", rabbit: "thỏ", elephant: "voi", lion: "sư tử", monkey: "khỉ", bear: "gấu", tiger: "hổ",
    apple: "táo", banana: "chuối", orange: "cam", bread: "bánh mì", rice: "cơm", milk: "sữa", cake: "bánh kem", pizza: "bánh pizza", burger: "hamburger", egg: "trứng", tomato: "cà chua", carrot: "cà rốt", water: "nước", icecream: "kem", sushi: "sushi",
    book: "sách", pen: "bút", pencil: "bút chì", backpack: "cặp sách", chair: "ghế", table: "bàn", phone: "điện thoại", computer: "máy tính", ball: "bóng", car: "xe hơi", bus: "xe buýt", bicycle: "xe đạp", airplane: "máy bay", house: "nhà", clock: "đồng hồ",
    sun: "mặt trời", moon: "mặt trăng", tree: "cây", flower: "hoa", mountain: "núi", river: "sông", sea: "biển", beach: "bãi biển", rain: "mưa", snow: "tuyết",
    teacher: "giáo viên", doctor: "bác sĩ", baby: "em bé", mother: "mẹ", father: "bố"
  }[keyword] || keyword
}))

function VocabImage({ keyword }: {keyword: string}) {
  return <img
    src={PEXELS_MAP[keyword]} // FIX 1
    alt={keyword}
    className="rounded-2xl border-4 border-black w-[300px] h-[300px] mx-auto shadow-2xl object-cover bg-white p-2"
  />
}

export default function VocabPage() {
  const [lang, setLang] = useState<'en'|'vi'>('en')
  useEffect(()=>{ setLang((localStorage.getItem('lang') as 'en'|'vi') || 'en'); }, [])

  const generateQuestion = async (): Promise<LanguageQuestion<string>> => {
    const item = VOCAB_LIST[Math.floor(Math.random() * VOCAB_LIST.length)] // FIX 2
    const wrongs = VOCAB_LIST.filter(i => i.en!== item.en).sort(() => Math.random() - 0.5).slice(0,3).map(i => i.en) // FIX 2
    const id = crypto.randomUUID()
    return {
      id,
      mediaUI: <VocabImage keyword={item.keyword} />,
      prompt: {en: "What is this?", vi: "Đây là gì?"},
      answer: item.en,
      choices: [item.en,...wrongs].sort(() => Math.random() - 0.5),
      word: {en: item.en, vi: item.vi}
    }
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-purple-100 flex items-center justify-center text-4xl">Loading...</div>}>
      <LanguageEngine<string>
        title={{en:'Vocabulary', vi:'Từ vựng'}}
        subtitle={{en:'Learn new words', vi:'Học từ mới'}}
        total={10}
        theme="purple"
        backRoute="/"
        generateQuestion={generateQuestion}
        getAnswerText={(a) => a}
        lang={lang}
        mode="vocab"
      />
    </Suspense>
  )
}