package com.neurox.service;

import com.neurox.entity.Response;
import com.neurox.repository.ResponseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ResponseService {

    private static final Logger log = LoggerFactory.getLogger(ResponseService.class);
    private final ResponseRepository responseRepository;

    public ResponseService(ResponseRepository responseRepository) {
        this.responseRepository = responseRepository;
    }

    @SuppressWarnings("unchecked")
    public List<Response> saveResponses(Map<String, Object> body) {
        String userId = body.get("userId").toString();
        log.info("Saving responses for userId={}", userId);

        // Clear old responses so re-submission works cleanly
        List<Response> existing = responseRepository.findByUserId(userId);
        if (!existing.isEmpty()) {
            responseRepository.deleteAll(existing);
            log.info("Deleted {} old responses for userId={}", existing.size(), userId);
        }

        List<Map<String, Object>> answers = (List<Map<String, Object>>) body.get("answers");
        if (answers == null || answers.isEmpty()) {
            throw new IllegalArgumentException("answers array is required");
        }

        List<Response> toSave = answers.stream().map(a -> {
            String questionId = a.get("questionId").toString();
            String selected = a.getOrDefault("selectedOption",
                             a.getOrDefault("selectedAnswer", "")).toString();
            return new Response(null, userId, questionId, selected);
        }).toList();

        List<Response> saved = responseRepository.saveAll(toSave);
        log.info("Saved {} responses for userId={}", saved.size(), userId);
        return saved;
    }

    public List<Response> getByUserId(String userId) {
        return responseRepository.findByUserId(userId);
    }
}
