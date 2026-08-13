package com.dracotech.mangalab.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dracotech.mangalab.Entity.Favourite;
import java.util.List;

@Repository
public interface FavouriteRepo extends JpaRepository<Favourite, Long> {
    List<Favourite> findByUserId(Long userId);

    Favourite findByUserIdAndMangaId(Long userId, String mangaId);
}
