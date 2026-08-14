/**
 * Safely parses raw response data from Spring Boot / MangaDex proxy.
 * Handle string response bodies safely by parsing once.
 */
export const parseRawData = (data) => {
  if (!data) return null;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Error parsing raw JSON string response:", e);
      return null;
    }
  }
  return data;
};

/**
 * Safely extracts the manga title.
 * Falls back to Japanese, Romaji, or first available language string if English is absent.
 */
export const getMangaTitle = (manga) => {
  if (!manga || !manga.attributes) return 'Untitled Manga';
  const titleObj = manga.attributes.title || {};
  if (titleObj.en) return titleObj.en;
  if (titleObj.ja) return titleObj.ja;
  if (titleObj['ja-ro']) return titleObj['ja-ro'];

  const values = Object.values(titleObj);
  if (values.length > 0) return values[0];

  // Try altTitles array if titleObj is empty
  const altTitles = manga.attributes.altTitles;
  if (Array.isArray(altTitles) && altTitles.length > 0) {
    for (const alt of altTitles) {
      const altVal = Object.values(alt)[0];
      if (altVal) return altVal;
    }
  }

  return 'Untitled Manga';
};

/**
 * Safely extracts description text.
 */
export const getMangaDescription = (manga) => {
  if (!manga || !manga.attributes) return 'No description available.';
  const descObj = manga.attributes.description || {};
  if (descObj.en) return descObj.en;
  const values = Object.values(descObj);
  if (values.length > 0) return values[0];
  return 'No description available.';
};

/**
 * Builds the MangaDex cover art URL.
 * https://uploads.mangadex.org/covers/{mangaId}/{fileName}
 */
export const getMangaCoverUrl = (manga) => {
  if (!manga || !manga.id) {
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><rect width="100%" height="100%" fill="%2314151e"/><text x="50%" y="50%" fill="%239ca3af" font-size="16" font-family="sans-serif" text-anchor="middle">No Cover</text></svg>';
  }

  const relationships = manga.relationships || [];
  const coverArtRel = relationships.find(
    (rel) => rel.type === 'cover_art'
  );

  if (
    coverArtRel &&
    coverArtRel.attributes &&
    coverArtRel.attributes.fileName
  ) {
    return `https://uploads.mangadex.org/covers/${manga.id}/${coverArtRel.attributes.fileName}`;
  }
}

/**
 * Extracts array of tag names (genres).
 */
export const getMangaTags = (manga) => {
  if (!manga || !manga.attributes || !Array.isArray(manga.attributes.tags)) {
    return [];
  }
  return manga.attributes.tags
    .map((tag) => tag.attributes?.name?.en)
    .filter(Boolean);
};

/**
 * Extracts status (ongoing, completed, etc.)
 */
export const getMangaStatus = (manga) => {
  return manga?.attributes?.status || 'unknown';
};
