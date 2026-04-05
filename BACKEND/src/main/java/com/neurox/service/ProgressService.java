package com.neurox.service;

import com.neurox.entity.Progress;
import com.neurox.repository.ModuleRepository;
import com.neurox.repository.ProgressRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ProgressService {

    private static final Logger log = LoggerFactory.getLogger(ProgressService.class);
    private final ProgressRepository progressRepository;
    private final ModuleRepository moduleRepository;

    public ProgressService(ProgressRepository progressRepository, ModuleRepository moduleRepository) {
        this.progressRepository = progressRepository;
        this.moduleRepository = moduleRepository;
    }

    public Progress saveProgress(Map<String, Object> body) {
        String userId = body.get("userId").toString();
        String moduleId = body.get("moduleId").toString();
        log.info("saveProgress userId={} moduleId={}", userId, moduleId);

        if (progressRepository.existsByUserIdAndModuleId(userId, moduleId)) {
            return progressRepository.findByUserId(userId).stream()
                    .filter(p -> p.getModuleId().equals(moduleId))
                    .findFirst().orElseThrow();
        }

        Progress progress = new Progress(null, userId, moduleId, true);
        return progressRepository.save(progress);
    }

    public List<Progress> getByUserId(String userId) {
        return progressRepository.findByUserId(userId);
    }

    public int getCompletedCount(String userId) {
        return (int) progressRepository.findByUserId(userId).stream()
                .filter(Progress::isCompleted).count();
    }

    public int getTotalModules() {
        return (int) moduleRepository.count();
    }

    public int getProgressPercentage(String userId) {
        long total = moduleRepository.count();
        if (total == 0) return 0;
        long completed = progressRepository.findByUserId(userId).stream()
                .filter(Progress::isCompleted).count();
        return (int) Math.round((completed * 100.0) / total);
    }
}
