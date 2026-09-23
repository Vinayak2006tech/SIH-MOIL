const envUrl: string | undefined = (import.meta as any).env?.VITE_API_URL;

export const API_BASE: string = envUrl
  ? (envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/+$/, '')}/api`)
  : ((import.meta as any).env?.PROD ? 'https://sih-moil-1.onrender.com/api' : 'https://sih-moil-1.onrender.com/api');

