'use client'

let synth: SpeechSynthesis | null = null
let voices: SpeechSynthesisVoice[] = []

if (typeof window !== 'undefined') {
  synth = window.speechSynthesis
  
  const loadVoices = () => {
    voices = synth!.getVoices()
  }
  loadVoices()
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices
  }
}

export const speak = (text: string, lang: 'en' | 'vi' = 'en') => {
  if (!synth) return

  // cancel previous speech so they don't overlap
  synth.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang === 'vi' ? 'vi-VN' : 'en-US'
  utterance.rate = 0.9
  utterance.pitch = 1.1
  utterance.volume = 1

  // try to pick a good voice
  const voice = voices.find(v => v.lang.startsWith(lang))
  if (voice) utterance.voice = voice

  synth.speak(utterance)
}

export const stopSpeaking = () => {
  if (synth) synth.cancel()
}