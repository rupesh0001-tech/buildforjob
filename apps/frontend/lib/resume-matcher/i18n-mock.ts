export function useTranslations() {
  return {
    t: (key: string, params?: Record<string, string | number>) => {
      // Basic mock translation logic
      // In a real app, this would look up the key in a JSON file
      // Here we just return the key part or a readable version
      const parts = key.split('.');
      const lastPart = parts[parts.length - 1];
      
      // Simple transform: camelCase to Title Case
      return lastPart
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());
    }
  };
}
