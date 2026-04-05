package com.neurox.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "modules")
public class Module {

    @Id
    private String id;

    private String title;
    private String concept;
    private String videoUrl;
    private Integer orderIndex;
    private String domain;
    private Integer durationMinutes; // actual lesson duration
    private String difficulty;       // "beginner" | "intermediate" | "advanced"

    @Transient private boolean weak;
    @Transient private String status; // "weak" | "strong" | "recommended"

    public Module() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getConcept() { return concept; }
    public void setConcept(String concept) { this.concept = concept; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public boolean isWeak() { return weak; }
    public void setWeak(boolean weak) { this.weak = weak; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
