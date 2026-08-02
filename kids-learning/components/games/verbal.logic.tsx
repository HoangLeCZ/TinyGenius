'use client'

type Q = {
  speakText: {en:string, vi:string},
  questionUI: React.ReactNode,
  answer: number,
  choices: number[]
}

const BANK: {en:string, vi:string, answer:number}[] = [
  // === ADDITION ===
  // 1-digit, not crossing 10
  {en: "Sara has 5 apples. Her mom gives her 3 more. How many apples does Sara have now?", vi: "Sara có 5 quả táo. Mẹ cho thêm 3 quả nữa. Bây giờ Sara có bao nhiêu quả táo?", answer: 8},
  {en: "There are 7 birds on a tree. 4 more birds fly in. How many birds are there now?", vi: "Có 7 con chim trên cây. Có thêm 4 con chim bay đến. Bây giờ có bao nhiêu con chim?", answer: 11},

  // crossing 10 - tricky
  {en: "Mia has 9 stickers. She finds 6 more on the floor. How many stickers does Mia have now?", vi: "Mia có 9 cái nhãn dán. Cô ấy nhặt được thêm 6 cái. Bây giờ Mia có bao nhiêu cái?", answer: 15},
  {en: "A bus has 8 people. 7 more people get on. How many people are on the bus now?", vi: "Trên xe buýt có 8 người. Có 7 người nữa lên xe. Bây giờ trên xe có bao nhiêu người?", answer: 15},

  // 2 addends + 1 addend
  {en: "A box has 4 red balls and 5 blue balls. How many balls are in the box?", vi: "Một hộp có 4 bóng đỏ và 5 bóng xanh. Trong hộp có bao nhiêu quả bóng?", answer: 9},
  {en: "Tom has 6 toy cars. He gets 9 more for his birthday. How many cars does he have?", vi: "Tom có 6 chiếc xe đồ chơi. Cậu ấy được tặng thêm 9 chiếc vào sinh nhật. Bây giờ cậu ấy có bao nhiêu xe?", answer: 15},
  {en: "In the park there are 3 dogs, 2 cats and 4 ducks. How many animals are there?", vi: "Trong công viên có 3 con chó, 2 con mèo và 4 con vịt. Có tất cả bao nhiêu con vật?", answer: 9},

  // === SUBTRACTION ===
  // not crossing 10
  {en: "You have 10 cookies. You eat 3. How many cookies are left?", vi: "Bạn có 10 cái bánh quy. Bạn ăn 3 cái. Còn lại bao nhiêu cái?", answer: 7},
  {en: "There were 12 fish in a pond. 5 fish swam away. How many fish are left?", vi: "Có 12 con cá trong ao. 5 con cá bơi đi mất. Còn lại bao nhiêu con?", answer: 7},

  // crossing 10 - tricky
  {en: "Lily had 15 stickers. She gave 8 to her friend. How many stickers does Lily have now?", vi: "Lily có 15 cái nhãn dán. Cô ấy cho bạn 8 cái. Bây giờ Lily còn bao nhiêu cái?", answer: 7},
  {en: "There are 14 pencils. 9 pencils are broken. How many good pencils are left?", vi: "Có 14 cái bút chì. 9 cái bị gãy. Còn lại bao nhiêu cái tốt?", answer: 5},

  // compare - tricky for kids
  {en: "Ben has 13 marbles. Ana has 6 marbles. How many more marbles does Ben have?", vi: "Ben có 13 viên bi. Ana có 6 viên bi. Ben có nhiều hơn Ana bao nhiêu viên?", answer: 7},

  // === MULTIPLICATION ===
  // 2s, 5s, 10s - easy
  {en: "There are 4 boxes. Each box has 3 oranges. How many oranges are there in total?", vi: "Có 4 cái hộp. Mỗi hộp có 3 quả cam. Tổng cộng có bao nhiêu quả cam?", answer: 12},
  {en: "A spider has 8 legs. How many legs do 2 spiders have?", vi: "Một con nhện có 8 chân. 2 con nhện có bao nhiêu chân?", answer: 16},
  {en: "Each bag has 5 apples. There are 4 bags. How many apples in all?", vi: "Mỗi túi có 5 quả táo. Có 4 túi. Tất cả có bao nhiêu quả táo?", answer: 20},
  {en: "There are 2 chalkboards. Each chalkboard needs 2 pieces of chalk. How many pieces do you need?", vi: "Có 2 cái bảng. Mỗi bảng cần 2 viên phấn. Bạn cần bao nhiêu viên phấn?", answer: 4},【4196498881749038379†L183-L184】

  // 3s, 4s - medium
  {en: "A car has 4 wheels. How many wheels do 3 cars have?", vi: "Một chiếc ô tô có 4 bánh. 3 chiếc ô tô có bao nhiêu bánh?", answer: 12},
  {en: "Each student gets 3 pencils. There are 5 students. How many pencils in total?", vi: "Mỗi học sinh được 3 cái bút chì. Có 5 học sinh. Tổng cộng có bao nhiêu cái bút?", answer: 15},

  // === DIVISION ===
  // exact division
  {en: "12 candies are shared equally among 3 children. How many candies does each child get?", vi: "12 cái kẹo được chia đều cho 3 bạn nhỏ. Mỗi bạn được bao nhiêu cái kẹo?", answer: 4},
  {en: "You have 20 stickers. You want to put them on 4 pages equally. How many stickers on each page?", vi: "Bạn có 20 cái nhãn dán. Bạn muốn dán đều lên 4 trang. Mỗi trang có bao nhiêu cái?", answer: 5},
  {en: "18 cookies are packed into boxes of 2. How many boxes do you need?", vi: "18 cái bánh quy được đóng vào hộp, mỗi hộp 2 cái. Cần bao nhiêu hộp?", answer: 9},

  // division with remainder concept - but answer is whole
  {en: "There are 10 people. Each pizza has 4 slices. Each person gets 2 slices. How many pizzas should they order?", vi: "Có 10 người. Mỗi pizza có 4 miếng. Mỗi người ăn 2 miếng. Cần đặt bao nhiêu pizza?", answer: 5},【4196498881749038379†L175-L176】

  // === TWO-STEP / MIXED - TRICKY ===
  {en: "Lana has 2 bags with 2 marbles in each bag. Markus has 2 bags with 3 marbles in each bag. How many more marbles does Markus have?", vi: "Lana có 2 túi, mỗi túi 2 viên bi. Markus có 2 túi, mỗi túi 3 viên bi. Markus có nhiều hơn Lana bao nhiêu viên?", answer: 2},【4196498881749038379†L177-L178】
  {en: "There are 235 books in a library. On Monday, 123 books are taken out. On Tuesday, 56 books are brought back. How many books are there now?", vi: "Thư viện có 235 quyển sách. Thứ Hai mượn đi 123 quyển. Thứ Ba trả lại 56 quyển. Bây giờ thư viện có bao nhiêu quyển?", answer: 168},【4196498881749038379†L173-L174】

  // === MONEY ===
  {en: "You have 10 dollars. You buy a toy for 4 dollars. How much money do you have left?", vi: "Bạn có 10 đô la. Bạn mua một đồ chơi hết 4 đô la. Bạn còn lại bao nhiêu tiền?", answer: 6},
  {en: "Each notebook costs 3 dollars. You buy 4 notebooks. How much do you pay?", vi: "Mỗi quyển vở giá 3 đô la. Bạn mua 4 quyển. Bạn phải trả bao nhiêu tiền?", answer: 12},

  // === TIME / COUNTING ===
  {en: "There are 3 chalkboards. Each chalkboard has 2 pieces of chalk. If you take 1 piece from each board, how many are left?", vi: "Có 3 cái bảng. Mỗi bảng có 2 viên phấn. Nếu lấy 1 viên ở mỗi bảng, còn lại bao nhiêu viên?", answer: 3},【4196498881749038379†L185-L186】
  {en: "It takes 3 cutlets to make a dish. You have 20 cutlets. How many dishes can you make?", vi: "Làm 1 món ăn cần 3 miếng thịt. Bạn có 20 miếng. Bạn làm được bao nhiêu món?", answer: 6},【4196498881749038379†L170-L171】

  // === NUMBER SENSE - TRICKY ===
  {en: "I have a 7 in the tens place. I have an even number in the ones place. I am lower than 74. What number am I?", vi: "Số của tôi có chữ số 7 ở hàng chục. Chữ số hàng đơn vị là số chẵn. Tôi nhỏ hơn 74. Tôi là số nào?", answer: 72},【4196498881749038379†L188-L189】
  {en: "What number is 6 tens and 10 ones?", vi: "Số nào có 6 chục và 10 đơn vị?", answer: 70},【4196498881749038379†L187-L188】
]

const shuffle = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

export const generateVerbalQuestion = (): Q => {
  // PICK RANDOM INSTEAD OF USING INDEX
  const q = BANK[Math.floor(Math.random() * BANK.length)];

  let choices = [q.answer];
  while(choices.length < 4){
    const offset = Math.floor(Math.random()*5) + 1;
    const wrong = Math.random() > 0.5? q.answer + offset : q.answer - offset;
    if(wrong >= 0 &&!choices.includes(wrong)) choices.push(wrong);
  }

  return {
    speakText: { en: q.en, vi: q.vi },
    questionUI: (
      <div className="text-center text-3xl font-bold text-black mb-8 px-6 leading-relaxed">
        {q.en}
      </div>
    ),
    answer: q.answer,
    choices: shuffle(choices)
  };
};