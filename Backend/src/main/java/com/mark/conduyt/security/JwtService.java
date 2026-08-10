package com.mark.conduyt.security; // Updated package

import com.mark.conduyt.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service // @Service is slightly more semantically accurate than @Component here
public class JwtService {

    @Value("${JWT_SECRET_KEY}")
    private String secretKey;

    private static final long EXPIRATION_TIME = 86400000L * 7; // 7 days

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    // 1. Now takes the whole User entity
    public String generateToken(User user) {
        return Jwts.builder()
                .subject(user.getEmail())
                // 2. We don't need strict Client/Freelancer roles here, but caching the admin status is smart
                .claim("isAdmin", user.isAdmin())
                // 3. Optional: A base role so Spring Security doesn't complain if it expects one
                .claim("role", user.isAdmin() ? "ROLE_ADMIN" : "ROLE_USER")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean isTokenValid(String token, String userEmail) {
        String extractedEmail = extractEmail(token);
        return (extractedEmail.equals(userEmail) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        Date expiration = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();
        return expiration.before(new Date());
    }
}