package com.mark.conduyt.event;

import com.mark.conduyt.entity.Job;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class JobPostedEvent extends ApplicationEvent {
    private final Job job;

    public JobPostedEvent(Object source, Job job) {
        super(source);
        this.job = job;
    }
}