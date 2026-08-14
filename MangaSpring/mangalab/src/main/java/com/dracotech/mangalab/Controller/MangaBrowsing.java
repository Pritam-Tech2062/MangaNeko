package com.dracotech.mangalab.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.dracotech.mangalab.Service.MangaService;

@RestController
@RequestMapping("/api/manga")
public class MangaBrowsing {

    @Autowired
    public MangaService mangaService;

    @GetMapping("/cover")
    public String getCover(@RequestParam String mangaId) {
        return mangaService.SearchCover(mangaId);
    }

    @GetMapping("/search")
    public String searchManga(@RequestParam String title) {
        return mangaService.SearchManga(title);
    }

    @GetMapping("/featured")
    public String searchByFeatured() {
        return mangaService.searchByFeatured();
    }

    @GetMapping("/searchid")
    public String searchById(@RequestParam String id) {
        return mangaService.SearchById(id);
    }

    @GetMapping("/trending")
    public String searchByTrending() {
        return mangaService.SearchByTrending();
    }

    @GetMapping("/popular")
    public String searchByPopular() {
        return mangaService.SearchByPopular();
    }

    @GetMapping("/recent")
    public String searchByRecent() {
        return mangaService.SearchByRecent();
    }

    @GetMapping("/genreid")
    public String searchByGenre(@RequestParam String tagId) {
        return mangaService.SearchByGenre(tagId);
    }

    @GetMapping("/chapters")
    public String searchByChapter(@RequestParam String id) {
        return mangaService.SearchByChapter(id);
    }

    @GetMapping("/chapterid")
    public String searchByChapterId(@RequestParam String chapterId) {
        return mangaService.SearchByChapterId(chapterId);
    }
}
