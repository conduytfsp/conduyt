package com.mark.conduyt.controller;

import com.mark.conduyt.dto.ApiResponse;
import com.mark.conduyt.entity.SkillTag;
import com.mark.conduyt.service.SkillTagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillTagController {

    private final SkillTagService skillTagService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SkillTag>>> getAllSkills() {
        List<SkillTag> skills = skillTagService.getAllSkills();

        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Skills fetched successfully",
                skills
        ));
    }
}