package com.invitationes.backend.controllers;

import com.invitationes.backend.models.PageSetting;
import com.invitationes.backend.repositories.PageSettingRepository;
import com.invitationes.backend.services.UpdateEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pages")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201", "http://127.0.0.1:4200", "http://127.0.0.1:4201"}, allowCredentials = "true")
public class PageController {

    @Autowired private PageSettingRepository repository;
    @Autowired private UpdateEventService updates;

    @GetMapping
    public List<PageSetting> list() { return repository.findAllByEnabledTrueOrderByOrderIndexAsc(); }

    @GetMapping("/all")
    public List<PageSetting> listAll() { return repository.findAll(); }

    @PostMapping
    public PageSetting create(@RequestBody PageSetting page) {
        PageSetting saved = repository.save(page);
        updates.broadcast("pages");
        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<PageSetting> update(@PathVariable Long id, @RequestBody PageSetting body) {
        return repository.findById(id).map(p -> {
            p.setPage(body.getPage());
            p.setMenuTitle(body.getMenuTitle());
            p.setOrderIndex(body.getOrderIndex());
            p.setEnabled(body.getEnabled());
            PageSetting saved = repository.save(p);
            updates.broadcast("pages");
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            updates.broadcast("pages");
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}



