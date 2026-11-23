// lib/plural.js
// "1 rótulo", "2 rótulos", "1 hoja", "3 hojas"
export const plural = (n, singular, varios) => `${n} ${Number(n) === 1 ? singular : varios}`;
