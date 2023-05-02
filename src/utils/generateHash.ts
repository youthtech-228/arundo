export const generateHash = (length = 20) => {
  const pickRandom = (chars: string) =>
    chars[Math.floor(Math.random() * chars.length)];

  return Array(length)
    .fill(0)
    .map((v, index) => {
      const alpha = 'abcdefghijklmnopqrstuvwxyz';
      const upper = alpha.toUpperCase();
      const numeric = '0123456789';

      return index
        ? pickRandom(alpha + upper + numeric)
        : pickRandom(alpha + upper);
    })
    .join('');
};
