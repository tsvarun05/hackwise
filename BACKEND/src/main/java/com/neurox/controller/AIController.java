package com.neurox.controller;

import com.neurox.service.AIAnalysisService;
import com.neurox.service.GeminiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private static final Logger log = LoggerFactory.getLogger(AIController.class);

    private final AIAnalysisService aiAnalysisService;
    private final GeminiService geminiService;

    public AIController(AIAnalysisService aiAnalysisService, GeminiService geminiService) {
        this.aiAnalysisService = aiAnalysisService;
        this.geminiService     = geminiService;
    }

    /**
     * POST /api/ai/insights
     * Body: { "userId": "...", "domain": "webdev" }
     * Returns full AI analysis: weakAreas, strongAreas, confidenceScore,
     *   explanation, timeSaved, recommendations, enriched roadmap
     */
    @PostMapping("/insights")
    public ResponseEntity<Map<String, Object>> getInsights(@RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        String domain = body.getOrDefault("domain", "");
        log.info("POST /ai/insights userId={} domain={}", userId, domain);
        return ResponseEntity.ok(aiAnalysisService.getInsights(userId, domain));
    }

    /**
     * POST /api/ai/roadmap
     * Body: { "weakConcepts": ["OOP", "DSA"] }
     * Returns: { "aiRoadmap": "..." }
     */
    @PostMapping("/roadmap")
    public ResponseEntity<Map<String, Object>> generateRoadmap(@RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        List<String> weakConcepts = (List<String>) body.get("weakConcepts");
        log.info("POST /ai/roadmap concepts={}", weakConcepts);

        Map<String, Object> response = new LinkedHashMap<>();
        String result = geminiService.generateRoadmap(weakConcepts);

        if (result == null) {
            response.put("aiRoadmap", null);
            response.put("error", "Gemini API key not configured. Add gemini.api.key to application.properties.");
        } else {
            response.put("aiRoadmap", result);
        }
        return ResponseEntity.ok(response);
    }
}
