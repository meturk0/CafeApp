package com.emin.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.emin.entities.Campaign;

public interface CampaignRepository extends JpaRepository<Campaign,Long>{
    
}
