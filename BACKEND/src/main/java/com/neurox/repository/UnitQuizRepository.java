package com.neurox.repository;

import com.neurox.entity.UnitQuiz;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface UnitQuizRepository extends MongoRepository<UnitQuiz, String> {
    List<UnitQuiz> findByUnitId(String unitId);
    boolean existsByUnitId(String unitId);
}
