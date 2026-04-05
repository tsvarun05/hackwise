package com.neurox.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;
import java.time.Duration;
import java.util.*;

@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=";

    @Value("${gemini.api.key:}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public GeminiService(RestTemplateBuilder builder) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(10))
                .build();
    }

    @PostConstruct
    public void validateApiKey() {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("⚠️ Gemini API key is NOT configured!");
        } else {
            log.info("✅ Gemini API key loaded successfully");
        }
    }

    public String generateRoadmap(List<String> weakConcepts) {
        if (!isConfigured()) return null;

        String prompt = """
                You are an expert programming mentor.

                Create a short, structured learning roadmap for these weak topics:
                %s

                Requirements:
                - Bullet points
                - Beginner-friendly
                - Step-by-step progression
                - Keep it concise
                """.formatted(String.join(", ", weakConcepts));

        return callGemini(prompt);
    }

    public String chat(String message) {
        if (!isConfigured()) {
            return "AI Mentor not configured. Please add gemini.api.key.";
        }

        String prompt = """
                You are a helpful coding mentor.

                Rules:
                - Be concise
                - Give examples if needed
                - Be beginner friendly

                Question:
                %s
                """.formatted(message);

        String response = callGemini(prompt);
        return response != null ? response : "AI failed. Try again.";
    }

    private boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    private String callGemini(String prompt) {
        try {
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", prompt)
                            ))
                    )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    GEMINI_URL + apiKey,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                log.error("❌ Gemini API failed: {}", response.getStatusCode());
                return null;
            }

            Map body = response.getBody();
            if (body == null) return null;

            List<Map<String, Object>> candidates =
                    (List<Map<String, Object>>) body.get("candidates");

            if (candidates == null || candidates.isEmpty()) return null;

            Map<String, Object> content =
                    (Map<String, Object>) candidates.get(0).get("content");

            List<Map<String, Object>> parts =
                    (List<Map<String, Object>>) content.get("parts");

            return (String) parts.get(0).get("text");

        } catch (Exception e) {
            log.error("🔥 Gemini API error: ", e);
            return null;
        }
    }
}