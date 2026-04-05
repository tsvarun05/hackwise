package com.neurox.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "responses")
public class Response {

    @Id
    private String id;

    private String userId;
    private String questionId;
    private String selectedAnswer;

    public Response() {}

    public Response(String id, String userId, String questionId, String selectedAnswer) {
        this.id = id;
        this.userId = userId;
        this.questionId = questionId;
        this.selectedAnswer = selectedAnswer;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getQuestionId() { return questionId; }
    public void setQuestionId(String questionId) { this.questionId = questionId; }

    public String getSelectedAnswer() { return selectedAnswer; }
    public void setSelectedAnswer(String selectedAnswer) { this.selectedAnswer = selectedAnswer; }
}
