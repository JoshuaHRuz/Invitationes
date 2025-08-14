package com.invitationes.backend.controllers;

import com.invitationes.backend.models.LandingSection;
import com.invitationes.backend.models.LandingSlide;
import com.invitationes.backend.repositories.LandingSectionRepository;
import com.invitationes.backend.repositories.LandingSlideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/landing")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201", "http://127.0.0.1:4200", "http://127.0.0.1:4201"}, allowCredentials = "true")
public class LandingController {

    @Autowired
    private LandingSlideRepository slideRepository;

    @Autowired
    private LandingSectionRepository sectionRepository;

    @Autowired
    private com.invitationes.backend.services.UpdateEventService updates;

    // Public GETs
    @GetMapping("/slides")
    public List<LandingSlide> getSlides() {
        return slideRepository.findAllByActiveTrueOrderByOrderIndexAsc();
    }

    @GetMapping("/sections")
    public List<LandingSection> getSections() {
        return sectionRepository.findAllByActiveTrueOrderByOrderIndexAsc();
    }

    // Admin CRUD
    @PostMapping("/slides")
    public LandingSlide createSlide(@RequestBody LandingSlide slide) {
        LandingSlide saved = slideRepository.save(slide);
        updates.broadcast("landing");
        return saved;
    }

    @PutMapping("/slides/{id}")
    public ResponseEntity<LandingSlide> updateSlide(@PathVariable Long id, @RequestBody LandingSlide slide) {
        return slideRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(slide.getTitle());
                    existing.setSubtitle(slide.getSubtitle());
                    existing.setImageUrl(slide.getImageUrl());
                    existing.setBackgroundColor(slide.getBackgroundColor());
                    existing.setOrderIndex(slide.getOrderIndex());
                    existing.setActive(slide.getActive());
                    existing.setOverlayEnabled(slide.getOverlayEnabled());
                    existing.setOverlayOpacity(slide.getOverlayOpacity());
                    LandingSlide saved = slideRepository.save(existing);
                    updates.broadcast("landing");
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/slides/{id}")
    public ResponseEntity<Void> deleteSlide(@PathVariable Long id) {
        if (slideRepository.existsById(id)) {
            slideRepository.deleteById(id);
            updates.broadcast("landing");
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/sections")
    public LandingSection createSection(@RequestBody LandingSection section) {
        LandingSection saved = sectionRepository.save(section);
        updates.broadcast("landing");
        return saved;
    }

    @PutMapping("/sections/{id}")
    public ResponseEntity<LandingSection> updateSection(@PathVariable Long id, @RequestBody LandingSection section) {
        return sectionRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(section.getTitle());
                    existing.setContentHtml(section.getContentHtml());
                    existing.setImageUrl(section.getImageUrl());
                    existing.setImageSide(section.getImageSide());
                    existing.setOrderIndex(section.getOrderIndex());
                    existing.setActive(section.getActive());
                    LandingSection saved = sectionRepository.save(existing);
                    updates.broadcast("landing");
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/sections/{id}")
    public ResponseEntity<Void> deleteSection(@PathVariable Long id) {
        if (sectionRepository.existsById(id)) {
            sectionRepository.deleteById(id);
            updates.broadcast("landing");
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}



