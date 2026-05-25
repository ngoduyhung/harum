package com.Harum.Harum.DTO;

public class PostInteractionDTO {
    
    private String id;
    private String userId;
    private String postId;
    private String topicId;
    private int readTime;
    private boolean liked;
    private boolean disliked;
    private boolean commented;
    private String createdAt;

    // Constructor không đối số
    public PostInteractionDTO() {}

    // Constructor đầy đủ
    public PostInteractionDTO(String id, String userId, String postId, String topicId, 
                             int readTime, boolean liked, boolean disliked, 
                             boolean commented, String createdAt) {
        this.id = id;
        this.userId = userId;
        this.postId = postId;
        this.topicId = topicId;
        this.readTime = readTime;
        this.liked = liked;
        this.disliked = disliked;
        this.commented = commented;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getTopicId() {
        return topicId;
    }

    public void setTopicId(String topicId) {
        this.topicId = topicId;
    }

    public int getReadTime() {
        return readTime;
    }

    public void setReadTime(int readTime) {
        this.readTime = readTime;
    }

    public boolean isLiked() {
        return liked;
    }

    public void setLiked(boolean liked) {
        this.liked = liked;
    }

    public boolean isDisliked() {
        return disliked;
    }

    public void setDisliked(boolean disliked) {
        this.disliked = disliked;
    }

    public boolean isCommented() {
        return commented;
    }

    public void setCommented(boolean commented) {
        this.commented = commented;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
