package com.invitationes.backend.controllers;

import com.invitationes.backend.models.ContentBlock;
import com.invitationes.backend.repositories.ContentBlockRepository;
import com.invitationes.backend.services.UpdateEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/content")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201", "http://127.0.0.1:4200", "http://127.0.0.1:4201"}, allowCredentials = "true")
public class ContentController {

    @Autowired private ContentBlockRepository repository;
    @Autowired private UpdateEventService updates;

    @GetMapping("/{page}")
    public List<ContentBlock> getPage(@PathVariable String page) {
        return repository.findAllByPageAndActiveTrueOrderByOrderIndexAsc(page);
    }

    @GetMapping("/{page}/all")
    public List<ContentBlock> getPageAll(@PathVariable String page) {
        return repository.findAllByPageOrderByOrderIndexAsc(page);
    }

    @PostMapping
    public ContentBlock create(@RequestBody ContentBlock block) {
        ContentBlock saved = repository.save(block);
        updates.broadcast("content");
        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContentBlock> update(@PathVariable Long id, @RequestBody ContentBlock body) {
        return repository.findById(id).map(b -> {
            b.setPage(body.getPage());
            b.setBlockType(body.getBlockType());
            b.setTitle(body.getTitle());
            b.setSubtitle(body.getSubtitle());
            b.setContentHtml(body.getContentHtml());
            b.setImageUrl(body.getImageUrl());
            b.setImageSide(body.getImageSide());
            b.setDataJson(body.getDataJson());
            b.setOrderIndex(body.getOrderIndex());
            b.setActive(body.getActive());
            ContentBlock saved = repository.save(b);
            updates.broadcast("content");
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            updates.broadcast("content");
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}



