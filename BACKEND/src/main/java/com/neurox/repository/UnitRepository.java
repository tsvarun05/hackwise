package com.neurox.repository;

import com.neurox.entity.Unit;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface UnitRepository extends MongoRepository<Unit, String> {
    List<Unit> findByCourseIdOrderByOrderIndex(String courseId);
    List<Unit> findByDomainOrderByOrderIndex(String domain);
    List<Unit> findByConcept(String concept);
    boolean existsByCourseId(String courseId);
}
