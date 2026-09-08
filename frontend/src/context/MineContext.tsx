import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Mine } from '../types';
import { api } from '../services/api.1';

interface MineContextType {
  mines: Mine[];
  selectedMineId: string;
  setSelectedMineId: (id: string) => void;
  selectedMine: Mine | null;
  loading: boolean;
  refreshMines: () => Promise<void>;
}

const MineContext = createContext<MineContextType | undefined>(undefined);

export const MineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mines, setMines] = useState<Mine[]>([]);
  const [selectedMineId, setSelectedMineId] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  const fetchMines = async () => {
    try {
      setLoading(true);
      const data = await api.getAllMines();
      setMines(data || []);
    } catch (err) {
      console.error('Failed to load mines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMines();
  }, []);

  const selectedMine = selectedMineId === 'ALL' ? null : mines.find((m) => m.mineId === selectedMineId) || null;

  return (
    <MineContext.Provider
      value={{
        mines,
        selectedMineId,
        setSelectedMineId,
        selectedMine,
        loading,
        refreshMines: fetchMines
      }}
    >
      {children}
    </MineContext.Provider>
  );
};

export const useMine = () => {
  const context = useContext(MineContext);
  if (!context) {
    throw new Error('useMine must be used within a MineProvider');
  }
  return context;
};
