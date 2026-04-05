package com.neurox.controller;

import com.neurox.entity.Question;
import com.neurox.service.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    /**
     * GET /api/questions                          → all questions
     * GET /api/questions?domain=webdev            → by domain (pre-assessment)
     * GET /api/questions?concept=HTML             → by concept (module quiz)
     * GET /api/questions?domain=webdev&concept=HTML → both
     */
    @GetMapping
    public ResponseEntity<List<Question>> getAll(
            @RequestParam(required = false) String domain,
            @RequestParam(required = false) String concept) {

        if (domain != null && concept != null) {
            return ResponseEntity.ok(questionService.getByDomainAndConcept(domain, concept));
        }
        if (domain != null) {
            return ResponseEntity.ok(questionService.getByDomain(domain));
        }
        if (concept != null) {
            return ResponseEntity.ok(questionService.getByConcept(concept));
        }
        return ResponseEntity.ok(questionService.getAllQuestions());
    }
}
