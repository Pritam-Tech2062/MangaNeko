package com.dracotech.mangalab.Service;

import org.springframework.stereotype.Service;

import com.dracotech.mangalab.Client.MangaDexClient;

@Service
public class MangaService {

    private final MangaDexClient mangaDexClient;

    public MangaService(MangaDexClient mangaDexClient) {
        this.mangaDexClient = mangaDexClient;
    }

    public String SearchCover(String mangaId) {
        return mangaDexClient.searchCover(mangaId);
    }

    public byte[] getCoverImage(String mangaId, String fileName) {
        return mangaDexClient.getCoverImage(mangaId, fileName);
    }

    public String searchByFeatured() {
        return mangaDexClient.searchByFeatured();
    }

    public String SearchManga(String title) {
        return mangaDexClient.searchManga(title);
    }

    public String SearchById(String id) {
        return mangaDexClient.searchById(id);
    }

    public String SearchByTrending() {
        return mangaDexClient.searchByTrending();
    }

    public String SearchByPopular() {
        return mangaDexClient.searchByPopular();
    }

    public String SearchByRecent() {
        return mangaDexClient.searchByRecent();
    }

    public String SearchByGenre(String tagId) {
        return mangaDexClient.searchByGenre(tagId);
    }

    public String SearchByChapter(String id) {
        return mangaDexClient.searchByChapter(id);
    }

    public String SearchByChapterId(String chapterId) {
        return mangaDexClient.searchByChapterId(chapterId);
    }

}
