package com.emin.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.emin.entities.Product;

public interface ProductRepository extends JpaRepository<Product,Long>{
    
}
