package com.neurox.repository;

import com.neurox.entity.Response;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ResponseRepository extends MongoRepository<Response, String> {
    List<Response> findByUserId(String userId);
}
