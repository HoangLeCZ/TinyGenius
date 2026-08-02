# TinyGenius Kids Learning App

## 1. GOAL
A Next.js 14 app for kids 3-8 to learn through mini-games. 
Focus: fast, offline-first, no ads, big buttons, voice support EN/VI.
Monetization: free core, IAP for "Pro Pack" later.

## 2. APP STRUCTURE

kids-learning/
├── app/
│ ├── page.tsx // Home with game cards
│ ├── game/
│ │ ├── counting/page.tsx // Count emojis
│ │ ├── add-sub/page.tsx // Add & Subtract 1-10
│ │ ├── multi-div/page.tsx // Multiply & Divide 1-9
│ │ ├── verbal/page.tsx // Word problems EN/VI
│ │ ├── vocab/page.tsx // Picture -> Word with Twemoji
│ │ └── shapes/page.tsx // Shape recognition
│ └── layout.tsx
├── components/
│ └── core/
│ └── GameEngine.tsx // Generic engine for all games
├── lib/
│ └── speech.ts // Web Speech API wrapper
└── public/
└── sounds/ // correct.mp3, wrong.mp3


### Key Rules
1.  All game pages MUST use `export const dynamic = 'force-dynamic'` because we use `useSearchParams`
2.  All game pages MUST wrap in `<Suspense>` because of `useSearchParams`
3.  All games use the same `GameEngine<T>` component

## 3. CORE COMPONENT: GameEngine<T>
Generic engine. You pass `generateQuestion`, it handles lives, score, timer, TTS, next/prev.

**Props:**
```ts
type GameEngineProps<T> = {
  title: {en: string, vi: string}
  total: number
  theme: 'green'|'purple'|'orange'|'blue'
  backRoute: string
  generateQuestion: () => Promise<GameQuestion<T>> // MUST BE ASYNC
  getAnswerText: (a: T) => string
  lang: 'en'|'vi'
  speakQuestion: boolean
  showSubtitle?: boolean
}

type GameQuestion<T> = {
  id: string
  questionUI: React.ReactNode
  answer: T
  choices: T[]
  itemName?: {en: string, vi: string} // for TTS
  speakText: {en: string, vi: string}

  IMPORTANT: generateQuestion must always be async (): Promise<GameQuestion<T>> even if there is no await. Otherwise TS build fails.

4. SKILLS / TECH STACK
Framework: Next.js 14 App Router, React 18, TypeScript
Styling: TailwindCSS
State: useState, useEffect. No Redux/Zustand yet
Audio: Web Speech API speechSynthesis for EN/VI
Images: Twemoji CDN https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/{code}.png
Deployment: Vercel
Lint/Build: npm run build must pass with no TS errors
5. LESSONS LEARNED / GOTCHAS
Type Error 2322: () => GameQuestion is not assignable to () => Promise<GameQuestion>.
Fix: Always make generateQuestion async.
Prerender Crash: useSearchParams crashes during build.
Fix: Add export const dynamic = 'force-dynamic' + wrap page in <Suspense>
Twemoji Map: keyword in VOCAB_LIST must exactly match key in TWEMOJI_MAP. Use - for multi words: ice-cream
Duplicate Object Keys: TS error 1117. Check TWEMOJI_MAP for duplicate keys
Choices: Always use Set to avoid duplicate answer choices
Division: Always generate a = answer * b first so division is always clean
6. VOCAB SYSTEM
Used for vocab/page.tsx

const VOCAB_LIST = [
  {keyword: 'cat', en: "cat", vi: "mèo"}, // keyword must match TWEMOJI_MAP
]
const TWEMOJI_MAP: Record<string, string> = {
  'cat': '1f431', // hex code without U+
}
const imageUrl = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${TWEMOJI_MAP[keyword]}.png`

Add new words: add to both VOCAB_LIST and TWEMOJI_MAP

7. CODING CONVENTIONS FOR COPILOT
When adding a new game:

Copy add-sub/page.tsx as template
Create generateXXXQuestion = async (): Promise<GameQuestion<T>>
Use big fonts: text-7xl for math, text-2xl for reading
Provide both speakText.en and speakText.vi
Add export const dynamic = 'force-dynamic' at top
Wrap export in <Suspense>
When adding new vocab:

Add to VOCAB_LIST
Add keyword: code to TWEMOJI_MAP
Test with 1 word first
8. TODO / NEXT FEATURES

Add progress save to localStorage

Add sound effects on correct/wrong

Add "Shapes" game with SVG

Add parent dashboard

Add offline PWA support
9. USEFUL COMMANDS
npm run dev - start dev
npm run build - check for TS errors
npm run lint - eslint


### **How to use this with Copilot**
1.  Put this file as `PROJECT_CONTEXT.md` in project root
2.  In Copilot Chat say: `@workspace read PROJECT_CONTEXT.md then add a new "Colors" game`

Want me to also generate the `GameEngine.tsx` boilerplate to match this doc so all games are 100% consistent?