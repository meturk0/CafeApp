package com.emin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.emin.dto.DtoCampaign;

public interface ICampaignController {

    public DtoCampaign getCampaignById(Long id);
    
    public ResponseEntity<DtoCampaign> addCampaign( DtoCampaign dtoCampaign);

    public ResponseEntity<?> deleteCampaign(Long id);

    public ResponseEntity<DtoCampaign> updateCampaign(Long id, DtoCampaign dtoCampaign);

    public ResponseEntity<List<DtoCampaign>> getAllCampaigns();
}
