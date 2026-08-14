import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Search manga by title
export const searchManga = (title) => {
  return api.get('/manga/search', {
    params: { title },
  });
};

// Get single manga details by id
export const getManga = (mangaId) => {
  return api.get('/manga/searchid', {
    params: { id: mangaId },
  });
};

// Get trending manga list
export const getTrendingManga = () => {
  return api.get('/manga/trending');
};

// Get popular manga list
export const getPopularManga = () => {
  return api.get('/manga/popular');
};

// Get recently updated manga list
export const getRecentlyUpdatedManga = () => {
  return api.get('/manga/recent');
};

// Get manga by genre tag ID
export const getMangaByGenre = (tagId) => {
  return api.get('/manga/genreid', {
    params: { tagId },
  });
};

// Get list of chapters for a manga by manga ID
export const getChapters = (mangaId) => {
  return api.get('/manga/chapters', {
    params: { id: mangaId },
  });
};

// Get single chapter details by chapter ID
export const getChapter = (chapterId) => {
  return api.get('/manga/chapterid', {
    params: { chapterId },
  });
};

// Get user favorites list
export const getFavorites = (userId = 1) => {
  return api.get('/users/favorites', {
    params: { userId },
  });
};

// Add a favorite manga
export const addFavorite = (favoriteData) => {
  return api.post('/favorites', favoriteData);
};

// Remove a favorite manga
export const removeFavorite = (mangaId, userId = 1) => {
  return api.delete(`/favorites/${mangaId}`, {
    params: { userId },
  });
};

export default api;
