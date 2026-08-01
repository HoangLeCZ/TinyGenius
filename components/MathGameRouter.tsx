'use client'
import WordGame from './games/WordGame'
import CountingGame from './games/CountingGame'
import AddSubGame from './games/AddSubGame'
import MultDivGame from './games/MultDivGame'
import VocabGame from './games/VocabGame' // 1. IMPORT

export default function MathGameRouter({mode, ...props}: any) {

  if(mode === 'word') return <WordGame {...props} mode="word"/>
  if(mode === 'counting') return <CountingGame {...props} mode="counting"/>
  if(mode === 'addsub') return <AddSubGame {...props} mode="addsub"/>
  if(mode === 'multdiv') return <MultDivGame {...props} mode="multdiv"/>
  if(mode === 'vocab') return <VocabGame {...props} /> // 2. ADD THIS

  return <div>Game not found</div>
}