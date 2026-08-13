import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import {
  getTrendingManga,
  getPopularManga,
  getRecentlyUpdatedManga,
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../api';
import { parseRawData } from '../utils/mangadex';
import { MangaCard } from '../components/MangaCard';
import { HeroSection } from '../components/HeroSection';
import { LoadingSkeletonGrid, ErrorState } from '../components/States';

export const HomePage = () => {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [recent, setRecent] = useState([]);
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

  const loadHomeData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [trendRes, popRes, recRes] = await Promise.all([
        getTrendingManga(),
        getPopularManga(),
        getRecentlyUpdatedManga(),
      ]);

      const trendData = parseRawData(trendRes.data)?.data || [];
      const popData = parseRawData(popRes.data)?.data || [];
      const recData = parseRawData(recRes.data)?.data || [];

      setTrending(trendData);
      setPopular(popData);
      setRecent(recData);

      await fetchFavorites();
    } catch (err) {
      console.error("Failed to fetch home page manga data:", err);
      setError("Unable to connect to backend server. Please verify Spring Boot is running on http://localhost:8080.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

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

  if (loading) {
    return (
      <div>
        <div className="skeleton-card" style={{ height: '320px', marginBottom: '3rem' }} />
        <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Loading Trending Manga...</h2>
        <LoadingSkeletonGrid count={6} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadHomeData} />;
  }

  return (
    <div className="home-page">
      {trending.length > 0 && <HeroSection mangaList={trending.slice(0, 6)} />}

      {/* Trending Section */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div className="section-header">
          <h2 className="section-title">
            <Flame className="section-title-icon" /> Trending Manga
          </h2>
          <Link to="/browse" className="section-more-link">
            Explore All <ChevronRight size={16} />
          </Link>
        </div>

        <div className="manga-grid">
          {trending.slice(0, 6).map((manga) => (
            <MangaCard
              key={manga.id}
              manga={manga}
              isFavorite={!!favoritesMap[manga.id]}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* Popular Section */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div className="section-header">
          <h2 className="section-title">
            <TrendingUp className="section-title-icon" /> Top Rated & Popular
          </h2>
          <Link to="/browse" className="section-more-link">
            View Popular <ChevronRight size={16} />
          </Link>
        </div>

        <div className="manga-grid">
          {popular.slice(0, 6).map((manga) => (
            <MangaCard
              key={manga.id}
              manga={manga}
              isFavorite={!!favoritesMap[manga.id]}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* Recently Updated Section */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div className="section-header">
          <h2 className="section-title">
            <Clock className="section-title-icon" /> Recently Updated
          </h2>
          <Link to="/browse" className="section-more-link">
            View Recent <ChevronRight size={16} />
          </Link>
        </div>

        <div className="manga-grid">
          {recent.slice(0, 6).map((manga) => (
            <MangaCard
              key={manga.id}
              manga={manga}
              isFavorite={!!favoritesMap[manga.id]}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
