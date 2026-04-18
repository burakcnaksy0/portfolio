package com.portfolio.education;

import com.portfolio.education.dto.EducationRequest;
import com.portfolio.education.dto.EducationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EducationService {

    private final EducationRepository educationRepository;

    public List<EducationResponse> getAllEducation() {
        return educationRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public EducationResponse createEducation(EducationRequest req) {
        Education edu = Education.builder()
                .schoolName(req.getSchoolName())
                .department(req.getDepartment())
                .degree(req.getDegree())
                .gpa(req.getGpa())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .current(req.isCurrent())
                .displayOrder(req.getDisplayOrder() != null ? req.getDisplayOrder() : 0)
                .build();

        return mapToResponse(educationRepository.save(edu));
    }

    @Transactional
    public EducationResponse updateEducation(Long id, EducationRequest req) {
        Education edu = educationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Education not found"));

        edu.setSchoolName(req.getSchoolName());
        edu.setDepartment(req.getDepartment());
        edu.setDegree(req.getDegree());
        edu.setGpa(req.getGpa());
        edu.setStartDate(req.getStartDate());
        edu.setEndDate(req.getEndDate());
        edu.setCurrent(req.isCurrent());
        if (req.getDisplayOrder() != null) {
            edu.setDisplayOrder(req.getDisplayOrder());
        }

        return mapToResponse(educationRepository.save(edu));
    }

    @Transactional
    public void deleteEducation(Long id) {
        educationRepository.deleteById(id);
    }

    private EducationResponse mapToResponse(Education edu) {
        return EducationResponse.builder()
                .id(edu.getId())
                .schoolName(edu.getSchoolName())
                .department(edu.getDepartment())
                .degree(edu.getDegree())
                .gpa(edu.getGpa())
                .startDate(edu.getStartDate())
                .endDate(edu.getEndDate())
                .current(edu.isCurrent())
                .displayOrder(edu.getDisplayOrder())
                .build();
    }
}
