package com.invitationes.backend.controllers;

import com.invitationes.backend.models.ThemeSettings;
import com.invitationes.backend.repositories.ThemeSettingsRepository;
import com.invitationes.backend.services.UpdateEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theme")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201", "http://127.0.0.1:4200", "http://127.0.0.1:4201"}, allowCredentials = "true")
public class ThemeController {

    @Autowired
    private ThemeSettingsRepository repository;

    @Autowired
    private UpdateEventService updates;

    @GetMapping
    public ThemeSettings get() {
        List<ThemeSettings> all = repository.findAll();
        if (all.isEmpty()) {
            ThemeSettings def = new ThemeSettings();
            def.setPrimaryColor("#6a1b9a");
            def.setSecondaryColor("#880e4f");
            def.setBackgroundColor("#ffffff");
            def.setTextColor("#111827");
            def.setPrimaryFont("Poppins");
            def.setHeadingsFont("Poppins");
            def.setBaseFontSize("16px");
            def.setHeadingsTextColor(null);
            def.setButtonPrimaryTextColor("#ffffff");
            return repository.save(def);
        }
        return all.get(0);
    }

    @PutMapping
    public ResponseEntity<ThemeSettings> update(@RequestBody ThemeSettings body) {
        ThemeSettings current = get();
        current.setPrimaryColor(body.getPrimaryColor());
        current.setSecondaryColor(body.getSecondaryColor());
        current.setBackgroundColor(body.getBackgroundColor());
        current.setTextColor(body.getTextColor());
        current.setPrimaryFont(body.getPrimaryFont());
        current.setHeadingsFont(body.getHeadingsFont());
        current.setBaseFontSize(body.getBaseFontSize());
        current.setHeadingsTextColor(body.getHeadingsTextColor());
        current.setButtonPrimaryTextColor(body.getButtonPrimaryTextColor());
        ThemeSettings saved = repository.save(current);
        updates.broadcast("theme");
        return ResponseEntity.ok(saved);
    }
}


