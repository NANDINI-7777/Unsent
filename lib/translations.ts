export type Language = 'en' | 'hi' | 'hinglish';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    navHome: 'home',
    navFeed: 'feed',
    navVent: 'vent',

    // Landing Screen
    tagline: 'say it. someone hears it.',
    anonBadge: '100% anonymous',
    ctaStart: 'start venting →',
    ctaFeed: 'browse the feed 💬',
    landingDesc: "type how you feel. post it anonymously. get a reply from a stranger — you'll never know if it's human or AI. that's the magic. ✨",
    anonymousHeaderBadge: 'anonymous',

    // Vent Composer Screen
    ventHeader: 'let it out',
    ventSub: 'your thoughts are safe here. let them flow. 🌸',
    feeling: 'how are you feeling?',
    customMoodPlaceholder: 'type your own mood (e.g., overwhelmed)',
    customMoodBtn: 'custom...',
    options: 'options',
    optionsAnon: 'stay anon',
    optionsFeed: 'show on feed',
    optionsJustMe: 'just for me',
    optionsAutoDel: 'auto-delete 24h',
    composerPlaceholder: 'no filter. no judgment. just say it...',
    replyQuestion: 'how should they reply?',
    sendButton: 'send it 🕊️',
    sending: 'sending...',
    errorGeneric: 'something went wrong. try again?',

    // Wait Screen
    waitHeader: 'your vent is out there',
    waitSub: "someone is reading your words right now. human? AI? you'll never know. that's the beauty of it. 🌸",

    // Reply Screen
    replyHeader: 'someone replied 💌',
    replySub: "was it a stranger? was it AI? the mystery continues...",
    ventAgain: 'vent again',
    seeFeed: 'see feed',
    noReplyYet: 'no reply to show yet...',

    // Feed Screen
    feedHeader: 'Feed',
    feedSub: 'anonymous thoughts on highs, lows, and everything in between 🤍',
    filterAll: 'all',
    liveBadge: 'live',
    emptyFeedTitle: 'no vents yet',
    emptyFeedSub: 'be the first to say what you feel',
    loadMore: 'load more vents...',
    cardReply: 'reply',
    cardReplies: 'replies',
    cardClose: 'close',
    cardReplyBtn: 'reply →',
    inlineCommentPlaceholder: 'say something kind... or real. both work.',
    inlineCommentLabel: 'anon reply 🕶️',

    // Crisis Modal
    crisisHeader: 'hey, we noticed what you wrote',
    crisisDesc: "you don't have to go through this alone. there are people who understand and want to help — no judgment, ever.",
    crisisBtnHelp: '💛 talk to iCall (free & confidential)',
    crisisBtnBypass: "i'm okay, just venting 🌸",
    crisisFooter: 'your privacy is always protected. 🔒',

    // Alerts Modal
    alertsTitle: 'inbox alerts',
    alertsFooter: 'your inbox is 100% private and stored locally. 🔒',
    alert1Title: 'support sent 💌',
    alert1Desc: 'someone highkey related to your vent and sent you anonymous heart-to-heart warmth.',
    alert2Title: 'replier typing finished 💌',
    alert2Desc: 'your mystery replier has submitted their response to your vent. click to view!',
    alert3Title: 'needed this reaction 😮‍💨',
    alert3Desc: "strangers have sent 'needed this fr' and lowkey helped reactions to your post.",
  },
  hinglish: {
    // Navigation
    navHome: 'home',
    navFeed: 'feed',
    navVent: 'vent karein',

    // Landing Screen
    tagline: 'bolo yaara. koi sun raha hai.',
    anonBadge: '100% anonymous',
    ctaStart: 'vent karna shuru karo →',
    ctaFeed: 'feed dekho 💬',
    landingDesc: "jo bhi dil me hai, bina naam ke likho. kisi ajnabi se reply milega — pata nahi hoga wo insaan hai ya AI. yahi toh magic hai. ✨",
    anonymousHeaderBadge: 'gumnaam',

    // Vent Composer Screen
    ventHeader: 'dil ki baat bol do',
    ventSub: 'tumhari baatein yahan safe hain. bas likh daalo. 🌸',
    feeling: 'kaisa feel kar rahe ho?',
    customMoodPlaceholder: 'apna mood likho (jaise, tension me)',
    customMoodBtn: 'kuch aur...',
    options: 'options',
    optionsAnon: 'anon raho',
    optionsFeed: 'feed par dikhao',
    optionsJustMe: 'sirf mere liye',
    optionsAutoDel: '24h me delete',
    composerPlaceholder: 'koi filter nahi, koi judgment nahi. bas bol do...',
    replyQuestion: 'wo kaisa reply karein?',
    sendButton: 'bhej do 🕊️',
    sending: 'bhej rahe hain...',
    errorGeneric: 'kuch gadbad ho gayi. fir se try karo?',

    // Wait Screen
    waitHeader: 'tumhara vent chala gaya',
    waitSub: "koi tumhari baatein padh raha hai. insaan? AI? tumhein kabhi pata nahi chalega. yahi toh khoobsurati hai. 🌸",

    // Reply Screen
    replyHeader: 'kisi ne reply kiya 💌',
    replySub: "kya wo koi ajnabi tha? ya fir AI? mystery bani hui hai...",
    ventAgain: 'fir se bolo',
    seeFeed: 'feed dekho',
    noReplyYet: 'abhi tak koi reply nahi aaya...',

    // Feed Screen
    feedHeader: 'Feed',
    feedSub: 'gumnaam baatein — khushi, gham aur sab kuch 🤍',
    filterAll: 'sab',
    liveBadge: 'live',
    emptyFeedTitle: 'koi vent nahi hai abhi',
    emptyFeedSub: 'sabse pehle tum apne dil ki baat bol do',
    loadMore: 'aur vents load karo...',
    cardReply: 'reply',
    cardReplies: 'replies',
    cardClose: 'close',
    cardReplyBtn: 'reply →',
    inlineCommentPlaceholder: 'kuch achha ya sach bolo. dono chalega.',
    inlineCommentLabel: 'anon reply 🕶️',

    // Crisis Modal
    crisisHeader: 'hey, humne notice kiya jo tumne likha',
    crisisDesc: "tumhein akele ye sab jhelne ki zaroorat nahi hai. aise log hain jo samajhte hain aur help karna chahte hain — bina kisi judgment ke.",
    crisisBtnHelp: '💛 iCall se baat karo (free & confidential)',
    crisisBtnBypass: "mai theek hu, bas vent kar raha hu 🌸",
    crisisFooter: 'tumhari privacy hamesha protected hai. 🔒',

    // Alerts Modal
    alertsTitle: 'inbox alerts',
    alertsFooter: 'tumhara inbox 100% private hai aur locally saved hai. 🔒',
    alert1Title: 'warmth mili 💌',
    alert1Desc: 'kisi ne tumhari baat se relate karke anonymous heart-to-heart support bheja.',
    alert2Title: 'replier ne likh liya 💌',
    alert2Desc: 'tumhare mystery replier ne apna reply submit kar diya hai. dekhne ke liye click karein!',
    alert3Title: 'reaction mila 😮‍💨',
    alert3Desc: "kisi ne tumhari post pe 'needed this fr' aur lowkey helped react kiya hai.",
  },
  hi: {
    // Navigation
    navHome: 'होम',
    navFeed: 'फ़ीड',
    navVent: 'लिखें',

    // Landing Screen
    tagline: 'कहें। कोई सुन रहा है।',
    anonBadge: '100% गोपनीय',
    ctaStart: 'लिखना शुरू करें →',
    ctaFeed: 'फ़ीड देखें 💬',
    landingDesc: 'आप कैसा महसूस करते हैं, बिना नाम के लिखें। किसी अजनबी से जवाब पाएं — आपको कभी पता नहीं चलेगा कि वह इंसान है या एआई। यही जादू है। ✨',
    anonymousHeaderBadge: 'गुमनाम',

    // Vent Composer Screen
    ventHeader: 'मन की बात कहें',
    ventSub: 'आपके विचार यहाँ सुरक्षित हैं। बस कह दें। 🌸',
    feeling: 'आप कैसा महसूस कर रहे हैं?',
    customMoodPlaceholder: 'अपना मूड लिखें (जैसे, परेशान)',
    customMoodBtn: 'अन्य...',
    options: 'विकल्प',
    optionsAnon: 'गुप्त रहें',
    optionsFeed: 'फ़ीड पर दिखाएं',
    optionsJustMe: 'केवल मेरे लिए',
    optionsAutoDel: '24 घंटे में हटाएं',
    composerPlaceholder: 'कोई रोक-टोक नहीं। कोई न्याय नहीं। बस लिख डालें...',
    replyQuestion: 'वे कैसा जवाब दें?',
    sendButton: 'भेज दें 🕊️',
    sending: 'भेज रहे हैं...',
    errorGeneric: 'कुछ गड़बड़ हो गई। फिर से प्रयास करें?',

    // Wait Screen
    waitHeader: 'आपका विचार बाहर चला गया है',
    waitSub: 'कोई इस समय आपके शब्द पढ़ रहा है। इंसान? एआई? आपको कभी पता नहीं चलेगा। यही खूबसूरती है। 🌸',

    // Reply Screen
    replyHeader: 'किसी ने उत्तर दिया 💌',
    replySub: 'क्या वह कोई अजनबी था? या एआई? रहस्य बना हुआ है...',
    ventAgain: 'फिर से कहें',
    seeFeed: 'फ़ीड देखें',
    noReplyYet: 'दिखाने के लिए अभी कोई जवाब नहीं है...',

    // Feed Screen
    feedHeader: 'फ़ीड',
    feedSub: 'खुशी, गम और बाकी सभी अहसासों के गुमनाम विचार 🤍',
    filterAll: 'सभी',
    liveBadge: 'लाइव',
    emptyFeedTitle: 'अभी तक कोई विचार नहीं हैं',
    emptyFeedSub: 'मन की बात साझा करने वाले पहले व्यक्ति बनें',
    loadMore: 'और विचार लोड करें...',
    cardReply: 'जवाब',
    cardReplies: 'जवाब',
    cardClose: 'बंद करें',
    cardReplyBtn: 'जवाब दें →',
    inlineCommentPlaceholder: 'कुछ प्यारा या सच कहें। दोनों चलेंगे।',
    inlineCommentLabel: 'गुप्त जवाब 🕶️',

    // Crisis Modal
    crisisHeader: 'अरे, हमने ध्यान दिया जो आपने लिखा',
    crisisDesc: 'आपको अकेले इस सब से गुजरने की ज़रूरत नहीं है। ऐसे लोग हैं जो समझते हैं और मदद करना चाहते हैं — बिना किसी जजमेंट के।',
    crisisBtnHelp: '💛 iCall से बात करें (मुफ़्त और गोपनीय)',
    crisisBtnBypass: 'मैं ठीक हूँ, बस मन की बात लिख रहा हूँ 🌸',
    crisisFooter: 'आपकी गोपनीयता हमेशा सुरक्षित है। 🔒',

    // Alerts Modal
    alertsTitle: 'इनबॉक्स अलर्ट',
    alertsFooter: 'आपका इनबॉक्स 100% निजी है और स्थानीय रूप से सहेजा गया है। 🔒',
    alert1Title: 'सहारा भेजा 💌',
    alert1Desc: 'किसी ने आपकी बात से जुड़ाव महसूस किया और गुमनाम रूप से दिल से दिल सहारा भेजा।',
    alert2Title: 'जवाब लिखने का काम पूरा 💌',
    alert2Desc: 'आपके गुप्त उत्तरदाता ने अपना जवाब भेज दिया है। देखने के लिए क्लिक करें!',
    alert3Title: 'प्रतिक्रिया मिली 😮‍💨',
    alert3Desc: "अजनबियों ने आपके पोस्ट पर 'needed this fr' और 'lowkey helped' की प्रतिक्रिया भेजी है.",
  }
};

export const translateMood = (mood: string, lang: Language): string => {
  const MOOD_TRANSLATIONS: Record<string, Record<Language, string>> = {
    'cooked': { en: 'cooked', hinglish: 'cooked', hi: 'बर्बाद' },
    'dead inside': { en: 'dead inside', hinglish: 'ander se dead', hi: 'अंदर से खत्म' },
    'melting': { en: 'melting', hinglish: 'melting', hi: 'पिघल रहा हूँ' },
    'not okay': { en: 'not okay', hinglish: 'not okay', hi: 'ठीक नहीं हूँ' },
    'dissociating': { en: 'dissociating', hinglish: 'dissociating', hi: 'खो गया हूँ' },
    'it is what it is': { en: 'it is what it is', hinglish: 'jo hai so hai', hi: 'जो है सो है' },
    "can't breathe": { en: "can't breathe", hinglish: "saans nahi aa rahi", hi: 'सांस नहीं आ रही' },
    'totally fine': { en: 'totally fine', hinglish: 'totally fine', hi: 'बिल्कुल ठीक' },
    'all': { en: 'all', hinglish: 'sab', hi: 'सभी' }
  };
  
  const key = mood.toLowerCase().trim();
  if (MOOD_TRANSLATIONS[key]) {
    return MOOD_TRANSLATIONS[key][lang];
  }
  return mood; // custom mood fallback
};

export const translateReplyStyle = (style: string, lang: Language): { label: string; desc: string } => {
  const STYLE_TRANSLATIONS: Record<string, Record<Language, { label: string; desc: string }>> = {
    'heart-to-heart': {
      en: { label: 'heart-to-heart', desc: 'deep, warm support' },
      hinglish: { label: 'heart-to-heart', desc: 'deep support aur warmth' },
      hi: { label: 'दिल से दिल 💌', desc: 'गहरी, सहानुभूतिपूर्ण बातें' }
    },
    'fr tho': {
      en: { label: 'fr tho', desc: 'honest, direct advice' },
      hinglish: { label: 'fr tho', desc: 'honest aur direct advice' },
      hi: { label: 'सच्ची बात 💡', desc: 'ईमानदार, सीधी सलाह' }
    },
    'roast me': {
      en: { label: 'roast me', desc: 'lighten the mood' },
      hinglish: { label: 'roast me 💀', desc: 'mood thoda light karne ke liye' },
      hi: { label: 'रोस्ट करो मुझे 💀', desc: 'मूड को हल्का करने के लिए' }
    },
    'idk': {
      en: { label: 'idk', desc: 'surprise me, a mix' },
      hinglish: { label: 'idk 🤷', desc: 'surprise me, thoda mix' },
      hi: { label: 'पता नहीं 🤷', desc: 'हैरान कर दो, मिला-जुला' }
    }
  };
  const key = style.toLowerCase().trim();
  if (STYLE_TRANSLATIONS[key]) {
    return STYLE_TRANSLATIONS[key][lang];
  }
  return { label: style, desc: '' };
};
