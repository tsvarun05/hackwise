package com.neurox.controller;

import com.neurox.service.GeminiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/mentor")
@CrossOrigin(origins = "*")
public class MentorController {

    private static final Logger log = LoggerFactory.getLogger(MentorController.class);

    private final GeminiService geminiService;

    public MentorController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    /**
     * POST /api/mentor/chat
     * Body: { "message": "..." }
     * Returns: { "reply": "..." }
     */
    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> body) {
        String message = body.getOrDefault("message", "");
        log.info("Mentor chat: {}", message);
        String reply = geminiService.chat(message);
        return ResponseEntity.ok(Map.of("reply", reply));
    }
}
