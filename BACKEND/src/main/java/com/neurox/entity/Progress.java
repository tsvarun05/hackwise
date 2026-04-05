package com.neurox.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "progress")
public class Progress {

    @Id
    private String id;

    private String userId;
    private String moduleId;
    private boolean completed;

    public Progress() {}

    public Progress(String id, String userId, String moduleId, boolean completed) {
        this.id = id;
        this.userId = userId;
        this.moduleId = moduleId;
        this.completed = completed;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getModuleId() { return moduleId; }
    public void setModuleId(String moduleId) { this.moduleId = moduleId; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}
