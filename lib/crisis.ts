const CRISIS_KEYWORDS = [
  'kill myself', 'end it all', 'want to die', 'suicide',
  'self harm', 'self-harm', 'cutting myself', 'hurt myself',
  'no reason to live', 'better off dead', 'can\'t go on',
  'ending it', 'don\'t want to be here', 'don\'t want to exist',
  'overdose', 'jump off', 'hang myself', 'slit',
  'not worth living', 'nobody would care if i',
  'the world would be better without me',
  'i wish i was never born', 'i want to disappear forever',
];

const CRISIS_PATTERNS = [
  /i\s*(want|need|going)\s*to\s*(die|end\s*it|kill)/i,
  /no\s*(point|reason)\s*(in|to)\s*(living|life|being\s*alive)/i,
  /better\s*off\s*(dead|without\s*me)/i,
  /can'?t\s*(take|do|handle)\s*(it|this)\s*anymore/i,
  /goodbye\s*(forever|world|everyone)/i,
];

export interface CrisisResult {
  isCrisis: boolean;
  confidence: number;
}

export function detectCrisis(content: string): CrisisResult {
  const lower = content.toLowerCase().trim();
  
  // Check exact keyword matches
  for (const keyword of CRISIS_KEYWORDS) {
    if (lower.includes(keyword)) {
      return { isCrisis: true, confidence: 0.9 };
    }
  }
  
  // Check regex patterns
  for (const pattern of CRISIS_PATTERNS) {
    if (pattern.test(lower)) {
      return { isCrisis: true, confidence: 0.8 };
    }
  }
  
  return { isCrisis: false, confidence: 0 };
}
