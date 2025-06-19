package com.emin.controller;


import java.util.List;

import org.springframework.http.ResponseEntity;

import com.emin.dto.DtoProduct;

public interface IProductController {
    
    public DtoProduct findProductById(Long id);

    public ResponseEntity<DtoProduct> addProduct( DtoProduct dtoProduct);

    public ResponseEntity<?> deleteProduct(Long id);

    public ResponseEntity<DtoProduct> updateProduct(Long id, DtoProduct dtoProduct);

    public ResponseEntity<List<DtoProduct>> getAllProducts();
}
