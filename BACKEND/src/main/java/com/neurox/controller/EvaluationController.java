package com.neurox.controller;

import com.neurox.service.EvaluationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/evaluation")
@CrossOrigin(origins = "*")
public class EvaluationController {

    private final EvaluationService evaluationService;

    public EvaluationController(EvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Map<String, Integer>> evaluate(@PathVariable String userId) {
        return ResponseEntity.ok(evaluationService.evaluate(userId));
    }
}
