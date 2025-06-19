package com.emin.services;


import java.util.List;

import com.emin.dto.DtoOrder;

public interface IOrderService {
   
    public DtoOrder getOrderById(Long id);

    public DtoOrder addOrder (DtoOrder dtoOrder);

    public void deleteOrderById(Long id);

    public List<DtoOrder> getAllOrders();
}
