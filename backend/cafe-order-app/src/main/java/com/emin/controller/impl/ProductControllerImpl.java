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

import com.emin.controller.IProductController;
import com.emin.dto.DtoProduct;
import com.emin.services.IProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/rest/api/product")
public class ProductControllerImpl implements IProductController {
    
    @Autowired
    private IProductService productService;

    @GetMapping(path = "/{id}")
    @Override
    public DtoProduct findProductById(@PathVariable(name = "id")Long id){
        
        return productService.findProductById(id);
    }

    @PostMapping(path = "/add")
    @Override
    public ResponseEntity<DtoProduct> addProduct(@RequestBody DtoProduct dtoProduct){

        DtoProduct savedProduct = productService.addProduct(dtoProduct);
        if (savedProduct == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(savedProduct);
    }

    @Override
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable(name="id") Long id) {
        try {
            productService.deleteProductById(id);
            return ResponseEntity.ok("Ürün başarıyla silindi.");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body("Ürün bulunamadı.");
        }
    }

    @Override
    @PutMapping("/update/{id}")
    public ResponseEntity<DtoProduct> updateProduct(@PathVariable Long id, @RequestBody DtoProduct dtoProduct) {
        DtoProduct updatedProduct = productService.updateProduct(id, dtoProduct);
        if (updatedProduct == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedProduct);
    }

    @GetMapping("/all")
    @Override
    public ResponseEntity<List<DtoProduct>> getAllProducts() {
        List<DtoProduct> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
}
