package com.mark.conduyt.service;

import com.mark.conduyt.dto.*;
import com.mark.conduyt.entity.Application;
import com.mark.conduyt.entity.Client;
import com.mark.conduyt.entity.Company;
import com.mark.conduyt.entity.User;
import com.mark.conduyt.enums.ApplicationStatus;
import com.mark.conduyt.enums.ClientType;
import com.mark.conduyt.enums.JobStatus;
import com.mark.conduyt.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClientService {

    private final ClientRepository clientRepository;
    private final CompanyRepository companyRepository;
    private final UserService userService;
    private final ImageHostingService imageHostingService;
    private final OtpService otpService;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;

    @Transactional(rollbackFor = Exception.class)
    public void createClient(UserRegisterRequestDTO request, MultipartFile profileImage, MultipartFile companyLogo) throws IOException {
        // 1. Delegate core user creation
        User user = userService.createUser(request, profileImage);

        // 2. Hydrate Client
        Client client = new Client();
        client.setUser(user);
        client.setClientType(request.getClientType() != null ? request.getClientType() : ClientType.INDIVIDUAL);

        // 3. Handle Company Logic if type is COMPANY
        if (request.getClientType() == ClientType.COMPANY) {
            Company company = new Company();
            company.setName(request.getCompanyName());
            company.setWebsiteUrl(request.getWebsiteUrl());
            company.setAddress(request.getCompanyAddress());
            company.setContactNumber(request.getContactNumber());
            company.setGstin(request.getGstin());

            if (companyLogo != null && !companyLogo.isEmpty()) {
                String logoUrl = imageHostingService.uploadPdf(companyLogo, "Company Logo");
                company.setLogoUrl(logoUrl);
            }

            company = companyRepository.save(company);
            client.setCompany(company);
        }

        clientRepository.save(client);
        String otp = otpService.generateOtp(user.getEmail());
        emailService.sendRegistrationOtpEmail(user.getEmail(), otp, user.getFullName(), request.getTargetRole());
    }

    @Transactional(readOnly = true)
    public ClientProfileResponseDTO getClientDashboardData(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        Client client = clientRepository.findByUser(user).orElse(null);

        // Map User to ProfileData
        ClientProfileResponseDTO.ProfileData profileData = new ClientProfileResponseDTO.ProfileData(
                user.getFirstName(),
                user.getMiddleName(),
                user.getLastName(),
                user.getEmail(),
                user.getPfpUrl()
        );

        // Map Client, Company Data & clientType safely
        ClientProfileResponseDTO.CompanyData companyData = null;
        String clientTypeStr = "individual";

        if (client != null) {
            if (client.getClientType() != null) {
                clientTypeStr = client.getClientType().name().toLowerCase();
            }

            Company company = client.getCompany();
            if (company != null) {
                companyData = new ClientProfileResponseDTO.CompanyData(
                        company.getName(),
                        "", // Add companyRole if stored in Company or Client entity, else default empty
                        company.getWebsiteUrl(),
                        company.getContactNumber(),
                        company.getGstin(),
                        company.getAddress()
                );
            }
        }

        return new ClientProfileResponseDTO(profileData, companyData, clientTypeStr);
    }

    @Transactional
    public void updatePersonalProfile(String email, ClientProfileUpdateDTO dto) {
        // 1. Update User Entity
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        user.setFirstName(dto.getFirstName());
        user.setMiddleName(dto.getMiddleName());
        user.setLastName(dto.getLastName());
        if (dto.getProfilePic() != null) {
            user.setPfpUrl(dto.getProfilePic());
        }
        userRepository.save(user);

        // 2. Update Client Entity Type
        Client client = clientRepository.findByUser(user).orElseGet(() -> {
            Client newClient = new Client();
            newClient.setUser(user);
            return newClient;
        });

        if (dto.getClientType() != null) {
            try {
                ClientType type = ClientType.valueOf(dto.getClientType().toUpperCase());
                client.setClientType(type);
            } catch (IllegalArgumentException e) {
                client.setClientType(ClientType.INDIVIDUAL);
            }
        }
        clientRepository.save(client);
    }

    @Transactional(readOnly = true)
    public PublicClientProfileDTO getPublicClientProfile(String slug) {
        User user = userRepository.findByProfileSlug(slug)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Client client = clientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Client profile not found"));

        PublicClientProfileDTO dto = new PublicClientProfileDTO();
        dto.setDisplayName(client.getDisplayName());
        dto.setClientType(client.getClientType().name());
        dto.setPfpUrl(user.getPfpUrl());
        dto.setEmail(user.getEmail());

        // --- Check for Dual Account ---
        dto.setHasFreelancerProfile(user.getFreelancer() != null); // <-- ADD THIS LINE

        // --- Calculate Analytics ---
        int jobsPosted = 0;
        int totalHires = 0;
        double totalSpent = 0.0;

        if (client.getJobs() != null) {
            jobsPosted = client.getJobs().size();
            for (var job : client.getJobs()) {
                if (job.getStatus() != null && job.getStatus().name().equalsIgnoreCase("COMPLETED")) {
                    totalHires++;
                    if (job.getFixedBudget() != null) {
                        totalSpent += job.getFixedBudget();
                    }
                }
            }
        }

        dto.setTotalJobsPosted(jobsPosted);
        dto.setTotalHires(totalHires);
        dto.setTotalSpent(totalSpent);

        // --- Map Company Data ---
        if (client.getClientType() == com.mark.conduyt.enums.ClientType.COMPANY && client.getCompany() != null) {
            Company company = client.getCompany();
            dto.setVerified(company.isVerified());
            dto.setWebsiteUrl(company.getWebsiteUrl());
            dto.setContactNumber(company.getContactNumber());
            dto.setAddress(company.getAddress());
        } else {
            dto.setVerified(false);
        }

        return dto;
    }

    @Transactional
    public void updateCompanyProfile(String email, CompanyDetailsUpdateDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        Client client = clientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Client profile not found for user"));

        Company company = client.getCompany();
        if (company == null) {
            company = new Company();
            client.setCompany(company);
        }

        company.setName(dto.getCompanyName());
        company.setWebsiteUrl(dto.getCompanyWebsite());
        company.setContactNumber(dto.getContactNumber());
        company.setGstin(dto.getGstin());
        company.setAddress(dto.getCompanyAddress());

        companyRepository.save(company);
        clientRepository.save(client);
    }

    // Add these to ClientService.java

    @Transactional(readOnly = true)
    public Client findClientByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return clientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Client profile not found for user: " + email));
    }

    public ClientPreferencesDTO getPreferences(String email) {
        Client client = findClientByEmail(email);

        ClientPreferencesDTO dto = new ClientPreferencesDTO();
        dto.setNotificationsEnabled(client.isNotifyOnHighMatchCandidate());
        dto.setAiMatchThreshold(client.getMatchThresholdScore());

        return dto;
    }

    // 2. Update Preferences
    @Transactional
    public void updatePreferences(String email, ClientPreferencesDTO request) {
        Client client = findClientByEmail(email);

        if (request.getNotificationsEnabled() != null) {
            client.setNotifyOnHighMatchCandidate(request.getNotificationsEnabled());
        }

        if (request.getAiMatchThreshold() != null) {
            // Ensure threshold stays within valid 1-100 bounds
            double threshold = Math.max(1.0, Math.min(100.0, request.getAiMatchThreshold()));
            client.setMatchThresholdScore(threshold);
        }

        clientRepository.save(client);
    }

    public ClientStatsWrapperDTO getClientOverviewStats(String email) {
        Client client = findClientByEmail(email);

        // TODO: Replace these with actual count queries from your Repositories
        long activeJobs = jobRepository.countByClientAndStatus(client, JobStatus.OPEN);
        long totalApps = applicationRepository.countByJob_Client(client);
        long shortlisted = applicationRepository.countByJob_ClientAndStatus(client, ApplicationStatus.SHORTLISTED);
        long hired = applicationRepository.countByJob_ClientAndStatus(client, ApplicationStatus.ACCEPTED);

        return ClientStatsWrapperDTO.builder()
                .stats(ClientStatsWrapperDTO.ClientStatsDTO.builder()
                        .activeJobs(activeJobs)
                        .applications(totalApps)
                        .shortlisted(shortlisted)
                        .hired(hired)
                        .build())
                .build();
    }

    public List<CandidateRankingDTO> getAiCandidateRankings(String email) {
        Client client = findClientByEmail(email);

        // 1. Fetch recent/top applications for this client's jobs
        // Order them by AI Compatibility Score DESC
        List<Application> topApplications = applicationRepository.findTop10ByJob_ClientOrderByAiCompatibilityScoreDesc(client);

        // 2. Map them to the DTO
        return topApplications.stream().map(app -> CandidateRankingDTO.builder()
                .id(app.getId())
                .name(app.getFreelancer().getUser().getFullName())
                .role(app.getFreelancer().getTitle())
                .match(app.getAiCompatibilityScore())
                // Ensure your ApplicationStatus enum maps nicely to the frontend strings ("new", "shortlisted", etc.)
                .status(app.getStatus().name().toLowerCase())
                .experience("") // Leave blank or map if you have it
                .slug(app.getFreelancer().getUser().getProfileSlug())
                .image(app.getFreelancer().getUser().getPfpUrl())
                .build()
        ).collect(Collectors.toList());
    }

    @Transactional
    public void updateApplicationStatus(String email, Long applicationId, String newStatus) {
        Client client = findClientByEmail(email);
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Security check: Ensure the client owns the job this application is for
        if (!app.getJob().getClient().getId().equals(client.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        // Map the frontend string ("shortlisted", "new") to your Backend Enum
        if ("shortlisted".equalsIgnoreCase(newStatus)) {
            app.setStatus(ApplicationStatus.SHORTLISTED);
        } else if ("new".equalsIgnoreCase(newStatus)) {
            app.setStatus(ApplicationStatus.SUBMITTED);
        }

        applicationRepository.save(app);
    }

    @Transactional
    public void actionProposal(String email, Long applicationId, ApplicationStatus newStatus) {
        Client client = findClientByEmail(email);
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Security check: Ensure the client owns the job this application is for
        if (!app.getJob().getClient().getId().equals(client.getId())) {
            throw new RuntimeException("Unauthorized to modify this proposal");
        }

        // Prevent modifying withdrawn applications
        if (app.getStatus() == ApplicationStatus.WITHDRAWN) {
            throw new RuntimeException("Cannot modify a withdrawn application");
        }

        app.setStatus(newStatus);
        applicationRepository.save(app);
    }

}