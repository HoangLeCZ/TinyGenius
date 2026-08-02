'use client'
import React from 'react'

const ITEMS = [
  {emoji: '🍎', name: {en:'apple', vi:'quả táo'}},
  {emoji: '🍌', name: {en:'banana', vi:'quả chuối'}},
  {emoji: '✈️', name: {en:'plane', vi:'máy bay'}},
  {emoji: '🐶', name: {en:'dog', vi:'con chó'}},
  {emoji: '⭐', name: {en:'star', vi:'ngôi sao'}},
  {emoji: '🚗', name: {en:'car', vi:'xe ô tô'}},
  {emoji: '🌈', name: {en:'rainbow', vi:'cầu vồng'}},
  {emoji: '🍓', name: {en:'strawberry', vi:'quả dâu'}},
  {emoji: '🐱', name: {en:'cat', vi:'con mèo'}},
  {emoji: '⚽', name: {en:'ball', vi:'quả bóng'}},
];

export const generateCountingQuestion = () => {
  const count = Math.floor(Math.random()*10)+1;
  const item = ITEMS[Math.floor(Math.random()*ITEMS.length)];

  let choices = [count];
  while(choices.length < 4){
    const wrong = Math.floor(Math.random()*10)+1;
    if(!choices.includes(wrong)) choices.push(wrong);
  }

  return {
    id: String(count),
    itemName: item.name, // NEW: pass the name back
    questionUI: (
      <div className="flex flex-wrap justify-center gap-4 mb-8 min-h-[200px] items-center">
        {Array.from({length: count}).map((_, i) => (
          <div key={i} className="text-6xl animate-bounce">{item.emoji}</div>
        ))}
      </div>
    ),
    answer: count,
    choices: choices.sort(() => Math.random() - 0.5)
  };
};