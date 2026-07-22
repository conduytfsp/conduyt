package com.mark.conduyt.security;


import com.mark.conduyt.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Handle OPTIONS (Pre-flight checks)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = null;

        // 2. Cookie Extraction
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    break;
                }
            }
        }

        // 3. FIX: If NO token found, DO NOT FAIL. Just continue.
        // This allows the request to reach the Login Controller.
        // If this was a request to a protected page, Spring Security will throw 403 later.
        if (jwt == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // 4. Token Validation
        try {
            String userEmail = jwtService.extractEmail(jwt);

            if (userEmail != null &&
                    (SecurityContextHolder.getContext().getAuthentication() == null ||
                            SecurityContextHolder.getContext().getAuthentication() instanceof AnonymousAuthenticationToken)) {

                if (jwtService.isTokenValid(jwt, userEmail)) {
                    UserDetails userDetails = userService.loadUserByUsername(userEmail);

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Optional: You can choose to fail here, or just continue without auth
            // System.out.println("JWT processing failed: " + e.getMessage());
        }

        // 5. Always continue the chain
        filterChain.doFilter(request, response);
    }
}