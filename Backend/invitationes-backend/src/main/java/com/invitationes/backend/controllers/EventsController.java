package com.invitationes.backend.controllers;

import com.invitationes.backend.services.UpdateEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201", "http://127.0.0.1:4200", "http://127.0.0.1:4201"}, allowCredentials = "true")
public class EventsController {

    @Autowired
    private UpdateEventService updates;

    @GetMapping(path = "/updates", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe() {
        return updates.subscribe();
    }
}


