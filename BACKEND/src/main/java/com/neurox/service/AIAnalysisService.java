package com.neurox.service;

import com.neurox.entity.Module;
import com.neurox.repository.ModuleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Core AI Analysis Engine.
 * Produces: confidence score, weak/strong areas, time saved, recommendations,
 * human-like explanation, and enriched roadmap modules.
 */
@Service
public class AIAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(AIAnalysisService.class);
    private static final int WEAK_THRESHOLD    = 50;  // below this → weak
    private static final int STRONG_THRESHOLD  = 75;  // above this → strong
    private static final int DEFAULT_MODULE_DURATION = 15; // fallback minutes

    private final EvaluationService evaluationService;
    private final ModuleRepository moduleRepository;
    private final GeminiService geminiService;

    public AIAnalysisService(EvaluationService evaluationService,
                             ModuleRepository moduleRepository,
                             GeminiService geminiService) {
        this.evaluationService = evaluationService;
        this.moduleRepository  = moduleRepository;
        this.geminiService     = geminiService;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PUBLIC API
    // ─────────────────────────────────────────────────────────────────────────

    /** Full insights payload for POST /api/ai/insights */
    public Map<String, Object> getInsights(String userId, String domain) {
        log.info("getInsights userId={} domain={}", userId, domain);

        Map<String, Integer> scores = safeEvaluate(userId);

        List<String> weakAreas   = filterByScore(scores, 0, WEAK_THRESHOLD);
        List<String> strongAreas = filterByScore(scores, STRONG_THRESHOLD, 101);
        int confidenceScore      = computeConfidence(scores);

        // Time saved engine
        List<Module> allModules  = getDomainModules(domain);
        Map<String, Object> time = computeTimeSaved(allModules, strongAreas);

        // Enriched roadmap modules
        List<Map<String, Object>> roadmap = buildEnrichedRoadmap(allModules, scores);

        // Recommendations
        List<String> recommendations = buildRecommendations(weakAreas, strongAreas, scores);

        // Human-like explanation (Gemini if available, else rule-based)
        String explanation = buildExplanation(weakAreas, strongAreas, confidenceScore, scores);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("weakAreas",        weakAreas);
        result.put("strongAreas",      strongAreas);
        result.put("confidenceScore",  confidenceScore);
        result.put("explanation",      explanation);
        result.put("timeSaved",        time);
        result.put("recommendations",  recommendations);
        result.put("roadmap",          roadmap);
        result.put("scores",           scores);

        log.info("Insights ready for userId={}: confidence={}% weak={} strong={}",
                userId, confidenceScore, weakAreas, strongAreas);
        return result;
    }

    /** Lightweight version used by DashboardService */
    public Map<String, Object> getDashboardExtras(String userId, String domain) {
        Map<String, Integer> scores  = safeEvaluate(userId);
        List<String> weakAreas       = filterByScore(scores, 0, WEAK_THRESHOLD);
        List<String> strongAreas     = filterByScore(scores, STRONG_THRESHOLD, 101);
        int confidenceScore          = computeConfidence(scores);
        List<Module> allModules      = getDomainModules(domain);
        Map<String, Object> time     = computeTimeSaved(allModules, strongAreas);

        Map<String, Object> extras = new LinkedHashMap<>();
        extras.put("confidenceScore", confidenceScore);
        extras.put("timeSaved",       time.get("timeSavedPct"));
        extras.put("originalHours",   time.get("originalHours"));
        extras.put("optimizedHours",  time.get("optimizedHours"));
        extras.put("weakAreas",       weakAreas);
        extras.put("strongAreas",     strongAreas);
        return extras;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE ENGINES
    // ─────────────────────────────────────────────────────────────────────────

    private Map<String, Integer> safeEvaluate(String userId) {
        try {
            return evaluationService.evaluate(userId);
        } catch (Exception e) {
            log.warn("No evaluation data for userId={}", userId);
            return Collections.emptyMap();
        }
    }

    private List<String> filterByScore(Map<String, Integer> scores, int min, int max) {
        return scores.entrySet().stream()
                .filter(e -> e.getValue() >= min && e.getValue() < max)
                .sorted(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    /** Confidence = weighted average of all concept scores */
    private int computeConfidence(Map<String, Integer> scores) {
        if (scores.isEmpty()) return 0;
        double avg = scores.values().stream().mapToInt(i -> i).average().orElse(0);
        return (int) Math.round(avg);
    }

    private List<Module> getDomainModules(String domain) {
        if (domain != null && !domain.isBlank()) {
            return moduleRepository.findByDomain(domain.toLowerCase());
        }
        return moduleRepository.findAll();
    }

    /** Time Saved Engine */
    private Map<String, Object> computeTimeSaved(List<Module> allModules, List<String> strongAreas) {
        int totalMinutes = allModules.stream()
                .mapToInt(m -> m.getDurationMinutes() != null ? m.getDurationMinutes() : DEFAULT_MODULE_DURATION)
                .sum();

        int skippedMinutes = allModules.stream()
                .filter(m -> strongAreas.contains(m.getConcept()))
                .mapToInt(m -> m.getDurationMinutes() != null ? m.getDurationMinutes() : DEFAULT_MODULE_DURATION)
                .sum();

        int optimizedMinutes = totalMinutes - skippedMinutes;
        double originalHours  = Math.round(totalMinutes / 60.0 * 10) / 10.0;
        double optimizedHours = Math.round(optimizedMinutes / 60.0 * 10) / 10.0;
        int pct = totalMinutes > 0 ? (int) Math.round((skippedMinutes * 100.0) / totalMinutes) : 0;

        Map<String, Object> time = new LinkedHashMap<>();
        time.put("originalHours",  originalHours);
        time.put("optimizedHours", optimizedHours);
        time.put("timeSavedPct",   pct + "%");
        time.put("minutesSaved",   skippedMinutes);
        return time;
    }

    /** Enriched roadmap: adds status, difficulty, duration to each module */
    private List<Map<String, Object>> buildEnrichedRoadmap(List<Module> modules,
                                                            Map<String, Integer> scores) {
        return modules.stream()
                .sorted(Comparator.comparingInt(m -> m.getOrderIndex() != null ? m.getOrderIndex() : 0))
                .map(m -> {
                    int score = scores.getOrDefault(m.getConcept(), -1);
                    String status;
                    if (score < 0)                  status = "recommended";
                    else if (score < WEAK_THRESHOLD) status = "weak";
                    else                             status = "strong";

                    Map<String, Object> entry = new LinkedHashMap<>();
                    entry.put("id",              m.getId());
                    entry.put("title",           m.getTitle());
                    entry.put("concept",         m.getConcept());
                    entry.put("videoUrl",        m.getVideoUrl());
                    entry.put("difficulty",      m.getDifficulty() != null ? m.getDifficulty() : "beginner");
                    entry.put("durationMinutes", m.getDurationMinutes() != null ? m.getDurationMinutes() : DEFAULT_MODULE_DURATION);
                    entry.put("status",          status);
                    entry.put("score",           score >= 0 ? score : null);
                    return entry;
                })
                .collect(Collectors.toList());
    }

    /** Personalized recommendation engine */
    private List<String> buildRecommendations(List<String> weakAreas, List<String> strongAreas,
                                               Map<String, Integer> scores) {
        List<String> recs = new ArrayList<>();

        // Prioritize worst weak area
        if (!weakAreas.isEmpty()) {
            String worst = scores.entrySet().stream()
                    .filter(e -> weakAreas.contains(e.getKey()))
                    .min(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey).orElse(weakAreas.get(0));
            recs.add("🎯 Focus on " + worst + " first — it's your weakest area right now.");
        }

        // Encourage skipping strong areas
        if (!strongAreas.isEmpty()) {
            recs.add("✅ You can skip " + String.join(", ", strongAreas) + " — you've already mastered these.");
        }

        // Score-based tips
        scores.forEach((concept, score) -> {
            if (score >= 40 && score < WEAK_THRESHOLD) {
                recs.add("📈 You're close on " + concept + " (" + score + "%) — a quick review will push you over.");
            }
        });

        // General tip
        if (weakAreas.size() > 2) {
            recs.add("💡 Tackle one weak area at a time — don't try to learn everything at once.");
        }

        if (recs.isEmpty()) {
            recs.add("🚀 Great foundation! Keep going through the roadmap in order.");
        }

        return recs;
    }

    /** Human-like explanation — Gemini if available, rule-based fallback */
    private String buildExplanation(List<String> weakAreas, List<String> strongAreas,
                                     int confidence, Map<String, Integer> scores) {
        // Try Gemini first
        if (!weakAreas.isEmpty() || !strongAreas.isEmpty()) {
            String prompt = buildGeminiPrompt(weakAreas, strongAreas, confidence, scores);
            String geminiResponse = geminiService.chat(prompt);
            if (geminiResponse != null && !geminiResponse.isBlank()) {
                return geminiResponse;
            }
        }

        // Rule-based fallback
        return buildRuleBasedExplanation(weakAreas, strongAreas, confidence);
    }

    private String buildGeminiPrompt(List<String> weakAreas, List<String> strongAreas,
                                      int confidence, Map<String, Integer> scores) {
        return """
                You are an AI learning mentor. Analyze this student's assessment results and give a short, encouraging, personalized explanation (3-4 sentences max).

                Results:
                - Confidence Score: %d%%
                - Strong concepts: %s
                - Weak concepts: %s
                - Detailed scores: %s

                Be specific, encouraging, and actionable. Don't use bullet points — write naturally like a mentor talking to a student.
                """.formatted(
                confidence,
                strongAreas.isEmpty() ? "none yet" : String.join(", ", strongAreas),
                weakAreas.isEmpty()   ? "none"     : String.join(", ", weakAreas),
                scores.toString()
        );
    }

    private String buildRuleBasedExplanation(List<String> weakAreas, List<String> strongAreas,
                                              int confidence) {
        if (weakAreas.isEmpty() && strongAreas.isEmpty()) {
            return "We couldn't find enough data to analyze yet. Complete the assessment to get your personalized insights.";
        }

        StringBuilder sb = new StringBuilder();

        if (!strongAreas.isEmpty()) {
            sb.append("You have a solid foundation in ")
              .append(String.join(" and ", strongAreas)).append(". ");
        }

        if (!weakAreas.isEmpty()) {
            sb.append("Your roadmap focuses on ")
              .append(String.join(", ", weakAreas))
              .append(" — the areas where you'll grow the most. ");
        }

        if (confidence >= 70) {
            sb.append("With a confidence score of ").append(confidence)
              .append("%, you're in great shape — keep the momentum going!");
        } else if (confidence >= 40) {
            sb.append("Your confidence score is ").append(confidence)
              .append("% — you're building well. Stay consistent and you'll see rapid improvement.");
        } else {
            sb.append("Your confidence score is ").append(confidence)
              .append("% — this is a great starting point. The roadmap is designed to fill exactly these gaps.");
        }

        return sb.toString();
    }
}
