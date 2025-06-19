package com.emin.services;

import java.util.List;

import com.emin.dto.DtoCampaign;

public interface ICampaignService {
    
    public DtoCampaign getCampaignById(Long id);

    public DtoCampaign addCampaign (DtoCampaign dtoCampaign);

    public void deleteCampaignById(Long id);

    public DtoCampaign updateCampaign(Long id, DtoCampaign dtoCampaign);

    public List<DtoCampaign> getAllCampaigns();
}
