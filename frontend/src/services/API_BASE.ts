export const API_BASE: string =
  (import.meta as any).env?.VITE_API_URL ||
  ((import.meta as any).env?.PROD ? 'https://sih-moil.onrender.com/api' : '/api');
