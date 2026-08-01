'use client'
import { useEffect, useState } from 'react'

export default function Confetti() {
  const [pieces, setPieces] = useState<any[]>([])

  useEffect(() => {
    const emojis = ['🎉', '⭐', '🎊', '🌟', '💖', '🦄']
    const newPieces = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      size: 20 + Math.random() * 20
    }))
    setPieces(newPieces)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute animate-fall"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`
          }}>
          {p.emoji}
        </div>
      ))}
      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
       .animate-fall {
          animation-name: fall;
          animation-timing-function: ease-in;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  )
}