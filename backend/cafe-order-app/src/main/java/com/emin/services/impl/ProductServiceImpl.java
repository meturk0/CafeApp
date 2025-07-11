package com.emin.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.emin.dto.DtoProduct;
import com.emin.entities.Product;
import com.emin.repository.OrderRepository;
import com.emin.repository.ProductRepository;
import com.emin.services.IProductService;

@Service
public class ProductServiceImpl implements IProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public DtoProduct findProductById(Long id) {
        DtoProduct dtoProduct = new DtoProduct();
        Optional<Product> optional = productRepository.findById(id);
        if (optional.isEmpty()) {
            return null;
        }
        Product product = optional.get();

        BeanUtils.copyProperties(product, dtoProduct);

        return dtoProduct;
    }

    @Override
    public DtoProduct addProduct(DtoProduct dtoProduct) {

        if (dtoProduct == null) {
            return null;
        }

        Product product = new Product();
        BeanUtils.copyProperties(dtoProduct, product);
        product.setActivity(true); // Yeni ürünler her zaman aktif

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
        Product product = optional.get();
        // Eğer ürün bir order'da varsa silme, activity=false yap
        if (orderRepository.existsByProducts_Id(id)) {
            product.setActivity(false);
            productRepository.save(product);
        } else {
            productRepository.deleteById(id);
        }
    }

    @Override
    public DtoProduct updateProduct(Long id, DtoProduct dtoProduct) {

        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            return null; // veya exception fırlat
        }

        Product existingProduct = optionalProduct.get();

        // Güncellenecek alanları dto'dan al ve mevcut kullanıcıya aktar
        existingProduct.setName(dtoProduct.getName());
        existingProduct.setPrice(dtoProduct.getPrice());
        existingProduct.setDescription(dtoProduct.getDescription());
        existingProduct.setCategory(dtoProduct.getCategory());

        Product updatedProduct = productRepository.save(existingProduct);

        DtoProduct updatedDto = new DtoProduct();
        BeanUtils.copyProperties(updatedProduct, updatedDto);

        return updatedDto;
    }

    @Override
    public List<DtoProduct> getAllProducts() {
        List<DtoProduct> dtoProducts = new ArrayList<>();
        List<Product> products = productRepository.findByActivityTrue();
        for (Product product : products) {
            DtoProduct dtoProduct = new DtoProduct();
            BeanUtils.copyProperties(product, dtoProduct);
            dtoProducts.add(dtoProduct);
        }
        return dtoProducts;
    }

}
