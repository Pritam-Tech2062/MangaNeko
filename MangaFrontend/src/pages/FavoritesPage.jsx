import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import { getFavorites, removeFavorite } from '../api';
import { parseRawData } from '../utils/mangadex';
import { MangaCard } from '../components/MangaCard';
import { LoadingSkeletonGrid, EmptyState, ErrorState } from '../components/States';

export const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getFavorites(1);
      const favList = parseRawData(res.data) || [];
      setFavorites(Array.isArray(favList) ? favList : []);
    } catch (err) {
      console.error("Failed to load user favorites:", err);
      setError("Failed to load your favorites list from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserFavorites();
  }, []);

  const handleRemoveFavorite = async (favData) => {
    const { mangaId } = favData;
    try {
      await removeFavorite(mangaId, 1);
      // Refresh list immediately after deleting
      await fetchUserFavorites();
    } catch (err) {
      console.error("Failed to delete favorite:", err);
    }
  };

  return (
    <div className="favorites-page">
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="section-title">
          <Bookmark className="section-title-icon" fill="var(--accent-red)" /> Your Favorite Manga ({favorites.length})
        </h1>
      </div>

      {loading ? (
        <LoadingSkeletonGrid count={8} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchUserFavorites} />
      ) : favorites.length === 0 ? (
        <EmptyState
          title="Your Library is Empty"
          message="You haven't saved any manga to your favorites yet. Click the bookmark icon on any manga card to save it here!"
        />
      ) : (
        <div className="manga-grid">
          {favorites.map((fav) => (
            <MangaCard
              key={fav.id || fav.mangaId}
              manga={fav}
              isFavorite={true}
              onToggleFavorite={handleRemoveFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};
