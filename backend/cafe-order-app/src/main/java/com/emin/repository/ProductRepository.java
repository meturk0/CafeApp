package com.emin.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.emin.entities.Product;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByActivityTrue();
}
