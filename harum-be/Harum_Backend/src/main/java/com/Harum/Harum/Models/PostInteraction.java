package com.Harum.Harum.Models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import java.time.Instant;

@Data
@Document(collection = "postInteractions")
@CompoundIndex(name = "user_post_unique", def = "{'userId': 1, 'postId': 1}", unique = true)
public class PostInteraction {

    @Id
    private String id;

    private String userId;

    private String postId;

    private String topicId;

    private int readTime;

    private boolean liked;

    private boolean disliked;

    private boolean commented;

    private double interactionPoint;

@CreatedDate
private Instant createdAt;
    // Constructor không đối số
    public PostInteraction() {
        this.readTime = 0;
        this.liked = false;
        this.disliked = false;
        this.commented = false;
        this.interactionPoint = 0;
        this.createdAt = Instant.now();
    }

    // Constructor đầy đủ
    public PostInteraction(
            String userId,
            String postId,
            String topicId,
            int readTime,
            boolean liked,
            boolean disliked,
            boolean commented
    ) {
        this.userId = userId;
        this.postId = postId;
        this.topicId = topicId;
        this.readTime = readTime;
        this.liked = liked;
        this.disliked = disliked;
        this.commented = commented;

        recalculateInteractionPoint();

        this.createdAt = Instant.now();
    }

    // Công thức:
    // 0.3(readTime) + 3(Like) - 4(Dislike) + 4(Comment)

    private double calculateInteractionPoint() {
        double point = readTime * 0.3;

        if (liked) {
            point += 3;
        }

        if (disliked) {
            point -= 4;
        }

        if (commented) {
            point += 4;
        }

        return point;
    }

    private void recalculateInteractionPoint() {
        this.interactionPoint = calculateInteractionPoint();
    }

    // Override setter để tự động cập nhật interactionPoint

    public void setReadTime(int readTime) {
        this.readTime = readTime;
        recalculateInteractionPoint();
    }

    public void setLiked(boolean liked) {
        this.liked = liked;
        recalculateInteractionPoint();
    }

    public void setDisliked(boolean disliked) {
        this.disliked = disliked;
        recalculateInteractionPoint();
    }

    public void setCommented(boolean commented) {
        this.commented = commented;
        recalculateInteractionPoint();
    }
}