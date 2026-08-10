package com.mark.conduyt.config;

import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class WebConfig {
    // Spring will now automatically serialize pages safely as stable DTOs
}