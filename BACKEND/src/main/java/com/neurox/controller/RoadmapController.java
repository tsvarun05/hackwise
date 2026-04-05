package com.neurox.controller;

import com.neurox.entity.Module;
import com.neurox.service.RoadmapService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roadmap")
@CrossOrigin(origins = "*")
public class RoadmapController {

    private final RoadmapService roadmapService;

    public RoadmapController(RoadmapService roadmapService) {
        this.roadmapService = roadmapService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Module>> getRoadmap(
            @PathVariable String userId,
            @RequestParam(required = false) String domain) {
        return ResponseEntity.ok(roadmapService.getRoadmap(userId, domain));
    }
}
