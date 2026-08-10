package com.mark.conduyt.repository;

import com.mark.conduyt.entity.Client;
import com.mark.conduyt.entity.Freelancer;
import com.mark.conduyt.entity.Job;
import com.mark.conduyt.enums.ApplicationStatus;
import com.mark.conduyt.enums.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {

    // Used in JobFetchService: getClientJobs
    Page<Job> findByClient(Client client, Pageable pageable);

    List<Job> findByClient(Client client);

    // Used in JobFetchService: getFreelancerAppliedJobs
    Page<Job> findByApplications_Freelancer(Freelancer freelancer, Pageable pageable);

    long countByClientAndStatus(Client client, JobStatus status);
}