import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Sparkles } from 'lucide-react';
import {
  searchManga,
  getMangaByGenre,
  getPopularManga,
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../api';
import { parseRawData } from '../utils/mangadex';
import { MangaCard } from '../components/MangaCard';
import { LoadingSkeletonGrid, EmptyState, ErrorState } from '../components/States';

const GENRE_TAGS = [
  { name: 'All Popular', id: '' },
  { name: 'Action', id: '391b0423-d84b-456f-908c-c7097449d0c7' },
  { name: 'Romance', id: '423e203a-c1f5-4a95-9a7f-66b5770c6168' },
  { name: 'Fantasy', id: 'cdc14744-41f0-413e-a465-429dd3568772' },
  { name: 'Sci-Fi', id: '25665670-532e-450f-90c7-4ab2659e9842' },
  { name: 'Comedy', id: '4d321403-97be-4191-9c9b-234c9f9f5752' },
  { name: 'Drama', id: 'b9af3a63-f058-46de-a9a0-e0c13906197a' },
  { name: 'Supernatural', id: 'e6444494-663d-4cf9-b29d-8a501bba053a' },
];

export const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('search') || '';

  const [titleInput, setTitleInput] = useState(queryFromUrl);
  const [selectedTag, setSelectedTag] = useState('');
  const [mangaList, setMangaList] = useState([]);
  const [favoritesMap, setFavoritesMap] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    try {
      const res = await getFavorites(1);
      const favList = parseRawData(res.data) || [];
      const map = {};
      if (Array.isArray(favList)) {
        favList.forEach((fav) => {
          map[fav.mangaId] = fav;
        });
      }
      setFavoritesMap(map);
    } catch (err) {
      console.error("Failed to load user favorites:", err);
    }
  };

  const loadBrowseData = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (queryFromUrl.trim()) {
        response = await searchManga(queryFromUrl.trim());
      } else if (selectedTag) {
        response = await getMangaByGenre(selectedTag);
      } else {
        response = await getPopularManga();
      }

      const parsed = parseRawData(response.data);
      const items = parsed?.data || [];
      setMangaList(items);

      await fetchFavorites();
    } catch (err) {
      console.error("Failed to fetch browse manga data:", err);
      setError("Failed to load browse results from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTitleInput(queryFromUrl);
    loadBrowseData();
  }, [queryFromUrl, selectedTag]);

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    setSelectedTag('');
    if (titleInput.trim()) {
      setSearchParams({ search: titleInput.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleSelectGenre = (tagId) => {
    setTitleInput('');
    setSearchParams({});
    setSelectedTag(tagId);
  };

  const handleToggleFavorite = async (favData) => {
    const { mangaId } = favData;
    const isFav = !!favoritesMap[mangaId];

    try {
      if (isFav) {
        await removeFavorite(mangaId, 1);
        setFavoritesMap((prev) => {
          const next = { ...prev };
          delete next[mangaId];
          return next;
        });
      } else {
        await addFavorite(favData);
        setFavoritesMap((prev) => ({
          ...prev,
          [mangaId]: favData,
        }));
      }
    } catch (err) {
      console.error("Failed to update favorite status:", err);
    }
  };

  return (
    <div className="browse-page">
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="section-title">
          <Filter className="section-title-icon" /> Browse & Search Manga
        </h1>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchFormSubmit} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            className="nav-search-input"
            style={{
              width: '100%',
              paddingLeft: '2.8rem',
              paddingTop: '0.85rem',
              paddingBottom: '0.85rem',
              fontSize: '1rem',
              borderRadius: 'var(--radius-md)',
            }}
            placeholder="Search manga by title (e.g., One Piece, Naruto, Jujutsu Kaisen)..."
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary" style={{ padding: '0 1.75rem' }}>
          Search
        </button>
      </form>

      {/* Genre Filter Tag Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2.5rem' }}>
        {GENRE_TAGS.map((tag) => {
          const isActive = selectedTag === tag.id && !queryFromUrl;
          return (
            <button
              key={tag.name}
              type="button"
              className="tag-badge"
              style={{
                background: isActive ? 'var(--accent-red)' : 'var(--bg-card)',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                border: isActive
                  ? '1px solid var(--accent-red)'
                  : '1px solid var(--border-color)',
                cursor: 'pointer',
                padding: '0.45rem 1rem',
                fontSize: '0.85rem',
              }}
              onClick={() => handleSelectGenre(tag.id)}
            >
              {tag.name}
            </button>
          );
        })}
      </div>

      {/* Results Content */}
      {loading ? (
        <LoadingSkeletonGrid count={12} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadBrowseData} />
      ) : mangaList.length === 0 ? (
        <EmptyState
          title="No Manga Found"
          message={`No results matched your search "${queryFromUrl || 'selected criteria'}". Try a different query.`}
        />
      ) : (
        <div className="manga-grid">
          {mangaList.map((manga) => (
            <MangaCard
              key={manga.id}
              manga={manga}
              isFavorite={!!favoritesMap[manga.id]}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};
