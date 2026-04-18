package com.portfolio.education.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class EducationRequest {
    private String schoolName;
    private String department;
    private String degree;
    private Double gpa;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean current;
    private Integer displayOrder;
}
