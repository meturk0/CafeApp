package com.emin.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.emin.dto.DtoCampaign;
import com.emin.dto.DtoProduct;
import com.emin.entities.Campaign;
import com.emin.entities.Product;
import com.emin.repository.CampaignRepository;
import com.emin.repository.ProductRepository;
import com.emin.services.ICampaignService;

import jakarta.transaction.Transactional;

@Service
public class CampaignServiceImpl implements ICampaignService {
    
    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public DtoCampaign getCampaignById(Long id){

        DtoCampaign dtoCampaign = new DtoCampaign();
        Optional<Campaign> optional = campaignRepository.findById(id);
        if(optional.isEmpty()){
            return null;
        }
        Campaign dbCampaign = optional.get();
        BeanUtils.copyProperties(dbCampaign, dtoCampaign);

        if(dbCampaign.getProducts() != null && !dbCampaign.getProducts().isEmpty()){
            for (Product product : dbCampaign.getProducts()) {
                DtoProduct dtoProduct = new DtoProduct();
                BeanUtils.copyProperties(product, dtoProduct);

                dtoCampaign.getProducts().add(dtoProduct);
                
            }
        }

        return dtoCampaign;
    }

    @Transactional
    @Override
    public DtoCampaign addCampaign (DtoCampaign dtoCampaign){

        if (dtoCampaign == null) return null;

        Campaign campaign = new Campaign();
        BeanUtils.copyProperties(dtoCampaign, campaign);


        // 👇 Product listesi set ediliyor
        if (dtoCampaign.getProducts() != null) {
            List<Product> productList = new ArrayList<>();
            for (DtoProduct dtoProduct : dtoCampaign.getProducts()) {
                if (dtoProduct.getId() != null) {
                    Optional<Product> productOpt = productRepository.findById(dtoProduct.getId());
                    productOpt.ifPresent(productList::add);
                }
            }
            campaign.setProducts(productList);
        }

        // 👇 Kaydetme
        Campaign savedCampaign = campaignRepository.save(campaign);

        // 👇 Geri dönüş DTO hazırlanıyor
        DtoCampaign savedDto = new DtoCampaign();
        BeanUtils.copyProperties(savedCampaign, savedDto);

        // 👇 Product'lar DTO'ya ekleniyor
        if (savedCampaign.getProducts() != null) {
            for (Product p : savedCampaign.getProducts()) {
                DtoProduct dtoProduct = new DtoProduct();
                BeanUtils.copyProperties(p, dtoProduct);
                savedDto.getProducts().add(dtoProduct);
            }
        }

        return savedDto;
    }

    @Override
    public void deleteCampaignById(Long id) {
        Optional<Campaign> optional = campaignRepository.findById(id);
        if (optional.isEmpty()) {
            throw new RuntimeException("Kampanya bulunamadı");
        }
        campaignRepository.deleteById(id);
    }

    @Override
    public DtoCampaign updateCampaign(Long id, DtoCampaign dtoCampaign){

        Optional<Campaign> optionalCampaign = campaignRepository.findById(id);
        if (optionalCampaign.isEmpty()) {
            return null; // veya exception fırlat
        }

        Campaign existingCampaign = optionalCampaign.get();

        // Güncellenecek alanları dto'dan al ve mevcut kullanıcıya aktar
        existingCampaign.setName(dtoCampaign.getName());
        existingCampaign.setStart_date(dtoCampaign.getStart_date());
        existingCampaign.setEnd_date(dtoCampaign.getEnd_date());
        existingCampaign.setDescription(dtoCampaign.getDescription());
        existingCampaign.setPrice(dtoCampaign.getPrice());
        if (dtoCampaign.getProducts() != null) {
            List<Product> productList = new ArrayList<>();
            for (DtoProduct dtoProduct : dtoCampaign.getProducts()) {
                if (dtoProduct.getId() != null) {
                    productRepository.findById(dtoProduct.getId()).ifPresent(productList::add);
                }
            }
            existingCampaign.setProducts(productList);
        }

        Campaign updatedCampaign = campaignRepository.save(existingCampaign);

        DtoCampaign updatedDto = new DtoCampaign();
        BeanUtils.copyProperties(updatedCampaign, updatedDto);

        return updatedDto;
    }

    @Override
    public List<DtoCampaign> getAllCampaigns() {
        List<Campaign> campaigns = campaignRepository.findAll();
        List<DtoCampaign> dtoCampaigns = new ArrayList<>();
        for (Campaign campaign : campaigns) {
            DtoCampaign dtoCampaign = new DtoCampaign();
            BeanUtils.copyProperties(campaign, dtoCampaign);
            // Ürünleri ekle
            if (campaign.getProducts() != null && !campaign.getProducts().isEmpty()) {
                for (Product product : campaign.getProducts()) {
                    DtoProduct dtoProduct = new DtoProduct();
                    BeanUtils.copyProperties(product, dtoProduct);
                    dtoCampaign.getProducts().add(dtoProduct);
                }
            }
            dtoCampaigns.add(dtoCampaign);
        }
        return dtoCampaigns;
    }
}
