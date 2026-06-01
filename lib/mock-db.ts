import { Vent, Reply, Reaction } from '@/types';

// Sample vents for the feed
const SAMPLE_VENTS: Vent[] = [
  {
    id: 'v1',
    content: 'i studied for 3 weeks straight and still failed. everyone thinks im smart but i literally can\'t do this anymore.',
    mood: 'dead inside',
    moodEmoji: '💀',
    moodColor: '#c9788f',
    replyStyle: 'heart-to-heart',
    showOnFeed: true,
    autoDelete: false,
    deviceId: 'sample-1',
    replyCount: 2,
    gender: 'anon',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'v2',
    content: 'my best friend ghosted me after 4 years and i still don\'t know what i did wrong',
    mood: 'not okay',
    moodEmoji: '🥀',
    moodColor: '#d94478',
    replyStyle: 'heart-to-heart',
    showOnFeed: true,
    autoDelete: false,
    deviceId: 'sample-2',
    replyCount: 1,
    gender: 'anon',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'v3',
    content: 'pretending to be okay in every group chat while literally falling apart alone in my room lol',
    mood: 'totally fine',
    moodEmoji: '🙃',
    moodColor: '#ffc9dd',
    replyStyle: 'fr tho',
    showOnFeed: true,
    autoDelete: false,
    deviceId: 'sample-3',
    replyCount: 3,
    gender: 'anon',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'v4',
    content: 'everyone around me is getting internships and relationships and im just here existing',
    mood: 'cooked',
    moodEmoji: '😮💨',
    moodColor: '#ffaac8',
    replyStyle: 'fr tho',
    showOnFeed: true,
    autoDelete: false,
    deviceId: 'sample-4',
    replyCount: 0,
    gender: 'anon',
    createdAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
  },
  {
    id: 'v5',
    content: 'my parents compare me to my cousin every single day and wonder why i have no confidence',
    mood: 'melting',
    moodEmoji: '🫠',
    moodColor: '#ff85ae',
    replyStyle: 'roast me',
    showOnFeed: true,
    autoDelete: false,
    deviceId: 'sample-5',
    replyCount: 1,
    gender: 'anon',
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
  {
    id: 'v6',
    content: 'smiled through the whole family dinner while my anxiety was literally eating me alive',
    mood: 'dissociating',
    moodEmoji: '😶‍🌫️',
    moodColor: '#e8b4c4',
    replyStyle: 'heart-to-heart',
    showOnFeed: true,
    autoDelete: false,
    deviceId: 'sample-6',
    replyCount: 2,
    gender: 'anon',
    createdAt: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
  },
  {
    id: 'v7',
    content: 'yaar college me sab groupism karte hain. if you don\'t dress a certain way or talk about gossip, you are instantly left out. it\'s so exhausting to pretend.',
    mood: 'dissociating',
    moodEmoji: '😶‍🌫️',
    moodColor: '#e8b4c4',
    replyStyle: 'heart-to-heart',
    showOnFeed: true,
    autoDelete: false,
    deviceId: 'sample-7',
    replyCount: 0,
    gender: 'anon',
    createdAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
  },
  {
    id: 'v8',
    content: 'my roommate plays valorant till 4 AM screaming at his mic and i have an 8 AM class. if i tell him, he acts like i\'m the dramatic one.',
    mood: 'cooked',
    moodEmoji: '🥴',
    moodColor: '#ffaac8',
    replyStyle: 'fr tho',
    showOnFeed: true,
    autoDelete: false,
    deviceId: 'sample-8',
    replyCount: 0,
    gender: 'anon',
    createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
  },
  {
    id: 'v9',
    content: 'i have 43 unread texts and the anxiety of replying to them is making me ghost everyone completely lol',
    mood: 'totally fine',
    moodEmoji: '🙃',
    moodColor: '#ffc9dd',
    replyStyle: 'roast me',
    showOnFeed: true,
    autoDelete: false,
    deviceId: 'sample-9',
    replyCount: 0,
    gender: 'anon',
    createdAt: new Date(Date.now() - 1000 * 60 * 700).toISOString(),
  },
  {
    id: 'v10',
    content: 'sometimes i just want to pack my bags, change my name, and move to a quiet town where nobody knows my mistakes.',
    mood: 'melting',
    moodEmoji: '🫠',
    moodColor: '#ff85ae',
    replyStyle: 'heart-to-heart',
    showOnFeed: true,
    autoDelete: false,
    deviceId: 'sample-10',
    replyCount: 0,
    gender: 'anon',
    createdAt: new Date(Date.now() - 1000 * 60 * 800).toISOString(),
  },
];

const SAMPLE_REPLIES: Reply[] = [
  {
    id: 'r1',
    ventId: 'v1',
    content: 'hey, failing a test doesn\'t define your intelligence. you put in the work and that matters. sometimes the system fails us, not the other way around. keep going 🤍',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 'r2',
    ventId: 'v2',
    content: 'that\'s genuinely one of the worst feelings. you didn\'t do anything wrong — sometimes people leave and it says everything about them, nothing about you.',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'r3',
    ventId: 'v3',
    content: 'the fact that you\'re aware of it means you\'re not as "fine" as you pretend to be, and that\'s okay. you don\'t owe anyone your performance of being okay.',
    createdAt: new Date(Date.now() - 1000 * 60 * 100).toISOString(),
  },
];

// In-memory store
let vents: Vent[] = [...SAMPLE_VENTS];
let replies: Reply[] = [...SAMPLE_REPLIES];
let reactions: Reaction[] = [];

// Rate limiting map: deviceId -> timestamps of recent vents
const rateLimitMap = new Map<string, number[]>();

export const mockDb = {
  // VENTS
  async getVents(options?: { mood?: string; page?: number; limit?: number; sort?: string; replyStyle?: string }): Promise<Vent[]> {
    const { mood, page = 1, limit = 10, sort = 'latest', replyStyle = 'all' } = options || {};
    let filtered = vents.filter(v => v.showOnFeed);
    
    // Filter by last 48 hours, but exempt original starter vents so the feed is never empty!
    const cutoff = Date.now() - 48 * 60 * 60 * 1000;
    filtered = filtered.filter(v => {
      if (['v1', 'v2', 'v3', 'v4', 'v5', 'v6'].includes(v.id)) return true;
      return new Date(v.createdAt).getTime() > cutoff;
    });
    
    if (mood && mood !== 'all') {
      filtered = filtered.filter(v => v.mood === mood);
    }

    if (replyStyle && replyStyle !== 'all') {
      filtered = filtered.filter(v => v.replyStyle === replyStyle);
    }
    
    // Sort
    if (sort === 'popular') {
      // Sort by replyCount first, then by createdAt newest first
      filtered.sort((a, b) => {
        if (b.replyCount !== a.replyCount) {
          return b.replyCount - a.replyCount;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    } else {
      // Default: Sort by newest first
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  },

  async createVent(vent: Omit<Vent, 'id' | 'replyCount' | 'createdAt'>): Promise<Vent> {
    const newVent: Vent = {
      ...vent,
      id: 'v' + Date.now(),
      replyCount: 0,
      createdAt: new Date().toISOString(),
      expiresAt: vent.autoDelete ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : undefined,
    };
    vents.unshift(newVent);
    return newVent;
  },

  async deleteVent(ventId: string, deviceId: string): Promise<boolean> {
    const vent = vents.find(v => v.id === ventId);
    if (!vent || vent.deviceId !== deviceId) return false;
    vents = vents.filter(v => v.id !== ventId);
    replies = replies.filter(r => r.ventId !== ventId);
    return true;
  },

  async getVentById(ventId: string): Promise<Vent | undefined> {
    return vents.find(v => v.id === ventId);
  },

  // REPLIES
  async getReplies(ventId: string): Promise<Reply[]> {
    return replies.filter(r => r.ventId === ventId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  async createReply(reply: Omit<Reply, 'id' | 'createdAt'>): Promise<Reply> {
    const newReply: Reply = {
      ...reply,
      id: 'r' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    replies.push(newReply);
    // Increment reply count on vent
    const vent = vents.find(v => v.id === reply.ventId);
    if (vent) vent.replyCount++;
    return newReply;
  },

  // REACTIONS
  async createReaction(reaction: Omit<Reaction, 'id' | 'createdAt'>): Promise<Reaction> {
    const newReaction: Reaction = {
      ...reaction,
      id: 'react' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    reactions.push(newReaction);
    return newReaction;
  },

  // RATE LIMITING
  checkRateLimit(deviceId: string): boolean {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const timestamps = rateLimitMap.get(deviceId) || [];
    const recent = timestamps.filter(t => now - t < oneHour);
    rateLimitMap.set(deviceId, recent);
    return recent.length < 5; // max 5 vents per hour
  },

  recordVent(deviceId: string): void {
    const timestamps = rateLimitMap.get(deviceId) || [];
    timestamps.push(Date.now());
    rateLimitMap.set(deviceId, timestamps);
  },

  // Generate mock AI reply
  async generateMockReply(ventContent: string, mood: string, replyStyle: string, gender: string = 'anon'): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    // Auto-detect language of the vent
    const isHindiScript = /[\u0900-\u097F]/.test(ventContent);
    const hinglishKeywords = [
      'yaar', 'aaj', 'bahut', 'bohot', 'bhai', 'hai', 'hu', 'hoon', 'kya', 'hota',
      'raha', 'rha', 'lag', 'tension', 'load', 'sab', 'kuch', 'dost', 'ghar', 'chinta',
      'kal', 'hua', 'gya', 'gaya', 'log', 'baat', 'kuch', 'kar', 'kr', 'rhi', 'rahi',
      'theek', 'thik', 'sath', 'saath', 'chal', 'mat', 'nhi', 'nahi'
    ];
    const lowerContent = ventContent.toLowerCase();
    const isHinglish = lowerContent.split(/\s+/).some(word => hinglishKeywords.includes(word));

    // Determine gender endings
    const suffixRha = gender === 'girl' ? 'rhi' : (gender === 'boy' ? 'rha' : 'rhe ho');
    const suffixHua = gender === 'girl' ? 'hui' : (gender === 'boy' ? 'hua' : 'hua/hui');

    // Detect Context/Topic based on keywords
    const isExamOrStudy = /study|exam|test|fail|marks|result|padhai|fail|collage|school|class/i.test(lowerContent);
    const isFriendOrGhost = /friend|ghost|alone|lonely|dost|akela|singel|block/i.test(lowerContent);
    const isFamilyOrParent = /parent|family|mom|dad|cousin|ghar|papa|mummy|rishtedar/i.test(lowerContent);
    const isAnxietyOrPanic = /anxiety|anxious|panic|fear|darr|heavy|cry|crying/i.test(lowerContent);

    // If the replyStyle is heart-to-heart and it's a highly emotional/painful context, use emotional English comfort (with subtle Hinglish touch)
    const isHighlyEmotional = isFriendOrGhost || isAnxietyOrPanic || ['not okay', 'dead inside', "can't breathe"].includes(mood.toLowerCase().trim());

    if (isHighlyEmotional && replyStyle === 'heart-to-heart') {
      const emotionalEnglishReplies = [
        `i'm so sorry you're carrying this all alone yrr... you really don't deserve this weight. please don't let it get to you too much. take some time to breathe. 🫶🏻`,
        `that sounds genuinely so exhausting and heavy, and i'm sorry you're going through this. please remember you're not alone. be gentle with yourself today. 🤍`,
        `ik things feel completely overwhelming right now, but please don't lose heart. you are stronger than you think. take a slow breath. 🌸`,
        `it's okay to not be okay yrr... don't force yourself to act strong all the time. just take a moment to rest and breathe. sending you so much warmth. 💌`
      ];
      return emotionalEnglishReplies[Math.floor(Math.random() * emotionalEnglishReplies.length)];
    }

    // Contextual Mock Replies (Hinglish)
    if (isHinglish) {
      let pool: string[] = [];
      
      if (isExamOrStudy) {
        pool = replyStyle === 'fr tho' 
          ? [`real talk: exam fail hone se ya kam marks aane se life khatam nahi hoti. calm down aur agle par focus kar.`, `dekh, padhai ki tension har student ko hoti hai, tu akela nahi hai. chill maar aur fresh mind se start kar.`]
          : [`dekh yaar, test fail hone se teri smartness ya value decide nahi hoti. tension mat le, aage bohot mauke milenge. 🤍`, `exam toh temporary hain yaar, teri health aur peace sabse zyada important hain. take a deep breath. 🌸`];
      } else if (isFriendOrGhost) {
        pool = replyStyle === 'fr tho'
          ? [`real talk: agar dost ghost kar rahe hain toh unhe jaane do. tere validation kisi ke mohtaj nahi hai. protect your peace.`, `agar blocked ho toh unke peeche mat bhaago. khud ki self-respect sabse pehle rakh bro.`]
          : [`abey usko fark padta toh shaayad wo aisa karta hi nahi yrr... uske dimaag me kuch aur hi chal raha hoga. terko uske baare me itna sochne ki koi zaroorat nahi hai, apna dil mat kharab kar, jaakar chill maar yahan... usko bhaad me jaane de yrr 🙄`, `dost ke ghost karne se sach me dukh hota hai. par tu akela nahi hai yaar, tu bohot behtar log deserve karta hai. 🤍`];
      } else if (isFamilyOrParent) {
        pool = replyStyle === 'fr tho'
          ? [`real talk: parents kabhi kabhi apni insecurity hum par project karte hain. unki baato ko dil pe mat le aur apna raasta bana.`, `ghar walo ki comparison chalti rahegi, tu unke expectation ke liye apni life spoil mat kar.`]
          : [`ghar walo ki comparison bohot exhausting hoti hai yaar. tu jaise bhi hai, perfect hai. khud par vishwas rakh. 🤍`, `i understand. parents thode strict hote hain par unka load itna mat le. be strong, sab sahi ho jayega.`];
      } else if (isAnxietyOrPanic) {
        pool = replyStyle === 'fr tho'
          ? [`real talk: anxiety se bhagney ke bajaye usko face kar. thoda walk kar, gaane sun. protect your peace.`, `panic mode me mat ja bro. saans le, ye phase bhi chala jayega.`]
          : [`i feel you... achanak anxiety hona bohot heavy lagta hai. ek glass paani pi aur thodi gehri saans le. 🤍`, `sab theek ho jayega yaar. itna darr mat, tu bohot strong hai. take it easy. 🌸`];
      } else {
        // Fallback Hinglish replies
        const heartToHeartRepliesHinglish = [
          `sun, ye sab temporary hai. tu bohot strong hai aur ye phase bhi nikal jayega. tension mat le, chill maar thoda. 🤍`,
          `i feel you. itna load mat le yaar. sab theek ho jayega, bas thodi sa saans le aur be strong.`,
          `jo bhi ho, tu ye akele nahi jhel ${gender === 'girl' ? 'rahi' : (gender === 'boy' ? 'raha' : 'rahe')} h. tension mat le, sab theek ho jayega. 🫶🏻`,
        ];
        const frThoRepliesHinglish = [
          `dekh sach bolu toh — jo cheez tere control me nahi hai, uski chinta karna band kar. khud par focus kar fr.`,
          `real talk: agar log tujhe ghost kar rahe hain, toh unhe karne de. tu kisi ke validation ka mohtaj nahi hai.`,
          `sach baat ye hai ki har koi apni life me figure out kar raha hai. tu late nahi hai, tu apne time pe hai.`,
        ];
        const roastRepliesHinglish = [
          `dude, tu toh poori duniya ka burden tere hi shoulders pe leke ghoom ${gender === 'girl' ? 'rahi' : (gender === 'boy' ? 'raha' : 'rahe')} h? thoda chill maar 💀`,
          `zindagi thodi uljhi hui hai toh kya hua, abeyyy thoda relax maar yrr! apna dimaag mat kharab kar.`,
          `itni tension leke kya fayda bro? evict that thought immediately 😭`,
        ];
        
        switch (replyStyle) {
          case 'fr tho': pool = frThoRepliesHinglish; break;
          case 'roast me': pool = roastRepliesHinglish; break;
          case 'heart-to-heart': pool = heartToHeartRepliesHinglish; break;
          case 'idk': pool = [...heartToHeartRepliesHinglish, ...frThoRepliesHinglish, ...roastRepliesHinglish]; break;
          default: pool = heartToHeartRepliesHinglish;
        }
      }
      return pool[Math.floor(Math.random() * pool.length)];
    }

    // Contextual Mock Replies (English)
    let poolEn: string[] = [];
    if (isExamOrStudy) {
      poolEn = replyStyle === 'fr tho'
        ? [`real talk: grades don't determine your future value. protect your peace, breathe, and tackle the next chapter.`, `failing a test is a detour, not a dead end. stop stressing and look at where you can improve next.`]
        : [`hey, failing a test does not define your intelligence. you put in the work and that matters. keep your head up. 🤍`, `academic stress is real and heavy. please remember your worth is not tied to a percentage. take it easy. 🌸`];
    } else if (isFriendOrGhost) {
      poolEn = replyStyle === 'fr tho'
        ? [`real talk: if they ghosted you after years, it speaks about their character, not yours. let them go and protect your energy.`, `stop chasing people who block you or leave you out. self-respect is non-negotiable.`]
        : [`that is genuinely one of the worst feelings. shifting friendships hurt so much, but you are worthy of being valued. 🤍`, `being left out or ghosted makes you feel so lonely. just know there are people out there who will value you. 🌸`];
    } else if (isFamilyOrParent) {
      poolEn = replyStyle === 'fr tho'
        ? [`real talk: parent comparisons are exhausting. you are on your own timeline. focus on your own lane.`, `parents often project their expectations. build boundaries and stay firm in your own value.`]
        : [`family comparisons are so draining. you are unique and don't need to match anyone else's pace. stay strong. 🤍`, `sorry you're going through this. family pressure is a heavy weight, but you are doing great. 🌸`];
    } else if (isAnxietyOrPanic) {
      poolEn = replyStyle === 'fr tho'
        ? [`real talk: when anxiety kicks in, pause, take 3 deep breaths, and focus only on the next 5 minutes. take control.`, `don't let panic spiral you. ground yourself, listen to quiet music, and step away for a bit.`]
        : [`i hear you... anxiety eating you alive is terrifying. take a slow breath. you are safe, and this feeling will pass. 🤍`, `sending you so much warmth. anxiety is a liar, you are much stronger than this temporary wave. 🌸`];
    } else {
      // Fallback English replies
      const hugReplies = [
        `that sounds really heavy, and i'm sorry you're carrying it alone. you don't have to, though. there are people who get it — even strangers like me. 🤍`,
        `honestly? just reading this, i felt something. you're not being dramatic. what you feel is real and it matters.`,
        `i wish i could give you the biggest hug right now. you're going through it, and that's okay. you're allowed to not be okay.`,
        `hey, the fact that you're saying this out loud — even anonymously — takes courage. you're stronger than you think. i promise.`,
        `sending you so much warmth right now. this feeling won't last forever, even though it feels like it will. you've got this. 💗`,
      ];
      
      const frThoReplies = [
        `okay real talk — you can't control everything, but you CAN control how much energy you give to things that drain you. protect your peace fr.`,
        `not gonna sugarcoat it: that situation is rough. but here's what i'd do — take one small step today. just one. momentum builds from there.`,
        `i hear you, and honestly? sometimes life just hits different. but staying stuck in the feeling won't change the situation. what's one thing you can do rn?`,
        `real talk: you're allowed to set boundaries. you're allowed to say no. you're allowed to put yourself first. start there.`,
        `here's the thing nobody tells you — everyone's figuring it out as they go. you're not behind. you're just on your own timeline.`,
      ];
      
      const roastReplies = [
        `dude you really out here letting [this situation] live rent free in your head?? evict that thought immediately 😭`,
        `not you having a whole main character breakdown moment 💀 but honestly? even main characters have bad episodes. yours is about to get a glow-up arc.`,
        `the audacity of life to be this messy when you're literally just trying to exist?? rude tbh. anyway, you're iconic and don't forget it.`,
        `sir/ma'am this is an anonymous venting app not a therapy session but go off 😭 (but also... you're valid and things will get better i promise)`,
        `imagine being THIS stressed and STILL articulate enough to type this out. you're literally too powerful for this situation. it doesn't deserve you.`,
      ];
      
      switch (replyStyle) {
        case 'fr tho': poolEn = frThoReplies; break;
        case 'roast me': poolEn = roastReplies; break;
        case 'heart-to-heart': poolEn = hugReplies; break;
        case 'idk': poolEn = [...hugReplies, ...frThoReplies, ...roastReplies]; break;
        default: poolEn = hugReplies;
      }
    }
    
    return poolEn[Math.floor(Math.random() * poolEn.length)];
  },
};
