import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bookmark, BookOpen, Clock, Tag, ArrowLeft, Play } from 'lucide-react';
import {
  getManga,
  getChapters,
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../api';
import {
  parseRawData,
  getMangaTitle,
  getMangaDescription,
  getMangaCoverUrl,
  getMangaTags,
  getMangaStatus,
} from '../utils/mangadex';
import { LoadingSpinner, ErrorState } from '../components/States';

export const MangaDetailsPage = () => {
  const { id } = useParams();

  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMangaDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const [mangaRes, chaptersRes, favsRes] = await Promise.all([
        getManga(id),
        getChapters(id),
        getFavorites(1),
      ]);

      const mangaParsed = parseRawData(mangaRes.data);
      const mangaData = mangaParsed?.data;

      if (!mangaData) {
        setError("Manga details not found.");
        return;
      }
      setManga(mangaData);

      const chaptersParsed = parseRawData(chaptersRes.data);
      const chapterList = chaptersParsed?.data || [];
      setChapters(chapterList);

      const favsParsed = parseRawData(favsRes.data) || [];
      if (Array.isArray(favsParsed)) {
        const found = favsParsed.some((f) => f.mangaId === id);
        setIsFavorite(found);
      }
    } catch (err) {
      console.error("Error loading manga details:", err);
      setError("Failed to fetch manga details from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadMangaDetails();
    }
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!manga) return;
    const title = getMangaTitle(manga);
    const coverUrl = getMangaCoverUrl(manga);

    try {
      if (isFavorite) {
        await removeFavorite(id, 1);
        setIsFavorite(false);
      } else {
        await addFavorite({
          userId: 1,
          mangaId: id,
          mangaTitle: title,
          mangaCover: coverUrl,
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Failed to update favorite status:", err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Fetching manga details and chapter list..." />;
  }

  if (error || !manga) {
    return <ErrorState message={error || 'Manga not found'} onRetry={loadMangaDetails} />;
  }

  const title = getMangaTitle(manga);
  const description = getMangaDescription(manga);
  const coverUrl = getMangaCoverUrl(manga);
  const status = getMangaStatus(manga);
  const tags = getMangaTags(manga);

  return (
    <div className="manga-details-page">
      <Link
        to="/browse"
        className="section-more-link"
        style={{ marginBottom: '1.25rem', display: 'inline-flex', alignItems: 'center' }}
      >
        <ArrowLeft size={16} /> Back to Browse
      </Link>

      {/* Hero Details Header */}
      <div className="details-hero">
        <div
          className="details-backdrop"
          style={{ backgroundImage: `url(${coverUrl})` }}
        />

        <div className="details-grid">
          <div className="details-cover">
            <img src={coverUrl} alt={title} />
          </div>

          <div>
            <h1 className="details-title">{title}</h1>

            <div className="details-meta-bar">
              <span className={`status-badge ${status.toLowerCase()}`}>
                Status: {status}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                {chapters.length} Chapters Available
              </span>
            </div>

            {tags.length > 0 && (
              <div className="details-tag-list">
                {tags.map((tag, i) => (
                  <span key={i} className="tag-badge">
                    <Tag size={12} style={{ marginRight: '4px' }} /> {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="details-description">{description}</p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {chapters.length > 0 && (
                <Link to={`/read/${chapters[chapters.length - 1].id}`} className="btn-primary">
                  <Play size={18} /> Start Reading Ch. 1
                </Link>
              )}

              <button
                type="button"
                className={`btn-secondary ${isFavorite ? 'is-favorite' : ''}`}
                onClick={handleToggleFavorite}
                style={{
                  background: isFavorite ? 'var(--accent-red)' : 'var(--bg-surface)',
                  color: isFavorite ? '#fff' : 'var(--text-primary)',
                  borderColor: isFavorite ? 'var(--accent-red)' : 'var(--border-color)',
                }}
              >
                <Bookmark size={18} fill={isFavorite ? '#fff' : 'none'} />
                {isFavorite ? 'In Favorites' : 'Add to Favorites'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Section */}
      <div className="chapters-section">
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <h2 className="section-title">
            <BookOpen className="section-title-icon" /> Chapter List ({chapters.length})
          </h2>
        </div>

        {chapters.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
            No chapters available in English for this manga yet.
          </p>
        ) : (
          <div className="chapter-list">
            {chapters.map((ch) => {
              const chNum = ch.attributes?.chapter || '?';
              const chTitle = ch.attributes?.title ? `: ${ch.attributes.title}` : '';
              const vol = ch.attributes?.volume ? `Vol. ${ch.attributes.volume} ` : '';

              return (
                <Link key={ch.id} to={`/read/${ch.id}`} className="chapter-item">
                  <div className="chapter-title">
                    <BookOpen size={16} style={{ color: 'var(--accent-red)' }} />
                    <span>
                      {vol}Chapter {chNum}{chTitle}
                    </span>
                  </div>
                  <span className="chapter-sub">Read Chapter &rarr;</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
