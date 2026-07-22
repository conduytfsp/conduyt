package com.mark.conduyt.service;


import com.mark.conduyt.dto.UserRegisterRequestDTO;
import com.mark.conduyt.entity.User;
import com.mark.conduyt.enums.AccountStatus;
import com.mark.conduyt.exception.UserNotFoundException;
import com.mark.conduyt.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
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

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority(roleName))
        );
    }

//    public User saveUser(User user) {
//        return userRepository.save(user);
//    }

    public User createUser(UserRegisterRequestDTO request, MultipartFile profileImage) throws IOException {
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
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

    // NOTE: You would need a utility similar to this for production code:
//    static class RandomPasswordGenerator {
//        // A simple placeholder; use a robust implementation in your actual project.
//        private static final String CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
//        private static final java.security.SecureRandom RANDOM = new java.security.SecureRandom();
//
//        public static String generate(int length) {
//            StringBuilder sb = new StringBuilder(length);
//            for (int i = 0; i < length; i++) {
//                sb.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
//            }
//            return sb.toString();
//        }
//    }

//    @Transactional
//    public User createAdminUser(AdminUserCreationDTO dto) {
//
//        // 1. Validation Checks (Optional, but good practice if not using DTO validation)
//        if (userRepository.existsByEmail(dto.getEmail())) {
//            throw new IllegalArgumentException("User with this email already exists.");
//        }
//        if (userRepository.existsByPhoneNo(dto.getPhoneNo())) {
//            throw new IllegalArgumentException("User with this phone number already exists.");
//        }
//
//        // 2. Build the User Entity
//        User adminUser = User.builder()
//                .email(dto.getEmail())
//                .phoneNo(dto.getPhoneNo())
//                .userRole(UserRole.ADMIN) // CRITICAL: Set the role to ADMIN
//                .password(passwordEncoder.encode(dto.getPassword())) // Ensure password is encrypted
//                .build();
//
//        // 3. Save and Return
//        return userRepository.save(adminUser);
//    }
}