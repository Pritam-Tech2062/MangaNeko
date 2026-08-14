package com.dracotech.mangalab.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dracotech.mangalab.Entity.Favourite;
import com.dracotech.mangalab.Service.FavouriteService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://manga-neko-ngv5.vercel.app"
})
public class FavouriteController {

    @Autowired
    private FavouriteService favouriteService;

    // Add Favourite
    @PostMapping("/favorites")
    public Favourite addFavourite(@RequestBody Favourite favourite) {
        return favouriteService.addFavourite(favourite);
    }

    // Get Favourite
    @GetMapping({ "/users/{userId}/favorites", "/users/favorites" })
    public List<Favourite> getFavourite(
            @PathVariable(required = false) Long userId,
            @RequestParam(required = false) Long userIdParam) {
        Long idToUse = userId != null ? userId : userIdParam;
        if (idToUse == null) {
            idToUse = 1L;
        }
        return favouriteService.getFavourite(idToUse);
    }

    // Delete Favourite
    @DeleteMapping("/favorites/{mangaId}")
    public ResponseEntity<String> deleteFavourite(
            @PathVariable String mangaId,
            @RequestParam Long userId) {

        favouriteService.deleteFavourite(userId, mangaId);

        return ResponseEntity.ok("Favourite deleted successfully");
    }
}