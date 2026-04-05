package com.neurox.controller;

import com.neurox.entity.Module;
import com.neurox.service.ModuleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/modules")
@CrossOrigin(origins = "*")
public class ModuleController {

    private final ModuleService moduleService;

    public ModuleController(ModuleService moduleService) {
        this.moduleService = moduleService;
    }

    @GetMapping("/{moduleId}")
    public ResponseEntity<Module> getModule(@PathVariable String moduleId) {
        return ResponseEntity.ok(moduleService.getModule(moduleId));
    }
}
