const RECENT_SEARCHES_KEY = "recent_searches";
const MAX_RECENT_SEARCHES = 5;

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const searches = localStorage.getItem(RECENT_SEARCHES_KEY);
    return searches ? JSON.parse(searches) : [];
  } catch (error) {
    console.error("Failed to parse recent searches", error);
    return [];
  }
}

export function addSearch(query: string): string[] {
  if (typeof window === "undefined" || !query.trim()) return [];
  
  const currentSearches = getRecentSearches();
  const trimmedQuery = query.trim();
  
  // Remove existing instance to push to top
  const filteredSearches = currentSearches.filter(
    (s) => s.toLowerCase() !== trimmedQuery.toLowerCase()
  );
  
  // Add to top and truncate
  const updatedSearches = [trimmedQuery, ...filteredSearches].slice(
    0,
    MAX_RECENT_SEARCHES
  );
  
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
  } catch (error) {
    console.error("Failed to save recent searches", error);
  }
  
  return updatedSearches;
}

export function removeSearch(query: string): string[] {
  if (typeof window === "undefined") return [];
  
  const currentSearches = getRecentSearches();
  const updatedSearches = currentSearches.filter(
    (s) => s.toLowerCase() !== query.toLowerCase()
  );
  
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
  } catch (error) {
    console.error("Failed to update recent searches", error);
  }
  
  return updatedSearches;
}

export function clearSearches(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}
