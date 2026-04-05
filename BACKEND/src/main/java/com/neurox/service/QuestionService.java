package com.neurox.service;

import com.neurox.entity.Question;
import com.neurox.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public List<Question> getByDomain(String domain) {
        return questionRepository.findByDomain(domain.toLowerCase());
    }

    public List<Question> getByConcept(String concept) {
        return questionRepository.findByConcept(concept);
    }

    public List<Question> getByDomainAndConcept(String domain, String concept) {
        return questionRepository.findByDomainAndConcept(domain.toLowerCase(), concept);
    }
}
