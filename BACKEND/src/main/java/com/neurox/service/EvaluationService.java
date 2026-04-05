package com.neurox.service;

import com.neurox.entity.Question;
import com.neurox.entity.Response;
import com.neurox.repository.QuestionRepository;
import com.neurox.repository.ResponseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EvaluationService {

    private static final Logger log = LoggerFactory.getLogger(EvaluationService.class);
    private final ResponseRepository responseRepository;
    private final QuestionRepository questionRepository;

    public EvaluationService(ResponseRepository responseRepository, QuestionRepository questionRepository) {
        this.responseRepository = responseRepository;
        this.questionRepository = questionRepository;
    }

    public Map<String, Integer> evaluate(String userId) {
        log.info("evaluate userId={}", userId);
        List<Response> responses = responseRepository.findByUserId(userId);
        if (responses.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No responses found for user");
        }

        // concept -> [total, correct]
        Map<String, int[]> conceptStats = new HashMap<>();

        for (Response r : responses) {
            Question q = questionRepository.findById(r.getQuestionId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found"));

            String concept = q.getConcept();
            conceptStats.putIfAbsent(concept, new int[]{0, 0});
            conceptStats.get(concept)[0]++;
            if (q.getCorrectAnswer().equalsIgnoreCase(r.getSelectedAnswer())) {
                conceptStats.get(concept)[1]++;
            }
        }

        Map<String, Integer> result = new HashMap<>();
        for (Map.Entry<String, int[]> entry : conceptStats.entrySet()) {
            int total = entry.getValue()[0];
            int correct = entry.getValue()[1];
            result.put(entry.getKey(), (int) Math.round((correct * 100.0) / total));
        }
        log.info("Evaluation result for userId={}: {}", userId, result);
        return result;
    }
}
