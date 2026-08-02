'use client'

type Q = {
  speakText: {en:string, vi:string},
  questionUI: React.ReactNode,
  answer: number,
  choices: number[]
}

const BANK: {en:string, vi:string, answer:number}[] = [
  // ADDITION
  {en: "Sara has 5 apples. Her mom gives her 3 more. How many apples does Sara have now?", vi: "Sara có 5 quả táo. Mẹ cho thêm 3 quả nữa. Bây giờ Sara có bao nhiêu quả táo?", answer: 8},
  {en: "There are 7 birds on a tree. 4 more birds fly in. How many birds are there now?", vi: "Có 7 con chim trên cây. Có thêm 4 con chim bay đến. Bây giờ có bao nhiêu con chim?", answer: 11},
  {en: "Tom has 6 toy cars. He gets 9 more for his birthday. How many cars does he have?", vi: "Tom có 6 chiếc xe đồ chơi. Cậu ấy được tặng thêm 9 chiếc vào sinh nhật. Bây giờ cậu ấy có bao nhiêu xe?", answer: 15},
  {en: "A box has 4 red balls and 5 blue balls. How many balls are in the box?", vi: "Một hộp có 4 bóng đỏ và 5 bóng xanh. Trong hộp có bao nhiêu quả bóng?", answer: 9},
  
  // SUBTRACTION
  {en: "You have 10 cookies. You eat 3. How many cookies are left?", vi: "Bạn có 10 cái bánh quy. Bạn ăn 3 cái. Còn lại bao nhiêu cái?", answer: 7},
  {en: "There were 12 fish in a pond. 5 fish swam away. How many fish are left?", vi: "Có 12 con cá trong ao. 5 con cá bơi đi mất. Còn lại bao nhiêu con?", answer: 7},
  {en: "Lily had 15 stickers. She gave 8 to her friend. How many stickers does Lily have now?", vi: "Lily có 15 cái nhãn dán. Cô ấy cho bạn 8 cái. Bây giờ Lily còn bao nhiêu cái?", answer: 7},
  
  // MULTIPLICATION
  {en: "There are 4 boxes. Each box has 3 oranges. How many oranges are there in total?", vi: "Có 4 cái hộp. Mỗi hộp có 3 quả cam. Tổng cộng có bao nhiêu quả cam?", answer: 12},
  {en: "A spider has 8 legs. How many legs do 2 spiders have?", vi: "Một con nhện có 8 chân. 2 con nhện có bao nhiêu chân?", answer: 16},
  
  // DIVISION
  {en: "12 candies are shared equally among 3 children. How many candies does each child get?", vi: "12 cái kẹo được chia đều cho 3 bạn nhỏ. Mỗi bạn được bao nhiêu cái kẹo?", answer: 4},
  {en: "You have 20 stickers. You want to put them on 4 pages equally. How many stickers on each page?", vi: "Bạn có 20 cái nhãn dán. Bạn muốn dán đều lên 4 trang. Mỗi trang có bao nhiêu cái?", answer: 5},
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