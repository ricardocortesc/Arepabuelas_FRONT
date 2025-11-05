// Ayuda a construir nombres de clase de Tailwind condicionalmente
export const cn = (...classes) => classes.filter(Boolean).join(' ');