package com.dracotech.mangalab.Client;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class MangaDexClient {

        private final RestClient restClient;

        public MangaDexClient(RestClient restClient) {
                this.restClient = restClient;
        }

        // Search By title
        public String searchManga(String title) {
                return restClient.get()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/manga")
                                                .queryParam("title", title)
                                                .queryParam("limit", 18)
                                                .queryParam("includes[]", "cover_art", "author")
                                                .queryParam("contentRating[]", "safe", "suggestive")
                                                .build())
                                .retrieve()
                                .body(String.class);
        }

        public String searchByFeatured() {
                return restClient.get()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/manga")
                                                .queryParam("order[followedCount]", "desc")
                                                .queryParam("limit", 20)
                                                .queryParam("includes[]", "cover_art")
                                                .build())
                                .retrieve()
                                .body(String.class);
        }

        // Search By ID
        public String searchById(String id) {
                return restClient.get()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/manga/{id}")
                                                .queryParam("includes[]", "cover_art", "author", "artist")
                                                .build(id))
                                .retrieve()
                                .body(String.class);
        }

        // Trending
        public String searchByTrending() {
                return restClient.get()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/manga")
                                                .queryParam("order[followedCount]", "desc")
                                                .queryParam("limit", 18)
                                                .queryParam("includes[]", "cover_art", "author")
                                                .queryParam("contentRating[]", "safe", "suggestive")
                                                .build())
                                .retrieve()
                                .body(String.class);
        }

        // Popular
        public String searchByPopular() {
                return restClient.get()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/manga")
                                                .queryParam("order[rating]", "desc")
                                                .queryParam("limit", 18)
                                                .queryParam("includes[]", "cover_art", "author")
                                                .queryParam("contentRating[]", "safe", "suggestive")
                                                .build())
                                .retrieve()
                                .body(String.class);
        }

        // Recent
        public String searchByRecent() {
                return restClient.get()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/manga")
                                                .queryParam("order[latestUploadedChapter]", "desc")
                                                .queryParam("limit", 18)
                                                .queryParam("includes[]", "cover_art", "author")
                                                .queryParam("contentRating[]", "safe", "suggestive")
                                                .build())
                                .retrieve()
                                .body(String.class);
        }

        // Search By Genre/Tag
        public String searchByGenre(String tagId) {
                return restClient.get()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/manga")
                                                .queryParam("includedTags[]", tagId)
                                                .queryParam("limit", 18)
                                                .queryParam("includes[]", "cover_art", "author")
                                                .queryParam("contentRating[]", "safe", "suggestive")
                                                .build())
                                .retrieve()
                                .body(String.class);
        }

        // Search By Chapters
        public String searchByChapter(String id) {
                return restClient.get()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/manga/{id}/feed")
                                                .queryParam("limit", 100)
                                                .queryParam("translatedLanguage[]", "en")
                                                .queryParam("order[chapter]", "desc")
                                                .queryParam("contentRating[]", "safe", "suggestive")
                                                .build(id))
                                .retrieve()
                                .body(String.class);
        }

        // Search By Chapter ID
        public String searchByChapterId(String chapterId) {
                return restClient.get()
                                .uri(uriBuilder -> uriBuilder
                                                .path("/at-home/server/{chapterId}")
                                                .build(chapterId))
                                .retrieve()
                                .body(String.class);
        }
}