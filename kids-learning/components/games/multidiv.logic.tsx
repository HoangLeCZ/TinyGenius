'use client'

export const generateMultiDivQuestion = () => {
  const isMultiply = Math.random() > 0.5;

  let a, b, answer, symbol, speakOp, speakOpVi;

  if(isMultiply) {
    a = Math.floor(Math.random() * 11); // 0-10
    b = Math.floor(Math.random() * 11); // 0-10
    answer = a * b;
    symbol = '×';
    speakOp = 'times';
    speakOpVi = 'nhân';
  } else {
    b = Math.floor(Math.random() * 10) + 1; // 1-10
    answer = Math.floor(Math.random() * 11); // 0-10
    a = b * answer; // clean division
    symbol = '÷';
    speakOp = 'divided by';
    speakOpVi = 'chia';
  }

  let choices = [answer];
  while(choices.length < 4){
    const offset = Math.floor(Math.random()*10) + 1;
    const wrong = Math.random() > 0.5? answer + offset : answer - offset;
    if(wrong >= 0 &&!choices.includes(wrong)) choices.push(wrong);
  }

  return {
    id: `${a}${symbol}${b}`,
    speakText: {
      en: `${a} ${speakOp} ${b} equals`,
      vi: `${a} ${speakOpVi} ${b} bằng`
    },
    questionUI: (
      <div className="text-center text-8xl font-extrabold text-black mb-8">
        {a} {symbol} {b} =?
      </div>
    ),
    answer: answer,
    choices: choices.sort(() => Math.random() - 0.5)
  };
};