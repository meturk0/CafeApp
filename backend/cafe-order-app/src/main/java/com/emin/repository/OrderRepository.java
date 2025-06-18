package com.emin.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.emin.entities.Order;

public interface OrderRepository extends JpaRepository <Order,Long> {
    
}
