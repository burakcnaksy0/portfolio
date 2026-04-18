package com.portfolio.certificate;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "certificates")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Certificate {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String title;
    @Column(nullable = false) private String issuer;
    @Column(name = "issue_date") private LocalDate issueDate;
    @Column(name = "credential_url", length = 500) private String credentialUrl;
    @Column(name = "image_url", length = 500) private String imageUrl;
    @Column(name = "display_order") @Builder.Default private int displayOrder = 0;

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Certificate c)) return false;
        return Objects.equals(id, c.id);
    }
    @Override public int hashCode() { return Objects.hash(id); }
}
