package com.neurox.repository;

import com.neurox.entity.Question;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface QuestionRepository extends MongoRepository<Question, String> {
    List<Question> findByDomain(String domain);
    List<Question> findByConcept(String concept);
    List<Question> findByDomainAndConcept(String domain, String concept);
}
