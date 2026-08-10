package com.mark.conduyt.service;

import com.mark.conduyt.repository.NotificationRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Component
public class NotificationCleanupService {

    private final NotificationRepository notificationRepository;

    public NotificationCleanupService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    // Runs every day at midnight to clean up read notifications older than 30 days
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void purgeOldNotifications() {
        LocalDateTime threshold = LocalDateTime.now().minusDays(30);
        notificationRepository.deleteByCreatedAtBeforeAndIsReadTrue(threshold);
    }
}