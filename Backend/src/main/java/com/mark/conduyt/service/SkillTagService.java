package com.mark.conduyt.service;


import com.mark.conduyt.entity.SkillTag;
import com.mark.conduyt.repository.SkillTagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillTagService {

    private final SkillTagRepository skillTagRepository;

    @Transactional(readOnly = true)
    public List<SkillTag> getAllSkills() {
        // Fetch all skills from the database
        return skillTagRepository.findAll();
    }
}