package com.mark.conduyt.service;


import com.mark.conduyt.dto.FreelancerApplicationDTO;
import com.mark.conduyt.dto.FreelancerPortfolioDTO;
import com.mark.conduyt.dto.FreelancerProfileDTO;
import com.mark.conduyt.dto.UserRegisterRequestDTO;
import com.mark.conduyt.entity.*;
import com.mark.conduyt.enums.ApplicationStatus;
import com.mark.conduyt.repository.ApplicationRepository;
import com.mark.conduyt.repository.FreelancerRepository;
import com.mark.conduyt.repository.SkillTagRepository;
import com.mark.conduyt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FreelancerService {

    private final FreelancerRepository freelancerRepository;
    private final SkillTagRepository skillTagRepository;
    private final UserService userService; // Injecting the core user service
    private final UserRepository userRepository;
    private final ImageHostingService imageHostingService;
    private final EmailService emailService;
    private final OtpService otpService;
    private final ApplicationRepository applicationRepository;

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
    public FreelancerProfileDTO getProfile(String email) {
        User user = userService.getUserByEmail(email); // Assuming userService has this, or use userRepository
        Freelancer freelancer = freelancerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found"));

        FreelancerProfileDTO dto = new FreelancerProfileDTO();
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setProfessionalTitle(freelancer.getTitle());
        dto.setBio(freelancer.getBio());
        dto.setAvatarUrl(user.getPfpUrl()); // Adjust if stored in freelancer entity

        // Convert Set<SkillTag> to List<String> using their UI-friendly label or name
        if (freelancer.getSkills() != null) {
            List<String> skillNames = freelancer.getSkills().stream()
                    .map(tag -> tag.getLabel() != null ? tag.getLabel() : tag.getName())
                    .collect(Collectors.toList());
            dto.setSkills(skillNames);
        }

        return dto;
    }

    // ================= PROFILE UPDATER =================
    @Transactional(rollbackFor = Exception.class)
    public FreelancerProfileDTO updateProfile(String email, FreelancerProfileDTO request) {
        User user = userService.getUserByEmail(email);
        Freelancer freelancer = freelancerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found"));

        // Update User info
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        userRepository.save(user);

        // Update Freelancer basic info
        if (request.getProfessionalTitle() != null) freelancer.setTitle(request.getProfessionalTitle());
        if (request.getBio() != null) freelancer.setBio(request.getBio());

        // Update Skills using your existing getOrCreateSkill helper
        if (request.getSkills() != null) {
            Set<SkillTag> updatedSkills = request.getSkills().stream()
                    .map(this::getOrCreateSkill)
                    .collect(Collectors.toSet());
            freelancer.setSkills(updatedSkills);
        }

        freelancerRepository.save(freelancer);

        return getProfile(email);
    }

    // ================= AVATAR UPLOADER =================
    @Transactional(rollbackFor = Exception.class)
    public String uploadAvatar(String email, MultipartFile file) throws IOException {
        User user = userService.getUserByEmail(email);

        // Use your existing ImageHostingService
        String avatarUrl = imageHostingService.uploadImage(file, "Profile Picture"); // Adjust method name based on your ImageHostingService signature

        user.setPfpUrl(avatarUrl);
        userRepository.save(user);

        return avatarUrl;
    }

    // ================= GET PORTFOLIO =================
    public FreelancerPortfolioDTO getPortfolio(String email) {
        User user = userService.getUserByEmail(email);
        Freelancer freelancer = freelancerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found"));

        FreelancerPortfolioDTO dto = new FreelancerPortfolioDTO();
        dto.setGithubUrl(freelancer.getGithubUrl());
        dto.setLinkedinUrl(freelancer.getLinkedinUrl());
        dto.setPortfolioUrl(freelancer.getPortfolioUrl());
        dto.setResumeUrl(freelancer.getCvUrl());

        // Extract a clean file name from the Cloudinary URL if available, or default
        if (freelancer.getCvUrl() != null && !freelancer.getCvUrl().isEmpty()) {
            String url = freelancer.getCvUrl();
            String fileName = url.substring(url.lastIndexOf("/") + 1);
            dto.setResumeFileName(fileName.contains("_") ? fileName.substring(fileName.indexOf("_") + 1) : fileName);
        } else {
            dto.setResumeFileName(null);
        }

        return dto;
    }

    // ================= UPDATE PORTFOLIO LINKS =================
    @Transactional(rollbackFor = Exception.class)
    public FreelancerPortfolioDTO updatePortfolioLinks(String email, FreelancerPortfolioDTO request) {
        User user = userService.getUserByEmail(email);
        Freelancer freelancer = freelancerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found"));

        if (request.getGithubUrl() != null) freelancer.setGithubUrl(request.getGithubUrl());
        if (request.getLinkedinUrl() != null) freelancer.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getPortfolioUrl() != null) freelancer.setPortfolioUrl(request.getPortfolioUrl());

        freelancerRepository.save(freelancer);

        return getPortfolio(email);
    }

    // ================= UPLOAD RESUME =================
    @Transactional(rollbackFor = Exception.class)
    public Map<String, String> uploadResume(String email, MultipartFile file) throws IOException {
        User user = userService.getUserByEmail(email);
        Freelancer freelancer = freelancerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found"));

        // Use your provided uploadPdf method from ImageHostingService
        String pdfUrl = imageHostingService.uploadPdf(file, "Resumes");

        freelancer.setCvUrl(pdfUrl);
        freelancerRepository.save(freelancer);

        String originalFileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf";

        return Map.of(
                "url", pdfUrl,
                "fileName", originalFileName
        );
    }

    // ================= DELETE RESUME =================
    @Transactional(rollbackFor = Exception.class)
    public void deleteResume(String email) {
        User user = userService.getUserByEmail(email);
        Freelancer freelancer = freelancerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found"));

        freelancer.setCvUrl(null);
        freelancerRepository.save(freelancer);
    }

    // ================= GET APPLICATIONS =================
    public List<FreelancerApplicationDTO> getApplications(String email) {
        User user = userService.getUserByEmail(email);
        Freelancer freelancer = freelancerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found"));

        List<Application> applications = applicationRepository.findByFreelancer(freelancer);

        return applications.stream().map(app -> {
            FreelancerApplicationDTO dto = new FreelancerApplicationDTO();
            dto.setId(app.getId());
            dto.setJobTitle(app.getJob().getTitle());
            dto.setFixedBudget(app.getJob().getFixedBudget());
            dto.setClientName(app.getJob().getClient().getDisplayName());
            dto.setClientType(app.getJob().getClient().getClientType().name());
            dto.setClientEmail(app.getJob().getClient().getUser().getEmail());
            dto.setContactNo(app.getJob().getContactNo());
            dto.setAppliedDate(app.getAppliedAt());
            dto.setStatus(app.getStatus().name());
            dto.setAiCompatibilityScore(app.getAiCompatibilityScore());
            dto.setPitch(app.getPitch());
            dto.setJobDescription(app.getJob().getDescription());
            return dto;
        }).collect(Collectors.toList());
    }

    // ================= WITHDRAW APPLICATION =================
    @Transactional(rollbackFor = Exception.class)
    public void withdrawApplication(String email, Long applicationId) {
        User user = userService.getUserByEmail(email);
        Freelancer freelancer = freelancerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found"));

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Verify ownership
        if (!application.getFreelancer().getId().equals(freelancer.getId())) {
            throw new RuntimeException("Unauthorized to withdraw this application");
        }

        // Verify status allows withdrawal
        if (application.getStatus() == ApplicationStatus.SUBMITTED || application.getStatus() == ApplicationStatus.SHORTLISTED) {
            application.setStatus(ApplicationStatus.WITHDRAWN);
            applicationRepository.save(application);
        } else {
            throw new RuntimeException("Cannot withdraw an application that is already processed or completed.");
        }
    }

    public Freelancer findFreelancerByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return freelancerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Client profile not found for user: " + email));
    }

    public boolean getNotificationsEnabled(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

        Freelancer freelancer = freelancerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found for user"));

        return freelancer.isNotifyOnMatchingJobs();
    }

    @Transactional
    public void updateNotificationsEnabled(String email, Boolean notificationsEnabled) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

        Freelancer freelancer = freelancerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found for user"));

        freelancer.setNotifyOnMatchingJobs(notificationsEnabled != null ? notificationsEnabled : true);
        freelancerRepository.save(freelancer);
    }
}