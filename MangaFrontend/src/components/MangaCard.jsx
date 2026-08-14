import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import {
  getMangaTitle,
  getMangaCoverUrl,
  getMangaStatus,
} from '../utils/mangadex';

export const MangaCard = ({ manga, isFavorite = false, onToggleFavorite }) => {
  if (!manga) return null;

  // Handle both raw MangaDex item format and backend Favourite object format safely
  const mangaId = manga.mangaId || manga.id;
  const title = manga.mangaTitle || getMangaTitle(manga);


  console.log("Manga object:", manga);
  console.log("Manga ID:", manga.id);
  console.log("Relationships:", manga.relationships);
  console.log("Cover URL:", getMangaCoverUrl(manga));
  const coverUrl = manga.mangaCover || getMangaCoverUrl(manga);


  const status = getMangaStatus(manga);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite({
        userId: 1,
        mangaId,
        mangaTitle: title,
        mangaCover: coverUrl,
      });
    }
  };

  return (
    <div className="manga-card">
      <Link to={`/manga/${mangaId}`}>
        <div className="manga-cover-wrapper">
          <img
            src={coverUrl}
            alt={title}
            className="manga-cover-image"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><rect width="100%" height="100%" fill="%2314151e"/><text x="50%" y="50%" fill="%239ca3af" font-size="16" font-family="sans-serif" text-anchor="middle">No Cover</text></svg>';
            }}
          />
          <div className="manga-card-overlay" />

          {onToggleFavorite && (
            <button
              type="button"
              className={`favorite-btn-floating ${isFavorite ? 'is-favorite' : ''}`}
              onClick={handleFavoriteClick}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Bookmark size={18} fill={isFavorite ? '#fff' : 'none'} />
            </button>
          )}

          {status !== 'unknown' && (
            <span className={`status-badge ${status.toLowerCase()}`}>
              {status}
            </span>
          )}
        </div>

        <div className="manga-card-info">
          <h3 className="manga-card-title">{title}</h3>
        </div>
      </Link>
    </div>
  );
};
