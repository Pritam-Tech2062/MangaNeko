import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { MangaDetailsPage } from './pages/MangaDetailsPage';
import { ReaderPage } from './pages/ReaderPage';
import { FavoritesPage } from './pages/FavoritesPage';

export function App() {
  const location = useLocation();
  const isReaderPage = location.pathname.startsWith('/read/');

  return (
    <div className="app-container">
      {!isReaderPage && <Navbar />}

      <div className={isReaderPage ? '' : 'main-content'}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/manga/:id" element={<MangaDetailsPage />} />
          <Route path="/read/:chapterId" element={<ReaderPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </div>

      {!isReaderPage && (
        <footer className="footer">
          <p>
            <span className="brand-accent">MangaNeko 漫画猫</span> &mdash; Modern Dark Manga Reader
          </p>
          <p style={{ marginTop: '0.4rem', fontSize: '0.8rem', opacity: 0.7 }}>
            Powered by Spring Boot Proxy Backend & MangaDex API &bull; Built with React & Vite
          </p>
        </footer>
      )}
    </div>
  );
}

export default App;
