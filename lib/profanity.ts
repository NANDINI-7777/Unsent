const PROFANITY_LIST = [
  'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy',
  'cunt', 'bastard', 'whore', 'slut', 'nigger', 'faggot',
  'retard', 'retarded',
];

export function filterProfanity(text: string): string {
  let filtered = text;
  for (const word of PROFANITY_LIST) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    filtered = filtered.replace(regex, '✦'.repeat(word.length));
  }
  return filtered;
}

export function containsProfanity(text: string): boolean {
  const lower = text.toLowerCase();
  return PROFANITY_LIST.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lower);
  });
}
