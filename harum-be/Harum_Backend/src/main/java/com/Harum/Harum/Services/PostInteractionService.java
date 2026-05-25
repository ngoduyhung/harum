package com.Harum.Harum.Services;

import com.Harum.Harum.Models.PostInteraction;
import com.Harum.Harum.Models.Posts;
import com.Harum.Harum.Repository.PostInteractionRepo;
import com.Harum.Harum.Repository.PostRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class PostInteractionService {

    @Autowired
    private PostInteractionRepo postInteractionRepository;

    @Autowired
    private PostRepo postRepository;

    // =========================
    // CRUD
    // =========================

    public PostInteraction createPostInteraction(PostInteraction postInteraction) {
        return postInteractionRepository.save(postInteraction);
    }

    public List<PostInteraction> getAllPostInteractions() {
        return postInteractionRepository.findAll();
    }

    public Optional<PostInteraction> getPostInteractionById(String id) {
        return postInteractionRepository.findById(id);
    }

    public List<PostInteraction> getPostInteractionsByUserId(String userId) {
        return postInteractionRepository.findByUserId(userId);
    }

    public List<PostInteraction> getPostInteractionsByPostId(String postId) {
        return postInteractionRepository.findByPostId(postId);
    }

    public List<PostInteraction> getPostInteractionsByTopicId(String topicId) {
        return postInteractionRepository.findByTopicId(topicId);
    }

    public Optional<PostInteraction> getPostInteractionByUserIdAndPostId(String userId, String postId) {
        return postInteractionRepository.findByUserIdAndPostId(userId, postId);
    }

    public Page<PostInteraction> getPostInteractionsByUserId(String userId, Pageable pageable) {
        return postInteractionRepository.findByUserId(userId, pageable);
    }

    public Page<PostInteraction> getPostInteractionsByPostId(String postId, Pageable pageable) {
        return postInteractionRepository.findByPostId(postId, pageable);
    }

    public Page<PostInteraction> getPostInteractionsByTopicId(String topicId, Pageable pageable) {
        return postInteractionRepository.findByTopicId(topicId, pageable);
    }

    public PostInteraction updatePostInteraction(String id, PostInteraction updatedInteraction) {
        if (postInteractionRepository.existsById(id)) {
            updatedInteraction.setId(id);
            return postInteractionRepository.save(updatedInteraction);
        }
        return null;
    }

    public boolean deletePostInteraction(String id) {
        if (postInteractionRepository.existsById(id)) {
            postInteractionRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // =========================
    // STATS
    // =========================

    public long countLikesByPostId(String postId) {
        return postInteractionRepository.countByPostIdAndLikedTrue(postId);
    }

    public long countDislikesByPostId(String postId) {
        return postInteractionRepository.countByPostIdAndDislikedTrue(postId);
    }

    public long countCommentsByPostId(String postId) {
        return postInteractionRepository.countByPostIdAndCommentedTrue(postId);
    }

    public long countInteractionsByUserId(String userId) {
        return postInteractionRepository.countByUserId(userId);
    }

    public long countInteractionsByTopicId(String topicId) {
        return postInteractionRepository.countByTopicId(topicId);
    }

    // =========================
    // ELO CORE
    // =========================

    private double expectedScore(double ra, double rb) {
        return 1.0 / (1.0 + Math.pow(10, (rb - ra) / 400.0));
    }

    private double newElo(double current, double expected, double actual, int k) {
        return current + k * (actual - expected);
    }

    // =========================
    // FIXED: ELO LOGIC CORE
    // =========================

    @Transactional
    public Map<String, Object> createAndCompareElo(PostInteraction newInteraction) {

        Map<String, Object> result = new HashMap<>();

        // 1. save interaction mới
        PostInteraction created = postInteractionRepository.save(newInteraction);

        // 2. FIX: lấy interaction gần nhất đúng nghĩa
        Optional<PostInteraction> latestOpt =
                postInteractionRepository
                        .findFirstByUserIdAndTopicIdAndPostIdNotOrderByCreatedAtDesc(
                                created.getUserId(),
                                created.getTopicId(),
                                created.getPostId()
                        );

        if (latestOpt.isEmpty()) {
            result.put("message", "Không có interaction trước đó để so sánh");
            result.put("createdInteraction", created);
            result.put("eloUpdated", false);
            return result;
        }

        PostInteraction latest = latestOpt.get();

        // 3. threshold tránh spam Elo
        double threshold = 0.1;

        double newPoint = created.getInteractionPoint();
        double oldPoint = latest.getInteractionPoint();

        boolean tie = Math.abs(newPoint - oldPoint) <= threshold;
        boolean newWins = newPoint - oldPoint > threshold;

        // 4. load posts
        Posts newPost = postRepository.findById(created.getPostId()).orElse(null);
        Posts oldPost = postRepository.findById(latest.getPostId()).orElse(null);

        if (newPost == null || oldPost == null) {
            result.put("message", "Không tìm thấy post");
            result.put("eloUpdated", false);
            return result;
        }

        double ra = newPost.getElo();
        double rb = oldPost.getElo();

        // 5. expected
        double ea = expectedScore(ra, rb);
        double eb = expectedScore(rb, ra);

        // 6. actual
        double sa = tie ? 0.5 : (newWins ? 1 : 0);
        double sb = tie ? 0.5 : (newWins ? 0 : 1);

        int k = 16;

        // 7. update elo
        double newEloA = newElo(ra, ea, sa, k);
        double newEloB = newElo(rb, eb, sb, k);

        newPost.setElo(newEloA);
        oldPost.setElo(newEloB);

        postRepository.save(newPost);
        postRepository.save(oldPost);

        // 8. response
        result.put("createdInteraction", created);
        result.put("latestInteraction", latest);

        result.put("newPostElo", newEloA);
        result.put("latestPostElo", newEloB);

        result.put("result",
                tie ? "Hòa" : (newWins ? "Post mới thắng" : "Post cũ thắng"));

        result.put("eloUpdated", true);

        return result;
    }
}