export function generateClientReference(): string {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `REF/SFE/${randomNumber}/DO`;
}

export function generateClientCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
