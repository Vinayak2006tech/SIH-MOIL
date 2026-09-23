let envUrl: string | undefined = (import.meta as any).env?.VITE_API_URL;

// Auto-correct accidental targeting of Render ML service (sih-moil-1) instead of backend REST API (sih-moil)
if (envUrl && envUrl.includes('sih-moil-1.onrender.com')) {
  envUrl = envUrl.replace('sih-moil-1.onrender.com', 'sih-moil.onrender.com');
}

export const API_BASE: string = envUrl
  ? (envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/+$/, '')}/api`)
  : ((import.meta as any).env?.PROD ? 'https://sih-moil.onrender.com/api' : 'https://sih-moil.onrender.com/api');

