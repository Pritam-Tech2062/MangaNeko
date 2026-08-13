import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, BookOpen, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  getMangaTitle,
  getMangaDescription,
  getMangaCoverUrl,
  getMangaTags,
} from '../utils/mangadex';

export const HeroSection = ({ mangaList = [], manga = null }) => {
  const items = mangaList.length > 0 ? mangaList : (manga ? [manga] : []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
      setFadeKey((prevKey) => prevKey + 1);
    }, 5000);

    return () => clearInterval(timer);
  }, [items.length, isPaused]);

  if (items.length === 0) return null;

  const currentManga = items[currentIndex];
  const title = getMangaTitle(currentManga);
  const description = getMangaDescription(currentManga);
  const coverUrl = getMangaCoverUrl(currentManga);
  const tags = getMangaTags(currentManga).slice(0, 3);

  const handlePrev = (e) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    setFadeKey((prev) => prev + 1);
  };

  const handleNext = (e) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setFadeKey((prev) => prev + 1);
  };

  const handleSelectSlide = (idx) => {
    setCurrentIndex(idx);
    setFadeKey((prev) => prev + 1);
  };

  return (
    <div
      className="hero-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="hero-backdrop-wrapper">
        <img
          key={`backdrop-img-${fadeKey}`}
          src={coverUrl}
          alt={title}
          className="hero-backdrop-img hero-fade-anim"
        />
        <div className="hero-overlay" />
      </div>

      <div className="hero-body">
        <div key={`content-${fadeKey}`} className="hero-content hero-fade-anim">
          <div className="hero-tag">
            <Sparkles size={14} /> FEATURED ANIME WALLPAPER ({currentIndex + 1}/{items.length})
          </div>

          <h1 className="hero-title">{title}</h1>

          <p className="hero-description">{description}</p>

          {tags.length > 0 && (
            <div className="details-tag-list" style={{ marginBottom: '1.5rem' }}>
              {tags.map((tag, i) => (
                <span key={i} className="tag-badge">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="hero-actions">
            <Link to={`/manga/${currentManga.id}`} className="btn-primary">
              <BookOpen size={18} /> View Chapters
            </Link>
            <Link to={`/manga/${currentManga.id}`} className="btn-secondary">
              <Info size={18} /> Details
            </Link>
          </div>
        </div>

        <div className="hero-poster-wrapper">
          <img
            key={`poster-img-${fadeKey}`}
            src={coverUrl}
            alt={title}
            className="hero-poster-img hero-fade-anim"
          />
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            className="hero-nav-btn hero-nav-prev"
            onClick={handlePrev}
            aria-label="Previous Wallpaper"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            className="hero-nav-btn hero-nav-next"
            onClick={handleNext}
            aria-label="Next Wallpaper"
          >
            <ChevronRight size={22} />
          </button>

          <div className="hero-dots">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`hero-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => handleSelectSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
