'use client' 
import { useParams } from 'next/navigation' 
import MathGameRouter from '@/components/MathGameRouter' 

const gameData: Record<string, any> = { 
  counting: { 
    title: {cs:'Počítání',en:'Counting',vi:'Đếm'}, 
    subtitle: {cs:'Počítej předměty',en:'Count objects',vi:'Đếm đồ vật'}, 
    total:10, bg:'bg-green-100', buttonColor:'bg-green-500' 
  }, 
  addsub: { 
    title: {cs:'Sčítání',en:'Add & Subtract',vi:'Cộng & Trừ'}, 
    subtitle: {cs:'Do 100',en:'Up to 100',vi:'Đến 100'}, 
    total:10, bg:'bg-blue-100', buttonColor:'bg-blue-500' 
  }, 
  multdiv: { 
    title: {cs:'Násobení',en:'Multiply & Divide',vi:'Nhân & Chia'}, 
    subtitle: {cs:'1-10',en:'1-10',vi:'1-10'}, 
    total:10, bg:'bg-red-100', buttonColor:'bg-red-500' 
  }, 
  word: { 
    title: {cs:'Slovní úlohy',en:'Word Problems',vi:'Toán đố'}, 
    subtitle: {cs:'Příběhy',en:'Stories',vi:'Câu chuyện'}, 
    total:10, bg:'bg-amber-100', buttonColor:'bg-amber-500' 
  },
vocab: { // all words
    title: {cs:'Slovíčka',en:'Vocabulary',vi:'Từ vựng'},
    subtitle: {cs:'Co je to na obrázku?',en:'What is this?',vi:'Đây là gì?'},
    total:10, bg:'bg-purple-100', buttonColor:'bg-purple-500', filter: 'all'
  },
  animals: { // only animals
    title: {cs:'Zvířata',en:'Animals',vi:'Động vật'},
    subtitle: {cs:'Poznej zvíře',en:'Guess the animal',vi:'Đoán con vật'},
    total:10, bg:'bg-green-100', buttonColor:'bg-green-500', filter: 'animals'
  },
  food: { // only food
    title: {cs:'Jídlo',en:'Food',vi:'Đồ ăn'},
    subtitle: {cs:'Co to je k jídlu?',en:'What food is this?',vi:'Đây là đồ ăn gì?'},
    total:10, bg:'bg-orange-100', buttonColor:'bg-orange-500', filter: 'food'
  },
  school: { // only school
    title: {cs:'Ve škole',en:'At School',vi:'Ở trường'},
    subtitle: {cs:'Školní potřeby',en:'School supplies',vi:'Đồ dùng học tập'},
    total:10, bg:'bg-blue-100', buttonColor:'bg-blue-500', filter: 'school'
  },
} 

export default function GamePage() { 
  const { mode } = useParams() 
  const data = gameData[mode as string] 
  
  if(!data) return ( 
    <div className="min-h-screen flex items-center justify-center"> 
      <div className="text-center"> 
        <h1 className="text-4xl mb-4">Game not found</h1> 
        <a href="/" className="bg-purple-500 text-white px-6 py-3 rounded-2xl">Go Home</a> 
      </div> 
    </div> 
  ) 
  
  return <MathGameRouter mode={mode as any} {...data} /> 
}