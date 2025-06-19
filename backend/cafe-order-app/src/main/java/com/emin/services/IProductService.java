package com.emin.services;

import java.util.List;

import com.emin.dto.DtoProduct;

public interface IProductService {
    
    public DtoProduct findProductById(Long id);

    public DtoProduct addProduct(DtoProduct dtoProduct);

    public void deleteProductById(Long id);

    public DtoProduct updateProduct(Long id, DtoProduct dtoProduct);

    public List<DtoProduct> getAllProducts();
}
