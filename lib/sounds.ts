let currentLang: 'cs'|'en'|'vi' = 'cs'

export const setSoundLang = (lang: 'cs'|'en'|'vi') => {
  currentLang = lang
}

const getBestVoice = () => {
  const voices = speechSynthesis.getVoices()

  if(currentLang === 'cs') {
    return voices.find(v => v.name.toLowerCase().includes('zuzana'))
      || voices.find(v => v.name.toLowerCase().includes('google') && v.lang.startsWith('cs'))
      || voices.find(v => v.lang.startsWith('cs'))
  }

  return voices.find(v => v.lang.startsWith(currentLang) && v.name.includes('Google'))
    || voices.find(v => v.lang.startsWith(currentLang))
}

export const speak = (text: string, muted: boolean) => {
  if(muted) { speechSynthesis.cancel(); return }
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  const voice = getBestVoice()
  if(voice) u.voice = voice
  u.lang = currentLang === 'cs'? 'cs-CZ' : currentLang === 'vi'? 'vi-VN' : 'en-US'
  u.rate = currentLang === 'cs'? 0.7 : 0.85
  u.pitch = currentLang === 'cs'? 1.0 : 1.1
  u.volume = 1
  speechSynthesis.speak(u)
}

export const sounds = {
  correct: { cs: 'Správně!', en: 'Correct!', vi: 'Đúng rồi!' },
  wrong: { cs: 'Zkus to znovu', en: 'Try again', vi: 'Thử lại nhé' },
  done: { cs: 'Hotovo! Výborně!', en: 'All Done! Great job!', vi: 'Hoàn thành! Giỏi lắm!' }
}