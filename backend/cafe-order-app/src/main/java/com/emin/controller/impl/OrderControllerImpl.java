package com.emin.controller.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.emin.controller.IOrderController;
import com.emin.dto.DtoOrder;
import com.emin.services.IOrderService;

@RestController
@RequestMapping("/rest/api/order")
public class OrderControllerImpl implements IOrderController {

    @Autowired
    private IOrderService orderService;

    @GetMapping(path ="/{id}")
    @Override
    public DtoOrder getOrderById(@PathVariable(name="id") Long id){

        return orderService.getOrderById(id);
    }

    @PostMapping(path="/add")
    @Override
    public ResponseEntity<DtoOrder> addOrder(@RequestBody DtoOrder dtoOrder){

        DtoOrder savedOrder = orderService.addOrder(dtoOrder);
        if (savedOrder == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(savedOrder);
    }

    @Override
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable(name="id") Long id) {
        try {
            orderService.deleteOrderById(id);
            return ResponseEntity.ok("Sipariş başarıyla silindi.");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body("Sipariş bulunamadı.");
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<DtoOrder>> getAllOrders() {
        List<DtoOrder> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
}
