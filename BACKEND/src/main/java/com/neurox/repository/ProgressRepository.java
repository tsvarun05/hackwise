package com.neurox.repository;

import com.neurox.entity.Progress;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ProgressRepository extends MongoRepository<Progress, String> {
    List<Progress> findByUserId(String userId);
    boolean existsByUserIdAndModuleId(String userId, String moduleId);
}
