package com.emin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.emin.dto.DtoOrder;

public interface IOrderController {
   
    public DtoOrder getOrderById(Long id);

    public ResponseEntity<DtoOrder> addOrder( DtoOrder dtoOrder);

    public ResponseEntity<?> deleteOrder(Long id);

    public ResponseEntity<List<DtoOrder>> getAllOrders();
}
