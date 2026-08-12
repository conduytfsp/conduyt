package com.mark.conduyt.service;


import com.mark.conduyt.dto.UserRegisterRequestDTO;
import com.mark.conduyt.entity.User;
import com.mark.conduyt.enums.AccountStatus;
import com.mark.conduyt.exception.UserNotFoundException;
import com.mark.conduyt.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
@Transactional
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final OtpService otpService;
    private final ImageHostingService imageHostingService;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Map the boolean flag to a standard Spring Security role
        String roleName = user.isAdmin() ? "ROLE_ADMIN" : "ROLE_USER";

        // Assuming your enum has a value like 'ACTIVE'. Adjust if it's 'VERIFIED' etc.
        boolean isEnabled = (user.getAccountStatus() == AccountStatus.ACTIVE);

        // Using the expanded constructor to tie your AccountStatus to Spring's security checks
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                isEnabled, // enabled - if false, Spring automatically throws DisabledException
                true,      // accountNonExpired
                true,      // credentialsNonExpired
                true,      // accountNonLocked
                Collections.singleton(new SimpleGrantedAuthority(roleName))
        );
    }


    private String generateDefaultSlug(String email) {
        // 1. Grab everything before the '@' symbol
        String prefix = email.substring(0, email.indexOf('@'));

        // 2. Remove any weird characters (just in case) and make it lowercase
        String cleanPrefix = prefix.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();

        // 3. Append a 6-character random string to ensure it's unique
        String randomSuffix = UUID.randomUUID().toString().substring(0, 6);

        return cleanPrefix + "-" + randomSuffix;
    }

    public User createUser(UserRegisterRequestDTO request, MultipartFile profileImage) throws IOException {
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setProfileSlug(generateDefaultSlug(request.getEmail()));
        user.setAccountStatus(AccountStatus.PENDING);

        // Process file upload directly in the user service
        if (profileImage != null && !profileImage.isEmpty()) {
            String imageUrl = imageHostingService.uploadImage(profileImage, "Profile Image");
            user.setPfpUrl(imageUrl);
        }
        return userRepository.save(user);
    }

    public boolean validateOtp(String email, String otp) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found for OTP validation."));

        boolean isValid = otpService.validateOtp(email, otp);
        if (!isValid) {
            throw new IllegalArgumentException("Invalid or expired OTP.");
        }

        return true;
    }

    @Transactional
    public boolean validateUser(String email, String otp) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found for OTP validation."));

        boolean isValid = otpService.validateOtp(email, otp);
        if (!isValid) {
            throw new IllegalArgumentException("Invalid or expired OTP.");
        }

        // Evaluate profile slug to determine exact status
        String slug = user.getProfileSlug();
        if (slug != null && !slug.trim().isEmpty()) {
            user.setAccountStatus(AccountStatus.ACTIVE);
        } else {
            user.setAccountStatus(AccountStatus.PROFILE_INCOMPLETE);
        }

        emailService.sendSuccessfulRegistrationEmail(user.getEmail(),user.getFullName());

        // Persist the updated status
        userRepository.save(user);

        return true;
    }



    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public void initiatePasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found for password reset."));

        String otp = otpService.generateOtp(email);

        String userName = user.getEmail();
        emailService.sendPasswordResetOtpEmail(email, otp, userName);
    }

    @Transactional
    public void resetPassword(String email, String newPassword) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found for password reset."));

        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        userRepository.save(user);

        // Clear OTP from cache
        otpService.clearOtp(email);
    }

    public User getUserByEmail(String email) {
        return userRepository.getUserByEmail(email);
    }

    @Scheduled(cron = "0 0 16 * * ?")
    @Transactional(rollbackFor = Exception.class)
    public void cleanupPendingAccounts() {
        List<User> pendingUsers = userRepository.findByAccountStatus(AccountStatus.PENDING);

        if (!pendingUsers.isEmpty()) {
            userRepository.deleteAll(pendingUsers);
            System.out.println("Cleaned up " + pendingUsers.size() + " unverified/pending accounts.");
        }
    }
}