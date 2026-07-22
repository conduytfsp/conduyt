package com.mark.conduyt.service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class CacheService {

    private final Cache<String, String> otpCache;


    public CacheService() {

        this.otpCache = Caffeine.newBuilder()
                .expireAfterWrite(3, TimeUnit.MINUTES)
                .maximumSize(1000)
                .build();

    }


    public void cacheOtp(String email, String otp) {
        otpCache.put("otp:" + email, otp);
    }

    public String getCachedOtp(String email) {
        return otpCache.getIfPresent("otp:" + email);
    }

    public void evictCachedData(String email) {
        otpCache.invalidate("otp:" + email);
    }

}