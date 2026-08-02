'use client'
import React from 'react'

export const generateAddSubQuestion = () => {
  const isAdd = Math.random() > 0.5;

  let a, b, answer;
  if(isAdd) {
    a = Math.floor(Math.random() * 100) + 1;
    b = Math.floor(Math.random() * 100) + 1;
    answer = a + b;
  } else {
    a = Math.floor(Math.random() * 100) + 1;
    b = Math.floor(Math.random() * a) + 1;
    answer = a - b;
  }

  let choices = [answer];
  while(choices.length < 4){
    const offset = Math.floor(Math.random()*10) + 1;
    const wrong = Math.random() > 0.5? answer + offset : answer - offset;
    if(wrong > 0 &&!choices.includes(wrong)) choices.push(wrong);
  }

  return {
    id: `${a}-${b}-${isAdd}`,
    speakText: { // NEW
      en: `${a} ${isAdd? 'plus' : 'minus'} ${b} equals`,
      vi: `${a} ${isAdd? 'cộng' : 'trừ'} ${b} bằng`
    },
    questionUI: (
      <div className="text-center text-8xl font-extrabold text-black mb-8">
        {a} {isAdd? '+' : '-'} {b} =?
      </div>
    ),
    answer: answer,
    choices: choices.sort(() => Math.random() - 0.5)
  };
};