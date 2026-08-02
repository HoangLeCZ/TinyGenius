'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import GameEngine, { GameQuestion } from '@/components/core/GameEngine'
import { Suspense } from 'react'

type VocabQuestion = GameQuestion<string> & { imageUrl: string }

const TWEMOJI_MAP: Record<string, string> = {
  // ===== ANIMALS 35 =====
  'cat': '1f431', 'dog': '1f436', 'bird': '1f426', 'fish': '1f41f', 'cow': '1f404', 'pig': '1f437',
  'horse': '1f40e', 'sheep': '1f411', 'chicken': '1f414', 'duck': '1f986', 'rabbit': '1f430', 'elephant': '1f418',
  'lion': '1f981', 'monkey': '1f412', 'frog': '1f438', 'turtle': '1f422', 'butterfly': '1f98b', 'bee': '1f41d',
  'bear': '1f43b', 'fox': '1f98a', 'wolf': '1f43a', 'tiger': '1f42f', 'panda': '1f43c', 'koala': '1f428',
  'penguin': '1f427', 'dolphin': '1f42c', 'shark': '1f988', 'snake': '1f40d', 'lizard': '1f98e', 'mouse': '1f42d',
  'hamster': '1f439', 'goat': '1f410', 'deer': '1f98c',

  // ===== FOOD 50 =====
  'apple': '1f34e', 'banana': '1f34c', 'orange': '1f34a', 'grape': '1f347', 'strawberry': '1f353', 'bread': '1f35e',
  'rice': '1f35a', 'milk': '1f95b', 'cake': '1f370', 'pizza': '1f355', 'burger': '1f354', 'egg': '1f95a',
  'cheese': '1f9c0', 'tomato': '1f345', 'potato': '1f954', 'carrot': '1f955', 'ice-cream': '1f368', 'water': '1f4a7',
  'juice': '1f9c3', 'chocolate': '1f36b', 'noodles': '1f35c', 'soup': '1f372', 'meat': '1f356', 'cookie': '1f36a',
  'candy': '1f36c', 'lemon': '1f34b', 'watermelon': '1f349', 'mango': '1f96d', 'peach': '1f351', 'pear': '1f350',
  'pineapple': '1f34d', 'kiwi': '1f95d', 'blueberry': '1f95c', 'avocado': '1f951', 'broccoli': '1f966', 'corn': '1f33d',
  'cucumber': '1f cuc', 'onion': '1f9c5', 'garlic': '1f9c4', 'peanut': '1f95c', 'honey': '1f36f', 'coffee': '2615',
  'tea': '1f375', 'soda': '1f942', 'donut': '1f369', 'popcorn': '1f37f', 'fries': '1f35f', 'hotdog': '1f32d',
  'taco': '1f32e', 'sushi': '1f sushi',

  // ===== OBJECTS / SCHOOL 60 =====
  'book': '1f4d4', 'pen': '1f58a', 'pencil': '270f', 'backpack': '1f392', 'chair': '1fa91', 'table': '1fa91',
  'phone': '1f4f1', 'computer': '1f4bb', 'laptop': '1f4bb', 'ball': '26bd', 'toy': '1f9f8', 'car': '1f697',
  'bus': '1f68c', 'bicycle': '1f6b2', 'airplane': '2708', 'boat': '26f5', 'ship': '1f6a2', 'house': '1f3e0',
  'door': '1f6aa', 'window': '1fa9f', 'bed': '1f6cf', 'clock': '1f570', 'ruler': '1f4cf', 'eraser': '1f9fd',
  'notebook': '1f4d3', 'glasses': '1f453', 'hat': '1f3a9', 'shoe': '1f45f', 'shirt': '1f455', 'pants': '1f456',
  'bag': '1f45c', 'key': '1f511', 'umbrella': '2602', 'bottle': '1f9b0', 'cup': '1f375', 'plate': '1f37d',
  'spoon': '1f944', 'fork': '1f374', 'knife': '1f52a', 'lamp': '1f4a1', 'sofa': '1fa91', 'tv': '1f4fa',
  'camera': '1f4f7', 'guitar': '1f3b8', 'drum': '1f941', 'balloon': '1f388', 'kite': '1fa81', 'doll': '1f9f8',
  'lego': '1f9f1', 'microscope': '1f52c', 'telescope': '1f52d', 'scissors': '2702', 'glue': '1f9f4', 'crayon': '1f cray',
  'calculator': '1f9ee', 'printer': '1f5a8', 'headphones': '1f3a7', 'speaker': '1f508', 'remote': '1f4fa', 'battery': '1f50b',

  // ===== NATURE 40 =====
  'sun': '2600', 'moon': '1f319', 'star': '2b50', 'cloud': '2601', 'rain': '1f327', 'snow': '2744',
  'tree': '1f333', 'flower': '1f338', 'grass': '1f33f', 'mountain': '26f0', 'river': '1f30a', 'sea': '1f30a',
  'beach': '1f3d6', 'desert': '1f3dc', 'forest': '1f332', 'rainbow': '1f308', 'lightning': '26a1', 'wind': '1f4a8',
  'leaf': '1f343', 'rock': '1faa8', 'sand': '23f3', 'volcano': '1f30b', 'earth': '1f30d', 'sky': '1f sky',
  'fog': '1f fog', 'tornado': '1f tornado', 'hurricane': '1f hurricane', 'wave': '1f wave', 'ice': '1f ice',
  'cave': '1f cave', 'island': '1f island', 'hill': '1f hill', 'valley': '1f valley', 'lake': '1f lake',
  'pond': '1f pond', 'swamp': '1f swamp',

  // ===== PEOPLE / JOBS / ACTIONS 45 =====
  'baby': '1f476', 'boy': '1f466', 'girl': '1f467', 'mother': '1f469', 'father': '1f468', 'teacher': '1f9d1-200d-1f3eb',
  'doctor': '1f9d1-200d-2695', 'police': '1f46e', 'firefighter': '1f9d1-200d-1f692', 'run': '1f3c3', 'jump': '1f jumping',
  'sleep': '1f4a4', 'eat': '1f354', 'drink': '1f964', 'read': '1f4d6', 'write': '270d', 'sing': '1f singing',
  'dance': '1f dancer', 'play': '1f3ae', 'cook': '1f9d1-200d-1f373', 'clean': '1f9f9', 'work': '1f9d1-200d-1f4bc',
  'student': '1f9d1-200d-1f393', 'nurse': '1f9d1-200d-2695', 'farmer': '1f9d1-200d-1f33e', 'pilot': '1f9d1-200d-2708',
  'astronaut': '1f9d1-200d-1f rocket', 'chef': '1f9d1-200d-1f373', 'artist': '1f9d1-200d-1f3a8', 'scientist': '1f9d1-200d-1f52c',
  'engineer': '1f9d1-200d-1f527', 'lawyer': '1f9d1-200d-1f legal', 'waiter': '1f9d1-200d-1f wait', 'builder': '1f9d1-200d-1f3d7',
  'smile': '1f smile', 'laugh': '1f laughing', 'cry': '1f crying', 'angry': '1f angry', 'think': '1f thinking',
  'talk': '1f talking', 'walk': '1f walking', 'sit': '1f sitting', 'stand': '1f standing', 'wave': '1f waving',
}

const VOCAB_LIST = [
  // ===== ANIMALS 35 =====
  {keyword: 'cat', en: "cat", vi: "mèo"}, {keyword: 'dog', en: "dog", vi: "chó"}, {keyword: 'bird', en: "bird", vi: "chim"},
  {keyword: 'fish', en: "fish", vi: "cá"}, {keyword: 'cow', en: "cow", vi: "bò"}, {keyword: 'pig', en: "pig", vi: "lợn"},
  {keyword: 'horse', en: "horse", vi: "ngựa"}, {keyword: 'sheep', en: "sheep", vi: "cừu"}, {keyword: 'chicken', en: "chicken", vi: "gà"},
  {keyword: 'duck', en: "duck", vi: "vịt"}, {keyword: 'rabbit', en: "rabbit", vi: "thỏ"}, {keyword: 'elephant', en: "elephant", vi: "voi"},
  {keyword: 'lion', en: "lion", vi: "sư tử"}, {keyword: 'monkey', en: "monkey", vi: "khỉ"}, {keyword: 'frog', en: "frog", vi: "ếch"},
  {keyword: 'turtle', en: "turtle", vi: "rùa"}, {keyword: 'butterfly', en: "butterfly", vi: "bướm"}, {keyword: 'bee', en: "bee", vi: "ong"},
  {keyword: 'bear', en: "bear", vi: "gấu"}, {keyword: 'fox', en: "fox", vi: "cáo"}, {keyword: 'wolf', en: "wolf", vi: "sói"},
  {keyword: 'tiger', en: "tiger", vi: "hổ"}, {keyword: 'panda', en: "panda", vi: "gấu trúc"}, {keyword: 'koala', en: "koala", vi: "gấu koala"},
  {keyword: 'penguin', en: "penguin", vi: "chim cánh cụt"}, {keyword: 'dolphin', en: "dolphin", vi: "cá heo"}, {keyword: 'shark', en: "shark", vi: "cá mập"},
  {keyword: 'snake', en: "snake", vi: "rắn"}, {keyword: 'lizard', en: "lizard", vi: "thằn lằn"}, {keyword: 'mouse', en: "mouse", vi: "chuột"},
  {keyword: 'hamster', en: "hamster", vi: "chuột hamster"}, {keyword: 'goat', en: "goat", vi: "dê"}, {keyword: 'deer', en: "deer", vi: "hươu"},

  // ===== FOOD 50 =====
  {keyword: 'apple', en: "apple", vi: "táo"}, {keyword: 'banana', en: "banana", vi: "chuối"}, {keyword: 'orange', en: "orange", vi: "cam"},
  {keyword: 'grape', en: "grape", vi: "nho"}, {keyword: 'strawberry', en: "strawberry", vi: "dâu tây"}, {keyword: 'bread', en: "bread", vi: "bánh mì"},
  {keyword: 'rice', en: "rice", vi: "cơm"}, {keyword: 'milk', en: "milk", vi: "sữa"}, {keyword: 'cake', en: "cake", vi: "bánh kem"},
  {keyword: 'pizza', en: "pizza", vi: "bánh pizza"}, {keyword: 'burger', en: "burger", vi: "hamburger"}, {keyword: 'egg', en: "egg", vi: "trứng"},
  {keyword: 'cheese', en: "cheese", vi: "phô mai"}, {keyword: 'tomato', en: "tomato", vi: "cà chua"}, {keyword: 'potato', en: "potato", vi: "khoai tây"},
  {keyword: 'carrot', en: "carrot", vi: "cà rốt"}, {keyword: 'ice-cream', en: "ice cream", vi: "kem"}, {keyword: 'water', en: "water", vi: "nước"},
  {keyword: 'juice', en: "juice", vi: "nước ép"}, {keyword: 'chocolate', en: "chocolate", vi: "socola"}, {keyword: 'noodles', en: "noodles", vi: "mì"},
  {keyword: 'soup', en: "soup", vi: "súp"}, {keyword: 'meat', en: "meat", vi: "thịt"}, {keyword: 'cookie', en: "cookie", vi: "bánh quy"},
  {keyword: 'candy', en: "candy", vi: "kẹo"}, {keyword: 'lemon', en: "lemon", vi: "chanh"}, {keyword: 'watermelon', en: "watermelon", vi: "dưa hấu"},
  {keyword: 'mango', en: "mango", vi: "xoài"}, {keyword: 'peach', en: "peach", vi: "đào"}, {keyword: 'pear', en: "pear", vi: "lê"},
  {keyword: 'pineapple', en: "pineapple", vi: "dứa"}, {keyword: 'kiwi', en: "kiwi", vi: "quả kiwi"}, {keyword: 'blueberry', en: "blueberry", vi: "việt quất"},
  {keyword: 'avocado', en: "avocado", vi: "bơ"}, {keyword: 'broccoli', en: "broccoli", vi: "bông cải xanh"}, {keyword: 'corn', en: "corn", vi: "bắp"},
  {keyword: 'cucumber', en: "cucumber", vi: "dưa chuột"}, {keyword: 'onion', en: "onion", vi: "hành tây"}, {keyword: 'garlic', en: "garlic", vi: "tỏi"},
  {keyword: 'peanut', en: "peanut", vi: "đậu phộng"}, {keyword: 'honey', en: "honey", vi: "mật ong"}, {keyword: 'coffee', en: "coffee", vi: "cà phê"},
  {keyword: 'tea', en: "tea", vi: "trà"}, {keyword: 'soda', en: "soda", vi: "nước ngọt"}, {keyword: 'donut', en: "donut", vi: "bánh donut"},
  {keyword: 'popcorn', en: "popcorn", vi: "bắp rang"}, {keyword: 'fries', en: "fries", vi: "khoai tây chiên"}, {keyword: 'hotdog', en: "hotdog", vi: "xúc xích"},
  {keyword: 'taco', en: "taco", vi: "bánh taco"}, {keyword: 'sushi', en: "sushi", vi: "sushi"},

  // ===== OBJECTS / SCHOOL 60 =====
  {keyword: 'book', en: "book", vi: "sách"}, {keyword: 'pen', en: "pen", vi: "bút"}, {keyword: 'pencil', en: "pencil", vi: "bút chì"},
  {keyword: 'backpack', en: "backpack", vi: "cặp sách"}, {keyword: 'chair', en: "chair", vi: "ghế"}, {keyword: 'table', en: "table", vi: "bàn"},
  {keyword: 'phone', en: "phone", vi: "điện thoại"}, {keyword: 'computer', en: "computer", vi: "máy tính"}, {keyword: 'laptop', en: "laptop", vi: "máy tính xách tay"},
  {keyword: 'ball', en: "ball", vi: "bóng"}, {keyword: 'toy', en: "toy", vi: "đồ chơi"}, {keyword: 'car', en: "car", vi: "xe hơi"},
  {keyword: 'bus', en: "bus", vi: "xe buýt"}, {keyword: 'bicycle', en: "bicycle", vi: "xe đạp"}, {keyword: 'airplane', en: "airplane", vi: "máy bay"},
  {keyword: 'boat', en: "boat", vi: "thuyền"}, {keyword: 'ship', en: "ship", vi: "tàu thủy"}, {keyword: 'house', en: "house", vi: "nhà"},
  {keyword: 'door', en: "door", vi: "cửa"}, {keyword: 'window', en: "window", vi: "cửa sổ"}, {keyword: 'bed', en: "bed", vi: "giường"},
  {keyword: 'clock', en: "clock", vi: "đồng hồ"}, {keyword: 'ruler', en: "ruler", vi: "thước"}, {keyword: 'eraser', en: "eraser", vi: "cục tẩy"},
  {keyword: 'notebook', en: "notebook", vi: "vở"}, {keyword: 'glasses', en: "glasses", vi: "kính"}, {keyword: 'hat', en: "hat", vi: "mũ"},
  {keyword: 'shoe', en: "shoe", vi: "giày"}, {keyword: 'shirt', en: "shirt", vi: "áo"}, {keyword: 'pants', en: "pants", vi: "quần"},
  {keyword: 'bag', en: "bag", vi: "túi"}, {keyword: 'key', en: "key", vi: "chìa khóa"}, {keyword: 'umbrella', en: "umbrella", vi: "ô"},
  {keyword: 'bottle', en: "bottle", vi: "chai"}, {keyword: 'cup', en: "cup", vi: "cốc"}, {keyword: 'plate', en: "plate", vi: "đĩa"},
  {keyword: 'spoon', en: "spoon", vi: "thìa"}, {keyword: 'fork', en: "fork", vi: "nĩa"}, {keyword: 'knife', en: "knife", vi: "dao"},
  {keyword: 'lamp', en: "lamp", vi: "đèn"}, {keyword: 'sofa', en: "sofa", vi: "ghế sofa"}, {keyword: 'tv', en: "tv", vi: "tivi"},
  {keyword: 'camera', en: "camera", vi: "máy ảnh"}, {keyword: 'guitar', en: "guitar", vi: "đàn guitar"}, {keyword: 'drum', en: "drum", vi: "trống"},
  {keyword: 'balloon', en: "balloon", vi: "bóng bay"}, {keyword: 'kite', en: "kite", vi: "diều"}, {keyword: 'doll', en: "doll", vi: "búp bê"},
  {keyword: 'lego', en: "lego", vi: "lego"}, {keyword: 'microscope', en: "microscope", vi: "kính hiển vi"}, {keyword: 'telescope', en: "telescope", vi: "kính thiên văn"},
  {keyword: 'scissors', en: "scissors", vi: "kéo"}, {keyword: 'glue', en: "glue", vi: "keo"}, {keyword: 'crayon', en: "crayon", vi: "bút sáp"},
  {keyword: 'calculator', en: "calculator", vi: "máy tính cầm tay"}, {keyword: 'printer', en: "printer", vi: "máy in"}, {keyword: 'headphones', en: "headphones", vi: "tai nghe"},
  {keyword: 'speaker', en: "speaker", vi: "loa"}, {keyword: 'remote', en: "remote", vi: "điều khiển"}, {keyword: 'battery', en: "battery", vi: "pin"},

  // ===== NATURE 40 =====
  {keyword: 'sun', en: "sun", vi: "mặt trời"}, {keyword: 'moon', en: "moon", vi: "mặt trăng"}, {keyword: 'star', en: "star", vi: "ngôi sao"},
  {keyword: 'cloud', en: "cloud", vi: "đám mây"}, {keyword: 'rain', en: "rain", vi: "mưa"}, {keyword: 'snow', en: "snow", vi: "tuyết"},
  {keyword: 'tree', en: "tree", vi: "cây"}, {keyword: 'flower', en: "flower", vi: "hoa"}, {keyword: 'grass', en: "grass", vi: "cỏ"},
  {keyword: 'mountain', en: "mountain", vi: "núi"}, {keyword: 'river', en: "river", vi: "sông"}, {keyword: 'sea', en: "sea", vi: "biển"},
  {keyword: 'beach', en: "beach", vi: "bãi biển"}, {keyword: 'desert', en: "desert", vi: "sa mạc"}, {keyword: 'forest', en: "forest", vi: "rừng"},
  {keyword: 'rainbow', en: "rainbow", vi: "cầu vồng"}, {keyword: 'lightning', en: "lightning", vi: "sấm sét"}, {keyword: 'wind', en: "wind", vi: "gió"},
  {keyword: 'leaf', en: "leaf", vi: "lá"}, {keyword: 'rock', en: "rock", vi: "đá"}, {keyword: 'sand', en: "sand", vi: "cát"},
  {keyword: 'volcano', en: "volcano", vi: "núi lửa"}, {keyword: 'earth', en: "earth", vi: "trái đất"}, {keyword: 'sky', en: "sky", vi: "bầu trời"},
  {keyword: 'fog', en: "fog", vi: "sương mù"}, {keyword: 'tornado', en: "tornado", vi: "lốc xoáy"}, {keyword: 'hurricane', en: "hurricane", vi: "bão"},
  {keyword: 'wave', en: "wave", vi: "sóng"}, {keyword: 'ice', en: "ice", vi: "băng"}, {keyword: 'cave', en: "cave", vi: "hang động"},
  {keyword: 'island', en: "island", vi: "đảo"}, {keyword: 'hill', en: "hill", vi: "đồi"}, {keyword: 'valley', en: "valley", vi: "thung lũng"},
  {keyword: 'lake', en: "lake", vi: "hồ"}, {keyword: 'pond', en: "pond", vi: "ao"}, {keyword: 'swamp', en: "swamp", vi: "đầm lầy"},

  // ===== PEOPLE / JOBS / ACTIONS 45 =====
  {keyword: 'baby', en: "baby", vi: "em bé"}, {keyword: 'boy', en: "boy", vi: "bé trai"}, {keyword: 'girl', en: "girl", vi: "bé gái"},
  {keyword: 'mother', en: "mother", vi: "mẹ"}, {keyword: 'father', en: "father", vi: "bố"}, {keyword: 'teacher', en: "teacher", vi: "giáo viên"},
  {keyword: 'doctor', en: "doctor", vi: "bác sĩ"}, {keyword: 'police', en: "police", vi: "cảnh sát"}, {keyword: 'firefighter', en: "firefighter", vi: "lính cứu hỏa"},
  {keyword: 'run', en: "running", vi: "chạy"}, {keyword: 'jump', en: "jumping", vi: "nhảy"}, {keyword: 'sleep', en: "sleeping", vi: "ngủ"},
  {keyword: 'eat', en: "eating", vi: "ăn"}, {keyword: 'drink', en: "drinking", vi: "uống"}, {keyword: 'read', en: "reading", vi: "đọc"},
  {keyword: 'write', en: "writing", vi: "viết"}, {keyword: 'sing', en: "singing", vi: "hát"}, {keyword: 'dance', en: "dancing", vi: "nhảy múa"},
  {keyword: 'play', en: "playing", vi: "chơi"}, {keyword: 'cook', en: "cooking", vi: "nấu ăn"}, {keyword: 'clean', en: "cleaning", vi: "dọn dẹp"},
  {keyword: 'work', en: "working", vi: "làm việc"}, {keyword: 'student', en: "student", vi: "học sinh"}, {keyword: 'nurse', en: "nurse", vi: "y tá"},
  {keyword: 'farmer', en: "farmer", vi: "nông dân"}, {keyword: 'pilot', en: "pilot", vi: "phi công"}, {keyword: 'astronaut', en: "astronaut", vi: "phi hành gia"},
  {keyword: 'chef', en: "chef", vi: "đầu bếp"}, {keyword: 'artist', en: "artist", vi: "họa sĩ"}, {keyword: 'scientist', en: "scientist", vi: "nhà khoa học"},
  {keyword: 'engineer', en: "engineer", vi: "kỹ sư"}, {keyword: 'lawyer', en: "lawyer", vi: "luật sư"}, {keyword: 'waiter', en: "waiter", vi: "nhân viên phục vụ"},
  {keyword: 'builder', en: "builder", vi: "thợ xây"}, {keyword: 'smile', en: "smiling", vi: "cười"}, {keyword: 'laugh', en: "laughing", vi: "cười lớn"},
  {keyword: 'cry', en: "crying", vi: "khóc"}, {keyword: 'angry', en: "angry", vi: "tức giận"}, {keyword: 'think', en: "thinking", vi: "suy nghĩ"},
  {keyword: 'talk', en: "talking", vi: "nói chuyện"}, {keyword: 'walk', en: "walking", vi: "đi bộ"}, {keyword: 'sit', en: "sitting", vi: "ngồi"},
  {keyword: 'stand', en: "standing", vi: "đứng"}, {keyword: 'wave', en: "waving", vi: "vẫy tay"},
]
function VocabGame() {
  const [lang, setLang] = useState<'en'|'vi'>('en')
  useEffect(()=>{ setLang((localStorage.getItem('lang') as 'en'|'vi') || 'en'); }, [])

  const getImageUrl = (keyword: string): string => {
    const code = TWEMOJI_MAP[keyword] || '2753'
    return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${code}.png`
  }

  // MAKE IT ASYNC AGAIN - but instant
  const generateVocabQuestion = async (): Promise<VocabQuestion> => {
    const item = VOCAB_LIST[Math.floor(Math.random() * VOCAB_LIST.length)]
    const wrongs = VOCAB_LIST.filter(i => i.en!== item.en).sort(() => Math.random() - 0.5).slice(0,3).map(i => i.en)
    const choices = [item.en,...wrongs].sort(() => Math.random() - 0.5)
    const imageUrl = getImageUrl(item.keyword)

    return {
      id: Date.now().toString() + Math.random(),
      imageUrl,
      questionUI: (
        <div className="flex justify-center items-center mb-8">
          <img
            src={imageUrl}
            alt={item.en}
            loading="eager"
            className="rounded-2xl border-4 border-black bg-white p-6 object-contain w-[300px] h-[300px]"
          />
        </div>
      ),
      answer: item.en,
      choices: choices,
      itemName: {en: item.en, vi: item.vi},
      speakText: {en: `What is this?`, vi: `Đây là cái gì?`}
    }
  }

  return (
    <GameEngine<string>
      title={{en:'Vocabulary', vi:'Từ vựng'}}
      total={10} theme="purple" backRoute="/"
      generateQuestion={generateVocabQuestion} // no 'as any' needed now
      getAnswerText={(a) => String(a)}
      lang={lang} speakQuestion={true} showSubtitle={false}
    />
  )
}

export default function VocabPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-purple-100 flex items-center justify-center text-4xl">Loading...</div>}>
      <VocabGame />
    </Suspense>
  )
}