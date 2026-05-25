package com.Harum.Harum.Controllers;

import com.Harum.Harum.DTO.PostInteractionDTO;
import com.Harum.Harum.Models.PostInteraction;
import com.Harum.Harum.Services.PostInteractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/post-interactions")
public class PostInteractionController {

    @Autowired
    private PostInteractionService postInteractionService;

    // 1. Create - Tạo mới tương tác
    @PostMapping
    public ResponseEntity<PostInteraction> createPostInteraction(@RequestBody PostInteraction postInteraction) {
        PostInteraction created = postInteractionService.createPostInteraction(postInteraction);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // 2. Read - Lấy tất cả tương tác
    @GetMapping
    public ResponseEntity<List<PostInteraction>> getAllPostInteractions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);

        List<PostInteraction> interactions =
                postInteractionService.getAllPostInteractions();

        return ResponseEntity.ok(interactions);
    }

    // 3. Read - Lấy tương tác theo ID
    @GetMapping("/{id}")
    public ResponseEntity<PostInteraction> getPostInteractionById(@PathVariable String id) {
        Optional<PostInteraction> interaction =
                postInteractionService.getPostInteractionById(id);

        return interaction
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 4. Read - Lấy theo userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostInteractionDTO>> getInteractionsByUserId(
            @PathVariable String userId) {

        List<PostInteraction> interactions =
                postInteractionService.getPostInteractionsByUserId(userId);

        List<PostInteractionDTO> dtos = interactions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    // 5. Read - user + post
    @GetMapping("/user/{userId}/post/{postId}")
    public ResponseEntity<PostInteractionDTO> getInteractionByUserAndPost(
            @PathVariable String userId,
            @PathVariable String postId) {

        Optional<PostInteraction> interaction =
                postInteractionService.getPostInteractionByUserIdAndPostId(userId, postId);

        return interaction
                .map(pi -> ResponseEntity.ok(convertToDTO(pi)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 6. Elo Compare
    @PostMapping("/compare-elo")
    public ResponseEntity<Map<String, Object>> compareAndUpdateElo(
            @RequestBody PostInteraction postInteraction) {

        Map<String, Object> result =
                postInteractionService.createAndCompareElo(postInteraction);

        return ResponseEntity.ok(result);
    }

    // 7. Create + Compare Elo
    @PostMapping("/create-and-compare-elo")
    public ResponseEntity<Map<String, Object>> createAndCompareElo(
            @RequestBody PostInteraction postInteraction) {

        Map<String, Object> result =
                postInteractionService.createAndCompareElo(postInteraction);

        return ResponseEntity.ok(result);
    }

    // Helper DTO converter
    private PostInteractionDTO convertToDTO(PostInteraction postInteraction) {
        return new PostInteractionDTO(
                postInteraction.getId(),
                postInteraction.getUserId(),
                postInteraction.getPostId(),
                postInteraction.getTopicId(),
                postInteraction.getReadTime(),
                postInteraction.isLiked(),
                postInteraction.isDisliked(),
                postInteraction.isCommented(),
                postInteraction.getCreatedAt() != null
                        ? postInteraction.getCreatedAt().toString()
                        : null
        );
    }
}