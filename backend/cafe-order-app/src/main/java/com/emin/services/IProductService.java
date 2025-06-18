package com.emin.services;

import com.emin.dto.DtoProduct;

public interface IProductService {
    
    public DtoProduct findProductById(Long id);

    public DtoProduct addProduct(DtoProduct dtoProduct);

    public void deleteProductById(Long id);

    public DtoProduct updateProduct(Long id, DtoProduct dtoProduct);
}
