package com.portfolio.message;

import com.portfolio.common.dto.ApiResponse;
import com.portfolio.common.dto.PageResponse;
import com.portfolio.common.exception.ResourceNotFoundException;
import com.portfolio.message.dto.SendMessageRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Tag(name = "Messages", description = "Contact form & message management")
public class MessageController {

    private final MessageRepository messageRepository;

    @PostMapping
    @Operation(summary = "Send a contact message (public)")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> send(@Valid @RequestBody SendMessageRequest request) {
        Message msg = Message.builder()
                .name(request.getName())
                .email(request.getEmail())
                .subject(request.getSubject())
                .body(request.getBody())
                .build();
        messageRepository.save(msg);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Message sent successfully", null));
    }

    @GetMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "List all messages (admin)")
    public ResponseEntity<ApiResponse<PageResponse<Message>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "false") boolean unreadOnly) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Message> result = unreadOnly
                ? messageRepository.findByReadFalseOrderByCreatedAtDesc(pageable)
                : messageRepository.findAllByOrderByCreatedAtDesc(pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(result)));
    }

    @PutMapping("/{id}/read")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Mark message as read (admin)")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> markRead(@PathVariable Long id) {
        Message msg = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message", id));
        msg.setRead(true);
        messageRepository.save(msg);
        return ResponseEntity.ok(ApiResponse.success("Marked as read", null));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete message (admin)")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        if (!messageRepository.existsById(id))
            throw new ResourceNotFoundException("Message", id);
        messageRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }
}
