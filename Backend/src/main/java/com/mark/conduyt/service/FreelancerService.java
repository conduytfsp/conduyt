package com.mark.conduyt.service;

import com.mark.conduyt.dto.*;
import com.mark.conduyt.entity.*;
import com.mark.conduyt.enums.AccountStatus;
import com.mark.conduyt.enums.ApplicationStatus;
import com.mark.conduyt.repository.ApplicationRepository;
import com.mark.conduyt.repository.FreelancerRepository;
import com.mark.conduyt.repository.SkillTagRepository;
import com.mark.conduyt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FreelancerService {

    private final FreelancerRepository freelancerRepository;
    private final SkillTagRepository skillTagRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final ImageHostingService imageHostingService;
    private final EmailService emailService;
    private final OtpService otpService;
    private final ApplicationRepository applicationRepository;

    @Transactional(rollbackFor = Exception.class)
    public void createFreelancer(UserRegisterRequestDTO request, MultipartFile profileImage, MultipartFile cvFile) throws IOException {
        // 1. Delegate core user creation
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
        emailService.sendRegistrationOtpEmail(user.getEmail(), otp, user.getFullName(), request.getTargetRole());
    }

    @Transactional(readOnly = true)
    public PublicFreelancerProfileDTO getPublicFreelancerProfile(String slug) {
        User user = userRepository.findByProfileSlug(slug)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Ensure user is ACTIVE
        if (user.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new RuntimeException("This profile is currently unavailable.");
        }

        Freelancer freelancer = freelancerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found"));

        PublicFreelancerProfileDTO dto = new PublicFreelancerProfileDTO();
        dto.setDisplayName(user.getFullName());
        dto.setTitle(freelancer.getTitle());
        dto.setBio(freelancer.getBio());
        dto.setPfpUrl(user.getPfpUrl());
        dto.setEmail(user.getEmail());

        // --- Calculate Analytics ---
        int jobsDone = 0;
        double earnings = 0.0;

        if (freelancer.getApplications() != null) {
            for (var app : freelancer.getApplications()) {
                String status = app.getStatus() != null ? app.getStatus().name() : "";
                if (status.equalsIgnoreCase("HIRED") || status.equalsIgnoreCase("COMPLETED") || status.equalsIgnoreCase("ACCEPTED")) {
                    jobsDone++;
                    if (app.getJob() != null && app.getJob().getFixedBudget() != null) {
                        earnings += app.getJob().getFixedBudget();
                    }
                }
            }
        }
        dto.setTotalJobsDone(jobsDone);
        dto.setTotalEarnings(earnings);

        dto.setGithubUrl(freelancer.getGithubUrl());
        dto.setLinkedinUrl(freelancer.getLinkedinUrl());
        dto.setPortfolioUrl(freelancer.getPortfolioUrl());
        dto.setCvUrl(freelancer.getCvUrl());

        if (freelancer.getSkills() != null) {
            dto.setSkills(freelancer.getSkills().stream()
                    .map(SkillTag::getName)
                    .collect(Collectors.toList()));
        } else {
            dto.setSkills(new ArrayList<>());
        }

        dto.setHasClientProfile(user.getClient() != null);
        return dto;
    }

    private SkillTag getOrCreateSkill(String skillName) {
        String normalizedName = skillName.trim().toUpperCase();
        return skillTagRepository.findByNameIgnoreCase(normalizedName)
                .orElseGet(() -> {
                    SkillTag newTag = new SkillTag();
                    newTag.setName(normalizedName);
                    newTag.setLabel(skillName.trim());
                    return skillTagRepository.save(newTag);
                });
    }

    // ================= SAFE GET PROFILE (No crash if missing) =================
    @Transactional(readOnly = true)
    public FreelancerProfileDTO getProfile(String email) {
        User user = userService.getUserByEmail(email);

        FreelancerProfileDTO dto = new FreelancerProfileDTO();
        // Base user info maps immediately
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setAvatarUrl(user.getPfpUrl());
        dto.setSlug(user.getProfileSlug());

        // If freelancer profile exists, overlay its data safely
        freelancerRepository.findByUser(user).ifPresent(freelancer -> {
            dto.setId(freelancer.getId());
            dto.setProfessionalTitle(freelancer.getTitle());
            dto.setBio(freelancer.getBio());

            if (freelancer.getSkills() != null) {
                List<String> skillNames = freelancer.getSkills().stream()
                        .map(tag -> tag.getLabel() != null ? tag.getLabel() : tag.getName())
                        .collect(Collectors.toList());
                dto.setSkills(skillNames);
            }
        });

        return dto;
    }

    @Transactional(readOnly = true)
    public Page<FreelancerProfileDTO> getPaginatedFreelancers(Pageable pageable) {

        return freelancerRepository.findByUserAccountStatus(AccountStatus.ACTIVE, pageable)
                .map(this::mapToProfileDTO);
    }

    private FreelancerProfileDTO mapToProfileDTO(Freelancer freelancer) {
        FreelancerProfileDTO dto = new FreelancerProfileDTO();
        dto.setId(freelancer.getId());
        dto.setProfessionalTitle(freelancer.getTitle());
        dto.setBio(freelancer.getBio());

        if (freelancer.getUser() != null) {
            dto.setFirstName(freelancer.getUser().getFirstName());
            dto.setLastName(freelancer.getUser().getLastName());
            dto.setAvatarUrl(freelancer.getUser().getPfpUrl());
            dto.setSlug(freelancer.getUser().getProfileSlug());
            dto.setEmail(freelancer.getUser().getEmail());
        }

        if (freelancer.getSkills() != null) {
            dto.setSkills(freelancer.getSkills().stream()
                    .map(SkillTag::getName)
                    .collect(Collectors.toList()));
        } else {
            dto.setSkills(new ArrayList<>());
        }
        return dto;
    }

    // ================= PROFILE UPSERT =================
    @Transactional(rollbackFor = Exception.class)
    public FreelancerProfileDTO updateProfile(String email, FreelancerProfileDTO request) {
        User user = userService.getUserByEmail(email);

        // UPSERT: Create silently if missing on save
        Freelancer freelancer = freelancerRepository.findByUser(user)
                .orElseGet(() -> {
                    Freelancer newFreelancer = new Freelancer();
                    newFreelancer.setUser(user);
                    newFreelancer.setTitle(request.getProfessionalTitle() != null ? request.getProfessionalTitle() : "");
                    newFreelancer.setNotifyOnMatchingJobs(true);
                    return newFreelancer;
                });

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        userRepository.save(user);

        if (request.getProfessionalTitle() != null) freelancer.setTitle(request.getProfessionalTitle());
        if (request.getBio() != null) freelancer.setBio(request.getBio());

        if (request.getSkills() != null) {
            Set<SkillTag> updatedSkills = request.getSkills().stream()
                    .map(this::getOrCreateSkill)
                    .collect(Collectors.toSet());
            freelancer.setSkills(updatedSkills);
        }

        freelancerRepository.save(freelancer);
        return getProfile(email);
    }

    @Transactional(rollbackFor = Exception.class)
    public String uploadAvatar(String email, MultipartFile file) throws IOException {
        User user = userService.getUserByEmail(email);
        String avatarUrl = imageHostingService.uploadImage(file, "Profile Picture");
        user.setPfpUrl(avatarUrl);
        userRepository.save(user);
        return avatarUrl;
    }

    // ================= SAFE GET PORTFOLIO =================
    @Transactional(readOnly = true)
    public FreelancerPortfolioDTO getPortfolio(String email) {
        User user = userService.getUserByEmail(email);
        FreelancerPortfolioDTO dto = new FreelancerPortfolioDTO();

        // Safely overlay if it exists
        freelancerRepository.findByUser(user).ifPresent(freelancer -> {
            dto.setGithubUrl(freelancer.getGithubUrl());
            dto.setLinkedinUrl(freelancer.getLinkedinUrl());
            dto.setPortfolioUrl(freelancer.getPortfolioUrl());
            dto.setResumeUrl(freelancer.getCvUrl());

            if (freelancer.getCvUrl() != null && !freelancer.getCvUrl().isEmpty()) {
                String url = freelancer.getCvUrl();
                String fileName = url.substring(url.lastIndexOf("/") + 1);
                dto.setResumeFileName(fileName.contains("_") ? fileName.substring(fileName.indexOf("_") + 1) : fileName);
            }
        });

        return dto;
    }

    // ================= PORTFOLIO UPSERT =================
    @Transactional(rollbackFor = Exception.class)
    public FreelancerPortfolioDTO updatePortfolioLinks(String email, FreelancerPortfolioDTO request) {
        User user = userService.getUserByEmail(email);

        // UPSERT: Create silently if missing (e.g., they skip profile setup and go to portfolio directly)
        Freelancer freelancer = freelancerRepository.findByUser(user)
                .orElseGet(() -> {
                    Freelancer newFreelancer = new Freelancer();
                    newFreelancer.setUser(user);
                    newFreelancer.setTitle(""); // Satisfy non-null DB constraint
                    newFreelancer.setNotifyOnMatchingJobs(true);
                    return newFreelancer;
                });

        if (request.getGithubUrl() != null) freelancer.setGithubUrl(request.getGithubUrl());
        if (request.getLinkedinUrl() != null) freelancer.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getPortfolioUrl() != null) freelancer.setPortfolioUrl(request.getPortfolioUrl());

        freelancerRepository.save(freelancer);
        return getPortfolio(email);
    }

    // ================= RESUME UPSERT =================
    @Transactional(rollbackFor = Exception.class)
    public Map<String, String> uploadResume(String email, MultipartFile file) throws IOException {
        User user = userService.getUserByEmail(email);

        // UPSERT logic here too just in case
        Freelancer freelancer = freelancerRepository.findByUser(user)
                .orElseGet(() -> {
                    Freelancer newFreelancer = new Freelancer();
                    newFreelancer.setUser(user);
                    newFreelancer.setTitle("");
                    return newFreelancer;
                });

        String pdfUrl = imageHostingService.uploadPdf(file, "Resumes");
        freelancer.setCvUrl(pdfUrl);
        freelancerRepository.save(freelancer);

        String originalFileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf";

        return Map.of(
                "url", pdfUrl,
                "fileName", originalFileName
        );
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteResume(String email) {
        User user = userService.getUserByEmail(email);
        Freelancer freelancer = freelancerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found"));

        freelancer.setCvUrl(null);
        freelancerRepository.save(freelancer);
    }

    public List<FreelancerApplicationDTO> getApplications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Freelancer freelancer = freelancerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found"));

        List<Application> applications = applicationRepository.findByFreelancer(freelancer);

        return applications.stream().map(app -> {
            FreelancerApplicationDTO dto = new FreelancerApplicationDTO();

            dto.setId(app.getId());

            // 👇 THIS IS THE NEW LINE FOR THE FRONTEND BUTTON 👇
            dto.setJobId(app.getJob().getId());

            dto.setJobTitle(app.getJob().getTitle());
            dto.setFixedBudget(app.getJob().getFixedBudget());
            dto.setClientName(app.getJob().getClient().getDisplayName());
            dto.setClientType(app.getJob().getClient().getClientType().name());
            dto.setClientEmail(app.getJob().getClient().getUser().getEmail());
            dto.setContactNo(app.getJob().getContactNo());
            dto.setAppliedDate(app.getAppliedAt());

            dto.setStatus(app.getStatus().name());

            if (app.getJob().getStatus() != null) {
                dto.setJobStatus(app.getJob().getStatus().name());
            } else {
                dto.setJobStatus("OPEN");
            }

            dto.setAiCompatibilityScore(app.getAiCompatibilityScore());
            dto.setPitch(app.getPitch());
            dto.setJobDescription(app.getJob().getDescription());
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class)
    public void withdrawApplication(String email, Long applicationId) {
        User user = userService.getUserByEmail(email);
        Freelancer freelancer = freelancerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found"));

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getFreelancer().getId().equals(freelancer.getId())) {
            throw new RuntimeException("Unauthorized to withdraw this application");
        }

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
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found for user: " + email));
    }

    public boolean getNotificationsEnabled(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

        return freelancerRepository.findByUser(user)
                .map(Freelancer::isNotifyOnMatchingJobs)
                .orElse(false); // Default to false if no profile exists yet
    }

    @Transactional
    public void updateNotificationsEnabled(String email, Boolean notificationsEnabled) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

        // UPSERT just in case
        Freelancer freelancer = freelancerRepository.findByUser(user)
                .orElseGet(() -> {
                    Freelancer newFreelancer = new Freelancer();
                    newFreelancer.setUser(user);
                    newFreelancer.setTitle("");
                    return newFreelancer;
                });

        freelancer.setNotifyOnMatchingJobs(notificationsEnabled != null ? notificationsEnabled : true);
        freelancerRepository.save(freelancer);
    }

    @Transactional(readOnly = true)
    public List<PublicFreelancerProfileDTO> getFeaturedFreelancers() {
        // 1. Fetch all active freelancers from the database
        List<Freelancer> activeFreelancers = freelancerRepository.findAllActive();

        // 2. Shuffle them to maintain randomness when there are more than 3
        Collections.shuffle(activeFreelancers);

        // 3. Take up to 3 (if <= 3 exist, it automatically returns all of them)
        List<Freelancer> selectedFreelancers = activeFreelancers.stream()
                .limit(3)
                .collect(Collectors.toList());

        return selectedFreelancers.stream()
                .map(f -> {
                    PublicFreelancerProfileDTO dto = new PublicFreelancerProfileDTO();
                    dto.setDisplayName(f.getUser().getFullName());
                    dto.setTitle(f.getTitle());
                    dto.setPfpUrl(f.getUser().getPfpUrl());
                    dto.setSlug(f.getUser().getProfileSlug());

                    long jobsDone = f.getApplications().stream()
                            .filter(a -> a.getStatus() == ApplicationStatus.ACCEPTED)
                            .count();

                    dto.setTotalJobsDone((int) jobsDone);

                    dto.setSkills(f.getSkills().stream()
                            .map(SkillTag::getName)
                            .limit(3)
                            .collect(Collectors.toList()));

                    return dto;
                }).collect(Collectors.toList());
    }
}