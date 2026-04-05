package com.neurox.controller;

import com.neurox.entity.UnitQuiz;
import com.neurox.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/course")
@CrossOrigin(origins = "*")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    /** GET /api/course/{courseId}?userId=xxx */
    @GetMapping("/{courseId}")
    public ResponseEntity<Map<String, Object>> getCourse(
            @PathVariable String courseId,
            @RequestParam String userId) {
        return ResponseEntity.ok(courseService.getCourse(courseId, userId));
    }

    /** GET /api/course/quiz/{unitId} */
    @GetMapping("/quiz/{unitId}")
    public ResponseEntity<List<UnitQuiz>> getQuiz(@PathVariable String unitId) {
        return ResponseEntity.ok(courseService.getQuiz(unitId));
    }
}
