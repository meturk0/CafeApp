package com.emin.controller.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.emin.controller.ICampaignController;
import com.emin.dto.DtoCampaign;
import com.emin.services.ICampaignService;

@RestController
@RequestMapping("/rest/api/campaign")
public class CampaignControllerImpl implements ICampaignController{

    @Autowired
    private ICampaignService campaignService;

    @GetMapping(path ="/{id}")
    @Override
    public DtoCampaign getCampaignById(@PathVariable(name="id") Long id){

        return campaignService.getCampaignById(id);
    }

    @PostMapping(path ="/add")
    @Override
    public ResponseEntity<DtoCampaign> addCampaign(@RequestBody DtoCampaign dtoCampaign){

        DtoCampaign savedOrder = campaignService.addCampaign(dtoCampaign);
        if (savedOrder == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(savedOrder);
    }

    @Override
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCampaign(@PathVariable(name="id") Long id) {
        try {
            campaignService.deleteCampaignById(id);
            return ResponseEntity.ok("Kampanya başarıyla silindi.");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body("Kampanya bulunamadı.");
        }
    }
    
    @Override
    @PutMapping("/update/{id}")
    public ResponseEntity<DtoCampaign> updateCampaign(@PathVariable Long id, @RequestBody DtoCampaign dtoCampaign){

        DtoCampaign updatedcCampaign = campaignService.updateCampaign(id, dtoCampaign);
        if (updatedcCampaign == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedcCampaign);
    }

    @GetMapping("/all")
    public ResponseEntity<List<DtoCampaign>> getAllCampaigns() {
        List<DtoCampaign> campaigns = campaignService.getAllCampaigns();
        return ResponseEntity.ok(campaigns);
    }
}
