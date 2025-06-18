package com.emin.services.impl;

import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.emin.dto.DtoProduct;
import com.emin.entities.Product;
import com.emin.repository.ProductRepository;
import com.emin.services.IProductService;

@Service
public class ProductServiceImpl implements IProductService {
    
    @Autowired
    private ProductRepository productRepository;

    @Override
    public DtoProduct findProductById(Long id){
        DtoProduct dtoProduct = new DtoProduct();
        Optional<Product> optional = productRepository.findById(id);
        if(optional.isEmpty()){
            return null;
        }
        Product product = optional.get();

        BeanUtils.copyProperties(product, dtoProduct);
        
        return dtoProduct;
    }

    @Override
    public DtoProduct addProduct(DtoProduct dtoProduct){

        if (dtoProduct == null) {
            return null;
        }

        Product product = new Product();
        BeanUtils.copyProperties(dtoProduct, product);

        Product savedProduct = productRepository.save(product);

        DtoProduct savedDto = new DtoProduct();
        BeanUtils.copyProperties(savedProduct, savedDto);
        return savedDto;
    }

    @Override
    public void deleteProductById(Long id) {
        Optional<Product> optional = productRepository.findById(id);
        if (optional.isEmpty()) {
            throw new RuntimeException("Ürün bulunamadı");
        }
        productRepository.deleteById(id);
    }

    @Override
    public DtoProduct updateProduct(Long id, DtoProduct dtoProduct){

        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            return null; // veya exception fırlat
        }

        Product existingProduct = optionalProduct.get();

        // Güncellenecek alanları dto'dan al ve mevcut kullanıcıya aktar
        existingProduct.setName(dtoProduct.getName());
        existingProduct.setPrice(dtoProduct.getPrice());
        existingProduct.setAmount(dtoProduct.getAmount());
        existingProduct.setDescription(dtoProduct.getDescription());

        Product updatedProduct = productRepository.save(existingProduct);

        DtoProduct updatedDto = new DtoProduct();
        BeanUtils.copyProperties(updatedProduct, updatedDto);

        return updatedDto;
    }

}
