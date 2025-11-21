// 本地存储工具
const STORAGE_KEY = '2048-ai-game';

interface StorageData {
  bestScore: number;
}

export const storage = {
  getBestScore(): number {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed: StorageData = JSON.parse(data);
        return parsed.bestScore || 0;
      }
    } catch (error) {
      console.error('Failed to load best score:', error);
    }
    return 0;
  },

  saveBestScore(score: number): void {
    try {
      const data: StorageData = { bestScore: score };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save best score:', error);
    }
  },
};
