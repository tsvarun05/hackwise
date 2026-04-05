package com.neurox.service;

import com.neurox.entity.Module;
import com.neurox.repository.ModuleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoadmapService {

    private static final Logger log = LoggerFactory.getLogger(RoadmapService.class);
    private static final int THRESHOLD = 50;

    private final EvaluationService evaluationService;
    private final ModuleRepository moduleRepository;

    public RoadmapService(EvaluationService evaluationService, ModuleRepository moduleRepository) {
        this.evaluationService = evaluationService;
        this.moduleRepository = moduleRepository;
    }

    public List<Module> getRoadmap(String userId, String domain) {
        log.info("getRoadmap userId={} domain={}", userId, domain);

        List<Module> domainModules = (domain != null && !domain.isBlank())
                ? moduleRepository.findByDomain(domain.toLowerCase())
                : moduleRepository.findAll();

        if (domainModules.isEmpty()) {
            log.warn("No modules found for domain={}", domain);
            return Collections.emptyList();
        }

        Map<String, Integer> scores;
        try {
            scores = evaluationService.evaluate(userId);
        } catch (Exception e) {
            log.warn("No evaluation for userId={}, marking all as weak", userId);
            domainModules.forEach(m -> m.setWeak(true));
            return domainModules;
        }

        Set<String> strongConcepts = scores.entrySet().stream()
                .filter(e -> e.getValue() >= THRESHOLD)
                .map(Map.Entry::getKey)
                .collect(Collectors.toSet());

        log.info("userId={} strongConcepts={}", userId, strongConcepts);

        for (Module m : domainModules) {
            m.setWeak(!strongConcepts.contains(m.getConcept()));
        }

        domainModules.sort(Comparator.comparing((Module m) -> !m.isWeak())
                .thenComparing(m -> m.getOrderIndex() != null ? m.getOrderIndex() : 0));

        return domainModules;
    }
}
