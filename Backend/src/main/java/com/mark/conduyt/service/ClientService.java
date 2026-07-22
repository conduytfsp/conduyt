package com.mark.conduyt.service;

import com.mark.conduyt.dto.UserRegisterRequestDTO;
import com.mark.conduyt.entity.Client;
import com.mark.conduyt.entity.Company;
import com.mark.conduyt.entity.User;
import com.mark.conduyt.enums.ClientType;
import com.mark.conduyt.repository.ClientRepository;
import com.mark.conduyt.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;
    private final CompanyRepository companyRepository;
    private final UserService userService; // Injecting the core user service
    private final ImageHostingService imageHostingService;

    @Transactional(rollbackFor = Exception.class)
    public void createClient(UserRegisterRequestDTO request, MultipartFile profileImage, MultipartFile companyLogo) throws IOException {

        // 1. Delegate core user creation (and pfp upload)
        User user = userService.createUser(request, profileImage);

        // 2. Hydrate Client
        Client client = new Client();
        client.setUser(user);
        client.setClientType(request.getClientType());

        // 3. Handle Company Logic
        if (request.getClientType() == ClientType.COMPANY) {
            Company company = new Company();
            company.setName(request.getCompanyName());
            company.setWebsiteUrl(request.getWebsiteUrl());
            company.setAddress(request.getCompanyAddress());
            company.setContactNumber(request.getContactNumber());
            company.setGstin(request.getGstin());

            // Process the company logo if it was uploaded
            if (companyLogo != null && !companyLogo.isEmpty()) {
                 String logoUrl = imageHostingService.uploadPdf(companyLogo, "Company Logo");
                 company.setLogoUrl(logoUrl);
            }

            company = companyRepository.save(company);
            client.setCompany(company);
        }

        clientRepository.save(client);
    }
}