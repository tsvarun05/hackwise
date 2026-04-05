package com.neurox.service;

import com.neurox.entity.Unit;
import com.neurox.entity.UnitQuiz;
import com.neurox.repository.ProgressRepository;
import com.neurox.repository.UnitQuizRepository;
import com.neurox.repository.UnitRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private static final Logger log = LoggerFactory.getLogger(CourseService.class);
    private static final int STRONG_THRESHOLD = 75;
    private static final int WEAK_THRESHOLD   = 50;

    private final UnitRepository unitRepository;
    private final UnitQuizRepository unitQuizRepository;
    private final ProgressRepository progressRepository;
    private final EvaluationService evaluationService;

    public CourseService(UnitRepository unitRepository,
                         UnitQuizRepository unitQuizRepository,
                         ProgressRepository progressRepository,
                         EvaluationService evaluationService) {
        this.unitRepository     = unitRepository;
        this.unitQuizRepository = unitQuizRepository;
        this.progressRepository = progressRepository;
        this.evaluationService  = evaluationService;
    }

    /** Returns all units for a domain, with status set per user */
    public Map<String, Object> getCourse(String courseId, String userId) {
        log.info("getCourse courseId={} userId={}", courseId, userId);

        List<Unit> units = unitRepository.findByCourseIdOrderByOrderIndex(courseId);
        if (units.isEmpty()) {
            return Map.of("units", List.of(), "metrics", Map.of());
        }

        // Get completed unit IDs for this user
        Set<String> completedIds = progressRepository.findByUserId(userId).stream()
                .filter(p -> p.isCompleted())
                .map(p -> p.getModuleId()) // moduleId stores unitId
                .collect(Collectors.toSet());

        // Get concept scores for adaptive filtering
        Map<String, Integer> scores = safeEvaluate(userId);

        // Assign status to each unit
        boolean foundCurrent = false;
        List<Map<String, Object>> enriched = new ArrayList<>();

        for (Unit u : units) {
            String status;
            int score = scores.getOrDefault(u.getConcept(), -1);

            if (completedIds.contains(u.getId())) {
                status = "completed";
            } else if (score >= STRONG_THRESHOLD) {
                status = "strong"; // can skip
            } else if (score >= 0 && score < WEAK_THRESHOLD) {
                status = "weak";   // must do
                if (!foundCurrent) { status = "current"; foundCurrent = true; }
            } else if (!foundCurrent) {
                status = "current";
                foundCurrent = true;
            } else {
                status = "locked";
            }

            Map<String, Object> node = new LinkedHashMap<>();
            node.put("id",              u.getId());
            node.put("title",           u.getTitle());
            node.put("concept",         u.getConcept());
            node.put("videoUrl",        u.getVideoUrl());
            node.put("durationMinutes", u.getDurationMinutes());
            node.put("orderIndex",      u.getOrderIndex());
            node.put("difficulty",      u.getDifficulty());
            node.put("status",          status);
            node.put("score",           score >= 0 ? score : null);
            enriched.add(node);
        }

        // Metrics
        int total     = units.size();
        int completed = (int) enriched.stream().filter(n -> "completed".equals(n.get("status"))).count();
        int skipped   = (int) enriched.stream().filter(n -> "strong".equals(n.get("status"))).count();
        int remaining = total - completed - skipped;
        int totalMins = units.stream().mapToInt(u -> u.getDurationMinutes() != null ? u.getDurationMinutes() : 8).sum();
        int skipMins  = units.stream()
                .filter(u -> scores.getOrDefault(u.getConcept(), -1) >= STRONG_THRESHOLD)
                .mapToInt(u -> u.getDurationMinutes() != null ? u.getDurationMinutes() : 8).sum();
        int optimizedMins = totalMins - skipMins;

        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("totalUnits",       total);
        metrics.put("completedUnits",   completed);
        metrics.put("remainingUnits",   remaining);
        metrics.put("skippedUnits",     skipped);
        metrics.put("totalDuration",    Math.round(totalMins / 60.0 * 10) / 10.0 + "h");
        metrics.put("optimizedDuration",Math.round(optimizedMins / 60.0 * 10) / 10.0 + "h");
        metrics.put("timeSavedPct",     totalMins > 0 ? (int) Math.round(skipMins * 100.0 / totalMins) + "%" : "0%");

        return Map.of("units", enriched, "metrics", metrics);
    }

    /** Returns quiz questions for a unit */
    public List<UnitQuiz> getQuiz(String unitId) {
        return unitQuizRepository.findByUnitId(unitId);
    }

    private Map<String, Integer> safeEvaluate(String userId) {
        try { return evaluationService.evaluate(userId); }
        catch (Exception e) { return Collections.emptyMap(); }
    }
}
