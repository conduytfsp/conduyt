package com.mark.conduyt.enums;

public enum AccountStatus {
    PENDING,   // Created, waiting for OTP
    PROFILE_INCOMPLETE,
    ACTIVE,    // OTP verified, good to go
    SUSPENDED  // Admin banned
}