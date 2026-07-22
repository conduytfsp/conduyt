package com.mark.conduyt.service;


import com.mark.conduyt.dto.UserRegisterRequestDTO;
import com.mark.conduyt.entity.Freelancer;
import com.mark.conduyt.entity.SkillTag;
import com.mark.conduyt.entity.User;
import com.mark.conduyt.repository.FreelancerRepository;
import com.mark.conduyt.repository.SkillTagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FreelancerService {

    private final FreelancerRepository freelancerRepository;
    private final SkillTagRepository skillTagRepository;
    private final UserService userService; // Injecting the core user service
    private final ImageHostingService imageHostingService;
    private final EmailService emailService;
    private final OtpService otpService;

    @Transactional(rollbackFor = Exception.class)
    public void createFreelancer(UserRegisterRequestDTO request, MultipartFile profileImage, MultipartFile cvFile) throws IOException {

        // 1. Delegate core user creation (and pfp upload)
        User user = userService.createUser(request, profileImage);

        // 2. Hydrate Freelancer
        Freelancer freelancer = new Freelancer();
        freelancer.setUser(user);
        freelancer.setTitle(request.getTitle());
        freelancer.setBio(request.getBio());
        freelancer.setGithubUrl(request.getGithubUrl());
        freelancer.setLinkedinUrl(request.getLinkedinUrl());
        freelancer.setPortfolioUrl(request.getPortfolioUrl());

        // 3. Process CV upload
        if (cvFile != null && !cvFile.isEmpty()) {
            String cvUrl = imageHostingService.uploadPdf(cvFile, "CV PDF");
            freelancer.setCvUrl(cvUrl);
        }

        // 4. Process Skill Tags
        if (request.getSkillNames() != null && !request.getSkillNames().isEmpty()) {
            Set<SkillTag> skills = request.getSkillNames().stream()
                    .map(this::getOrCreateSkill)
                    .collect(Collectors.toSet());
            freelancer.setSkills(skills);
        }

        freelancerRepository.save(freelancer);

        String otp = otpService.generateOtp(user.getEmail());

        emailService.sendRegistrationOtpEmail(user.getEmail(),otp,user.getFullName(), request.getTargetRole());
    }

    private SkillTag getOrCreateSkill(String skillName) {
        String normalizedName = skillName.trim().toUpperCase();
        return skillTagRepository.findByNameIgnoreCase(normalizedName)
                .orElseGet(() -> {
                    SkillTag newTag = new SkillTag();
                    newTag.setName(normalizedName);
                    newTag.setLabel(skillName.trim()); // <-- Add this to save the UI-friendly name
                    return skillTagRepository.save(newTag);
                });
    }
}