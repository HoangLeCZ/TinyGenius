export const speak = (text: string, muted: boolean, lang: 'en'|'vi' = 'en') => {
  if(muted) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(String(text));
  u.lang = lang === 'vi'? 'vi-VN' : 'en-US';
  u.rate = 0.9;
  speechSynthesis.speak(u);
};

export const sounds = {
  correct: {en:'Correct!', vi:'Đúng rồi!'},
  wrong: {en:'Wrong!', vi:'Sai rồi!'},
  done: {en:'Great job!', vi:'Giỏi lắm!'}
};