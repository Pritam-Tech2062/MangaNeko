import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, ChevronUp } from 'lucide-react';
import { getChapter } from '../api';
import { parseRawData } from '../utils/mangadex';
import { LoadingSpinner, ErrorState } from '../components/States';

export const ReaderPage = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();

  const [pageUrls, setPageUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadChapterPages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getChapter(chapterId);
      const data = parseRawData(res.data);

      if (!data || !data.baseUrl || !data.chapter || !Array.isArray(data.chapter.data)) {
        setError("Unable to load chapter image data from MangaDex server.");
        return;
      }

      const { baseUrl, chapter } = data;
      const { hash, data: pageFiles } = chapter;

      // Construct image URLs: baseUrl/data/hash/fileName
      const urls = pageFiles.map(
        (fileName) => `${baseUrl}/data/${hash}/${fileName}`
      );
      setPageUrls(urls);
    } catch (err) {
      console.error("Error loading chapter reader pages:", err);
      setError("Failed to fetch chapter images from Spring Boot backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chapterId) {
      loadChapterPages();
    }
  }, [chapterId]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <LoadingSpinner message="Downloading chapter pages from MangaDex..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadChapterPages} />;
  }

  return (
    <div className="reader-container">
      {/* Reader Header Bar */}
      <header className="reader-header">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-secondary"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ textAlign: 'center', color: '#fff', fontSize: '0.9rem', fontWeight: '700' }}>
          <BookOpen size={16} style={{ color: 'var(--accent-red)', verticalAlign: 'middle', marginRight: '6px' }} />
          Reading Chapter ({pageUrls.length} Pages)
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          className="btn-secondary"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
        >
          <ChevronUp size={16} /> Top
        </button>
      </header>

      {/* Pages Container - Vertical Scroll Reading */}
      <main className="reader-pages">
        {pageUrls.map((url, idx) => (
          <div key={idx} style={{ position: 'relative', width: '100%', marginBottom: '1px' }}>
            <img
              src={url}
              alt={`Page ${idx + 1}`}
              className="reader-page-img"
              loading="lazy"
            />
            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '12px',
                background: 'rgba(0, 0, 0, 0.65)',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                backdropFilter: 'blur(4px)',
              }}
            >
              {idx + 1} / {pageUrls.length}
            </div>
          </div>
        ))}
      </main>

      <footer style={{ padding: '2rem', textAlign: 'center', background: '#08090c' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          End of Chapter ({pageUrls.length} Pages read)
        </p>
        <button type="button" onClick={() => navigate(-1)} className="btn-primary">
          <ArrowLeft size={16} /> Return to Manga Details
        </button>
      </footer>
    </div>
  );
};
