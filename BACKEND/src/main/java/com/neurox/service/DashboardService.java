package com.neurox.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private static final Logger log = LoggerFactory.getLogger(DashboardService.class);
    private static final int THRESHOLD = 50;

    private final EvaluationService evaluationService;
    private final ProgressService progressService;
    private final AIAnalysisService aiAnalysisService;

    public DashboardService(EvaluationService evaluationService,
                            ProgressService progressService,
                            AIAnalysisService aiAnalysisService) {
        this.evaluationService = evaluationService;
        this.progressService   = progressService;
        this.aiAnalysisService = aiAnalysisService;
    }

    public Map<String, Object> getDashboard(String userId) {
        log.info("getDashboard userId={}", userId);

        // Base evaluation scores
        Map<String, Integer> scores;
        try {
            scores = evaluationService.evaluate(userId);
        } catch (Exception e) {
            log.warn("No evaluation for userId={}", userId);
            scores = Collections.emptyMap();
        }

        List<String> weakAreas = scores.entrySet().stream()
                .filter(e -> e.getValue() < THRESHOLD)
                .map(Map.Entry::getKey).collect(Collectors.toList());

        List<String> strongAreas = scores.entrySet().stream()
                .filter(e -> e.getValue() >= THRESHOLD)
                .map(Map.Entry::getKey).collect(Collectors.toList());

        int progress         = progressService.getProgressPercentage(userId);
        int modulesCompleted = progressService.getCompletedCount(userId);
        int totalModules     = progressService.getTotalModules();

        // AI extras — confidence + time saved
        Map<String, Object> aiExtras = Collections.emptyMap();
        try {
            String domain = ""; // domain-agnostic for dashboard
            aiExtras = aiAnalysisService.getDashboardExtras(userId, domain);
        } catch (Exception e) {
            log.warn("AI extras failed for userId={}: {}", userId, e.getMessage());
        }

        int confidenceScore = (int) aiExtras.getOrDefault("confidenceScore", 0);
        String timeSavedPct = (String) aiExtras.getOrDefault("timeSaved", "0%");
        Object originalHours  = aiExtras.getOrDefault("originalHours", 0);
        Object optimizedHours = aiExtras.getOrDefault("optimizedHours", 0);

        // Weekly progress placeholder
        List<Map<String, Object>> weeklyProgress = new ArrayList<>();
        for (String day : new String[]{"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"}) {
            Map<String, Object> d = new LinkedHashMap<>();
            d.put("day", day);
            d.put("modules", 0);
            weeklyProgress.add(d);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("progress",        progress);
        result.put("weakAreas",       weakAreas);
        result.put("strongAreas",     strongAreas);
        result.put("modulesCompleted",modulesCompleted);
        result.put("totalModules",    totalModules);
        result.put("streak",          modulesCompleted);
        result.put("hoursSaved",      originalHours instanceof Number n1 && optimizedHours instanceof Number n2
                                        ? Math.round(n1.doubleValue() - n2.doubleValue()) : 0);
        result.put("confidenceScore", confidenceScore);
        result.put("timeSaved",       timeSavedPct);
        result.put("originalHours",   originalHours);
        result.put("optimizedHours",  optimizedHours);
        result.put("weeklyProgress",  weeklyProgress);
        result.put("badges",          Collections.emptyList());

        log.info("Dashboard userId={}: progress={}% confidence={}% timeSaved={}",
                userId, progress, confidenceScore, timeSavedPct);
        return result;
    }
}
