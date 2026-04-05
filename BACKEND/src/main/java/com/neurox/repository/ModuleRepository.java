package com.neurox.repository;

import com.neurox.entity.Module;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ModuleRepository extends MongoRepository<Module, String> {
    List<Module> findByConceptIn(List<String> concepts);
    List<Module> findByDomain(String domain);
    List<Module> findByDomainAndConceptIn(String domain, List<String> concepts);
}
