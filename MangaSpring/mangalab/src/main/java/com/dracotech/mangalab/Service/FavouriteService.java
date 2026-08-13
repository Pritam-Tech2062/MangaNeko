package com.dracotech.mangalab.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dracotech.mangalab.Entity.Favourite;
import com.dracotech.mangalab.Repository.FavouriteRepo;

@Service
public class FavouriteService {

    @Autowired
    private FavouriteRepo favouriteRepo;

    public Favourite addFavourite(Favourite favourite) {
        return favouriteRepo.save(favourite);
    }

    public List<Favourite> getFavourite(Long userId) {
        return favouriteRepo.findByUserId(userId);
    }

    public void deleteFavourite(Long userId, String mangaId) {

        Favourite favourite = favouriteRepo.findByUserIdAndMangaId(userId, mangaId);

        if (favourite != null) {
            favouriteRepo.delete(favourite);
        }
    }
}
