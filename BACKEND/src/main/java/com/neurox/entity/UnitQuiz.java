package com.neurox.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "unit_quizzes")
public class UnitQuiz {

    @Id
    private String id;

    private String unitId;
    private String question;
    private List<String> options;
    private String correctAnswer;

    public UnitQuiz() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUnitId() { return unitId; }
    public void setUnitId(String unitId) { this.unitId = unitId; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
}
