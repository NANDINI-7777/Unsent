export function generateDeviceId(): string {
  if (typeof window === 'undefined') return 'server';
  const existing = localStorage.getItem('unsent_device_id');
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem('unsent_device_id', id);
  return id;
}

export function generateAlias(): string {
  if (typeof window === 'undefined') return 'stranger #0000';
  const existing = localStorage.getItem('unsent_alias');
  if (existing) return existing;
  const num = Math.floor(1000 + Math.random() * 9000);
  const alias = `stranger #${num}`;
  localStorage.setItem('unsent_alias', alias);
  return alias;
}

export function getDeviceId(): string {
  if (typeof window === 'undefined') return 'server';
  return localStorage.getItem('unsent_device_id') || generateDeviceId();
}

export function getAlias(): string {
  if (typeof window === 'undefined') return 'stranger #0000';
  return localStorage.getItem('unsent_alias') || generateAlias();
}

export async function hashDeviceId(deviceId: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(deviceId);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
