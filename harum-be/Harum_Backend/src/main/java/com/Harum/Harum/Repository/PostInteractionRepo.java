package com.Harum.Harum.Repository;

import com.Harum.Harum.Models.PostInteraction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostInteractionRepo extends MongoRepository<PostInteraction, String> {
    
    // Tìm tất cả các tương tác của một người dùng
    List<PostInteraction> findByUserId(String userId);
    
    // Tìm tất cả các tương tác của một bài viết
    List<PostInteraction> findByPostId(String postId);
    
    // Tìm tất cả các tương tác của một chủ đề
    List<PostInteraction> findByTopicId(String topicId);
    
    // Tìm tương tác giữa người dùng và bài viết
    Optional<PostInteraction> findByUserIdAndPostId(String userId, String postId);
    
    // Tìm tất cả các tương tác của một người dùng với phân trang
    Page<PostInteraction> findByUserId(String userId, Pageable pageable);
    
    // Tìm tất cả các tương tác của một bài viết với phân trang
    Page<PostInteraction> findByPostId(String postId, Pageable pageable);
    
    // Tìm tất cả các tương tác của một chủ đề với phân trang
    Page<PostInteraction> findByTopicId(String topicId, Pageable pageable);
    
    // Đếm tương tác "like" cho một bài viết
    long countByPostIdAndLikedTrue(String postId);
    
    // Đếm tương tác "dislike" cho một bài viết
    long countByPostIdAndDislikedTrue(String postId);
    
    // Đếm tương tác "comment" cho một bài viết
    long countByPostIdAndCommentedTrue(String postId);
    
    // Đếm tương tác theo userId
    long countByUserId(String userId);
    
    // Đếm tương tác theo topicId
    long countByTopicId(String topicId);

    // Tìm postinteraction mới nhất của user theo topicId (trừ post hiện tại)
    Optional<PostInteraction> findFirstByUserIdAndTopicIdAndPostIdNotOrderByCreatedAtDesc(
            String userId, String topicId, String postId);
}
