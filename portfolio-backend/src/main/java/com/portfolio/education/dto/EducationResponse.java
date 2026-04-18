package com.portfolio.education.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class EducationResponse {
    private Long id;
    private String schoolName;
    private String department;
    private String degree;
    private Double gpa;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean current;
    private Integer displayOrder;
}
