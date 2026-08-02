'use client'
export const dynamic = 'force-dynamic'

import { useSearchParams } from 'next/navigation'
import GameEngine, { GameQuestion } from '@/components/core/GameEngine'
import { Suspense } from 'react'

type VerbalTemplate2 = {
  type: '2'
  en: (a: number, b: number) => string
  vi: (a: number, b: number) => string
  calc: (a: number, b: number) => number
}
type VerbalTemplate3 = {
  type: '3'
  en: (a: number, b: number, c: number) => string
  vi: (a: number, b: number, c: number) => string
  calc: (a: number, b: number, c: number) => number
}
type VerbalTemplate = VerbalTemplate2 | VerbalTemplate3

function VerbalGame() {
  const searchParams = useSearchParams()
  const lang = (searchParams.get('lang') as 'en' | 'vi') || 'en'

  const templates: VerbalTemplate[] = [
    // ADDITION
    { type: '2', en: (a, b) => `Sara has ${a} apples. She buys ${b} more. How many apples does she have in total?`, vi: (a, b) => `Sara có ${a} quả táo. Cô ấy mua thêm ${b} quả nữa. Hỏi Sara có tất cả bao nhiêu quả táo?`, calc: (a, b) => a + b },
    { type: '2', en: (a, b) => `There are ${a} students in a class and ${b} more students join. How many students are there now?`, vi: (a, b) => `Có ${a} học sinh trong lớp và ${b} học sinh nữa đến. Hỏi bây giờ có tất cả bao nhiêu học sinh?`, calc: (a, b) => a + b },
    { type: '3', en: (a, b, c) => `At the bus stop ${a} children got on. At the next stop ${b} more got on and at the last stop ${c} more got on. How many children on the bus?`, vi: (a, b, c) => `Ở trạm xe buýt có ${a} bạn lên xe. Trạm tiếp theo ${b} bạn nữa lên và trạm cuối ${c} bạn nữa lên. Hỏi trên xe có bao nhiêu bạn?`, calc: (a, b, c) => a + b + c },
    
    // SUBTRACTION
    { type: '2', en: (a, b) => `There were ${a} birds on a tree. ${b} birds flew away. How many are left?`, vi: (a, b) => `Có ${a} con chim trên cây. ${b} con bay đi. Hỏi còn lại bao nhiêu con?`, calc: (a, b) => a - b },
    { type: '2', en: (a, b) => `A farmer has ${a} chickens. If ${b} chickens are sold, how many chickens are left?`, vi: (a, b) => `Một bác nông dân có ${a} con gà. Nếu bán đi ${b} con thì còn lại bao nhiêu con?`, calc: (a, b) => a - b },
    { type: '2', en: (a, b) => `Sam has ${a} sweets. He gets ${b} more then gives ${Math.floor(b/2)} away. How many sweets are left?`, vi: (a, b) => `Sam có ${a} cái kẹo. Bạn ấy được cho thêm ${b} cái rồi cho đi ${Math.floor(b/2)} cái. Hỏi còn lại bao nhiêu cái?`, calc: (a, b) => a + b - Math.floor(b/2) },
    
    // MULTIPLICATION
    { type: '2', en: (a, b) => `Each box has ${a} pencils. There are ${b} boxes. How many pencils in total?`, vi: (a, b) => `Mỗi hộp có ${a} cây bút chì. Có ${b} hộp. Hỏi có tất cả bao nhiêu cây bút chì?`, calc: (a, b) => a * b },
    { type: '2', en: (a, b) => `Each packet contains ${a} cookies. If there are ${b} packets, how many cookies in total?`, vi: (a, b) => `Mỗi gói có ${a} cái bánh quy. Có ${b} gói. Hỏi có tất cả bao nhiêu cái bánh quy?`, calc: (a, b) => a * b },
    { type: '2', en: (a, b) => `Eggs are sold in boxes of ${a}. Each crate holds ${b} boxes. How many eggs are in a crate?`, vi: (a, b) => `Trứng được đóng thành hộp ${a} quả. Mỗi thùng đựng được ${b} hộp. Hỏi một thùng có bao nhiêu quả trứng?`, calc: (a, b) => a * b },
    
    // DIVISION
    { type: '2', en: (a, b) => `A teacher wants to divide ${a} pencils among ${b} students. How many pencils will each student receive?`, vi: (a, b) => `Cô giáo muốn chia ${a} cây bút chì cho ${b} học sinh. Hỏi mỗi bạn được bao nhiêu cây bút?`, calc: (a, b) => Math.floor(a / b) },
    { type: '2', en: (a, b) => `A factory produces ${a} brushes every day. They are packaged into boxes of ${b}. How many boxes per day?`, vi: (a, b) => `Một nhà máy sản xuất ${a} cái cọ mỗi ngày. Đóng thành hộp ${b} cái một. Hỏi mỗi ngày đóng được bao nhiêu hộp?`, calc: (a, b) => Math.floor(a / b) },
    
    // MIXED
    { type: '3', en: (a, b, c) => `There are ${a} books in a library. On Monday ${b} books are taken out. On Tuesday ${c} books are brought back. How many books are there now?`, vi: (a, b, c) => `Thư viện có ${a} quyển sách. Thứ 2 mượn đi ${b} quyển. Thứ 3 trả lại ${c} quyển. Hỏi bây giờ còn bao nhiêu quyển?`, calc: (a, b, c) => a - b + c },
    { type: '3', en: (a, b, c) => `There are ${a} people ordering pizza. Each person gets ${b} slices and each pizza has ${c} slices. How many pizzas should they order?`, vi: (a, b, c) => `Có ${a} người gọi pizza. Mỗi người ăn ${b} miếng và mỗi pizza có ${c} miếng. Hỏi cần đặt bao nhiêu pizza?`, calc: (a, b, c) => Math.ceil((a * b) / c) },
    
    // MONEY / FRACTIONS
    { type: '2', en: (a, b) => `A book costs $${a}. There is a ${b}% discount. How much do you pay after the discount?`, vi: (a, b) => `Một quyển sách giá ${a}$ đô. Giảm giá ${b}%. Hỏi phải trả bao nhiêu tiền sau khi giảm giá?`, calc: (a, b) => a - Math.round(a * b / 100) },
    { type: '2', en: (a, b) => `A pizza is cut into ${a} slices. If you eat ${b} slices, how many slices are left?`, vi: (a, b) => `Một cái pizza được cắt thành ${a} miếng. Nếu bạn ăn ${b} miếng thì còn lại bao nhiêu miếng?`, calc: (a, b) => a - b },
    
    // +20 MORE
    { type: '2', en: (a, b) => `A movie starts at ${a} o'clock and lasts ${b} hours. What time does it end?`, vi: (a, b) => `Một bộ phim bắt đầu lúc ${a} giờ và kéo dài ${b} tiếng. Hỏi phim kết thúc lúc mấy giờ?`, calc: (a, b) => (a + b) % 24 },
    { type: '2', en: (a, b) => `You have ${a} five-dollar bills and ${b} one-dollar coins. How much money do you have in total?`, vi: (a, b) => `Bạn có ${a} tờ 5 đô và ${b} đồng 1 đô. Hỏi bạn có tất cả bao nhiêu tiền?`, calc: (a, b) => a * 5 + b },
    { type: '2', en: (a, b) => `A rope is ${a} meters long. You cut off ${b} meters. How much rope is left?`, vi: (a, b) => `Một sợi dây dài ${a} mét. Bạn cắt đi ${b} mét. Hỏi còn lại bao nhiêu mét dây?`, calc: (a, b) => a - b },
    { type: '2', en: (a, b) => `Mom baked ${a} cookies and wants to share them equally among ${b} children. How many cookies does each child get?`, vi: (a, b) => `Mẹ nướng ${a} cái bánh quy và chia đều cho ${b} bạn nhỏ. Hỏi mỗi bạn được bao nhiêu cái?`, calc: (a, b) => Math.floor(a / b) },
    { type: '2', en: (a, b) => `Tom is ${a} years old. His sister is ${b} years younger. How old is his sister?`, vi: (a, b) => `Tom ${a} tuổi. Em gái kém Tom ${b} tuổi. Hỏi em gái bao nhiêu tuổi?`, calc: (a, b) => a - b },
    { type: '2', en: (a, b) => `A garden is ${a} meters long and ${b} meters wide. What is the area of the garden?`, vi: (a, b) => `Một khu vườn dài ${a} mét và rộng ${b} mét. Hỏi diện tích khu vườn là bao nhiêu?`, calc: (a, b) => a * b },
    { type: '2', en: (a, b) => `Each notebook costs $${a}. If you buy ${b} notebooks, how much do you pay?`, vi: (a, b) => `Mỗi quyển vở giá ${a}$ đô. Nếu bạn mua ${b} quyển thì phải trả bao nhiêu tiền?`, calc: (a, b) => a * b },
    { type: '2', en: (a, b) => `You give the cashier $${a} to buy a toy that costs $${b}. How much change do you get back?`, vi: (a, b) => `Bạn đưa cô thu ngân ${a}$ đô để mua đồ chơi giá ${b}$ đô. Hỏi bạn được trả lại bao nhiêu tiền?`, calc: (a, b) => a - b },
    { type: '2', en: (a, b) => `There are ${a} rows of seats. Each row has ${b} seats. How many seats are there in total?`, vi: (a, b) => `Có ${a} hàng ghế. Mỗi hàng có ${b} ghế. Hỏi có tất cả bao nhiêu ghế?`, calc: (a, b) => a * b },
    { type: '3', en: (a, b, c) => `A bus carries ${a} people. On the first stop ${b} people get off and ${c} people get on. How many people on the bus now?`, vi: (a, b, c) => `Xe buýt chở ${a} người. Trạm 1 có ${b} người xuống và ${c} người lên. Hỏi bây giờ trên xe có bao nhiêu người?`, calc: (a, b, c) => a - b + c },
    { type: '2', en: (a, b) => `A farm has ${a} pens. Each pen has ${b} cows. How many cows are there in total?`, vi: (a, b) => `Một trang trại có ${a} chuồng. Mỗi chuồng có ${b} con bò. Hỏi có tất cả bao nhiêu con bò?`, calc: (a, b) => a * b },
    { type: '2', en: (a, b) => `A car travels ${a} km per hour. How far does it travel in ${b} hours?`, vi: (a, b) => `Một chiếc xe chạy ${a} km mỗi giờ. Hỏi trong ${b} giờ xe đi được bao nhiêu km?`, calc: (a, b) => a * b },
    { type: '2', en: (a, b) => `You have ${a} oranges. You pack them into bags of ${b}. How many full bags can you make?`, vi: (a, b) => `Bạn có ${a} quả cam. Bạn đóng vào túi mỗi túi ${b} quả. Hỏi đóng được bao nhiêu túi đầy?`, calc: (a, b) => Math.floor(a / b) },
    { type: '2', en: (a, b) => `In ${b} years, Anna will be ${a} years old. How old is Anna now?`, vi: (a, b) => `Sau ${b} năm nữa, Anna sẽ ${a} tuổi. Hỏi bây giờ Anna bao nhiêu tuổi?`, calc: (a, b) => a - b },
    { type: '2', en: (a, b) => `You save $${a} every week. How much money will you have after ${b} weeks?`, vi: (a, b) => `Mỗi tuần bạn tiết kiệm được ${a}$ đô. Hỏi sau ${b} tuần bạn có bao nhiêu tiền?`, calc: (a, b) => a * b },
    { type: '2', en: (a, b) => `A book has ${a} pages. You read ${b} pages each day. How many days to finish the book?`, vi: (a, b) => `Một quyển sách có ${a} trang. Mỗi ngày bạn đọc ${b} trang. Hỏi bao nhiêu ngày thì đọc xong sách?`, calc: (a, b) => Math.ceil(a / b) },
    { type: '2', en: (a, b) => `Team A scored ${a} points. Team B scored ${b} points more than Team A. How many points did Team B score?`, vi: (a, b) => `Đội A được ${a} điểm. Đội B được nhiều hơn đội A ${b} điểm. Hỏi đội B được bao nhiêu điểm?`, calc: (a, b) => a + b },
    { type: '2', en: (a, b) => `A plant grows ${a} cm each week. How tall will it be after ${b} weeks?`, vi: (a, b) => `Một cái cây cao thêm ${a} cm mỗi tuần. Hỏi sau ${b} tuần cây cao thêm bao nhiêu cm?`, calc: (a, b) => a * b },
    { type: '2', en: (a, b) => `The teacher buys ${a} boxes of crayons. Each box has ${b} crayons. How many crayons in total?`, vi: (a, b) => `Cô giáo mua ${a} hộp bút màu. Mỗi hộp có ${b} cây bút. Hỏi có tất cả bao nhiêu cây bút màu?`, calc: (a, b) => a * b },
  ]

  const generateVerbalQuestion = async (): Promise<GameQuestion<string>> => {
    const t = templates[Math.floor(Math.random() * templates.length)]
    const isThree = t.type === '3'

    let a = Math.floor(Math.random() * 40) + 10
    let b = Math.floor(Math.random() * 15) + 2
    let c = Math.floor(Math.random() * 8) + 2

    // FIX: use type + index rules instead of function reference
    if (t.type === '2' && (t.en.toString().includes('birds') || t.en.toString().includes('chickens')) && a < b) [a, b] = [b, a]
    
    if (t.type === '2' && t.en.toString().includes('divide')) {
      b = Math.floor(Math.random() * 8) + 2
      a = b * (Math.floor(Math.random() * 10) + 3)
    }
    if (t.type === '3' && t.en.toString().includes('pizza')) {
      a = Math.floor(Math.random() * 8) + 4
      b = Math.floor(Math.random() * 3) + 1
      c = Math.floor(Math.random() * 6) + 4
    }

    const answerNum = isThree? (t as VerbalTemplate3).calc(a, b, c) : (t as VerbalTemplate2).calc(a, b)
    const correctAnswer = String(answerNum)

    const wrongAnswers = new Set<string>()
    while (wrongAnswers.size < 3) {
      const offset = Math.floor(Math.random() * 7) - 3
      const wrong = answerNum + offset
      if (wrong >= 0 && wrong!== answerNum) wrongAnswers.add(String(wrong))
    }

    const choices = [correctAnswer,...Array.from(wrongAnswers)].sort(() => Math.random() - 0.5)
    const questionText = isThree? (t as VerbalTemplate3).en(a, b, c) : (t as VerbalTemplate2).en(a, b)
    const questionTextVi = isThree? (t as VerbalTemplate3).vi(a, b, c) : (t as VerbalTemplate2).vi(a, b)

    return {
      id: crypto.randomUUID(),
      questionUI: (
        <div className="text-center text-2xl md:text-3xl font-bold text-black px-4 leading-relaxed max-w-2xl mx-auto">
          {lang === 'en'? questionText : questionTextVi}
        </div>
      ),
      answer: correctAnswer,
      choices: choices,
      speakText: { en: questionText, vi: questionTextVi }
    }
  }

  return (
    <GameEngine<string>
      title={{ en: "Verbal Math", vi: "Toán Đọc" }}
      total={10}
      theme="orange"
      backRoute="/"
      generateQuestion={generateVerbalQuestion}
      getAnswerText={(a) => String(a)}
      lang={lang}
      speakQuestion={true}
      showSubtitle={false}
    />
  )
}

export default function VerbalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-orange-100 flex items-center justify-center text-4xl font-bold">Loading...</div>}>
      <VerbalGame />
    </Suspense>
  )
}