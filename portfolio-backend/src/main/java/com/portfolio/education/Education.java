package com.portfolio.education;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "education")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Education {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String schoolName;
    private String department;
    private String degree; // Lise, Lisans, Yüksek Lisans vs.
    private Double gpa;    // Not ortalaması

    private LocalDate startDate;
    private LocalDate endDate;
    private boolean current;

    private Integer displayOrder;
}
