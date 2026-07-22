package com.mark.conduyt.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;


@Component
@Order(Ordered.HIGHEST_PRECEDENCE) // Ensures this runs before Spring Security
@Slf4j
public class RequestLoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;

        // This prints the Method (GET/POST) and the URL path
        log.info(">>> INCOMING REQUEST: {} {}", req.getMethod(), req.getRequestURI());

        // Optional: Print Origin to debug CORS issues
        String origin = req.getHeader("Origin");
        if (origin != null) {
            log.info(">>> ORIGIN: {}", origin);
        }

        chain.doFilter(request, response);
    }
}