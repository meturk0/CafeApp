package com.emin.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.emin.dto.DtoOrder;
import com.emin.dto.DtoProduct;
import com.emin.entities.Order;
import com.emin.entities.Product;
import com.emin.entities.User;
import com.emin.repository.OrderRepository;
import com.emin.repository.ProductRepository;
import com.emin.repository.UserRepository;
import com.emin.services.IOrderService;

import jakarta.transaction.Transactional;

@Service
public class OrderServiceImpl implements IOrderService{

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public DtoOrder getOrderById(Long id){

        DtoOrder dtoOrder = new DtoOrder();
        Optional<Order> optional = orderRepository.findById(id);
        if(optional.isEmpty()){
            return null;
        }
        Order dbOrder = optional.get();
        BeanUtils.copyProperties(dbOrder, dtoOrder);

        if(dbOrder.getProducts() != null && !dbOrder.getProducts().isEmpty()){
            for (Product product : dbOrder.getProducts()) {
                DtoProduct dtoProduct = new DtoProduct();
                BeanUtils.copyProperties(product, dtoProduct);

                dtoOrder.getProducts().add(dtoProduct);
                
            }
        }

        return dtoOrder;
    }

    
    @Transactional
    @Override
    public DtoOrder addOrder(DtoOrder dtoOrder) {
        if (dtoOrder == null) return null;

        Order order = new Order();
        BeanUtils.copyProperties(dtoOrder, order);

        // 👇 USER ID'yi kontrol edip Order'a set ediyoruz
        if (dtoOrder.getUser_id() != null) {
            Optional<User> userOpt = userRepository.findById(dtoOrder.getUser_id());
            if (userOpt.isPresent()) {
                order.setUser(userOpt.get());
            } else {
                throw new RuntimeException("User not found with id: " + dtoOrder.getUser_id());
            }
        }

        // 👇 Product listesi set ediliyor
        if (dtoOrder.getProducts() != null) {
            List<Product> productList = new ArrayList<>();
            for (DtoProduct dtoProduct : dtoOrder.getProducts()) {
                if (dtoProduct.getId() != null) {
                    Optional<Product> productOpt = productRepository.findById(dtoProduct.getId());
                    productOpt.ifPresent(productList::add);
                }
            }
            order.setProducts(productList);
        }

        // 👇 Kaydetme
        Order savedOrder = orderRepository.save(order);

        // 👇 Geri dönüş DTO hazırlanıyor
        DtoOrder savedDto = new DtoOrder();
        BeanUtils.copyProperties(savedOrder, savedDto);

        // 👇 Product'lar DTO'ya ekleniyor
        if (savedOrder.getProducts() != null) {
            for (Product p : savedOrder.getProducts()) {
                DtoProduct dtoProduct = new DtoProduct();
                BeanUtils.copyProperties(p, dtoProduct);
                savedDto.getProducts().add(dtoProduct);
            }
        }

        // 👇 User ID'yi eklemeyi unutma
        if (savedOrder.getUser() != null) {
            savedDto.setUser_id(savedOrder.getUser().getId());
        }

        return savedDto;
    }


    @Override
    public void deleteOrderById(Long id) {
        Optional<Order> optional = orderRepository.findById(id);
        if (optional.isEmpty()) {
            throw new RuntimeException("Sipariş bulunamadı");
        }
        orderRepository.deleteById(id);
    }

    @Override
    public List<DtoOrder> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        List<DtoOrder> dtoOrders = new ArrayList<>();
        for (Order order : orders) {
            DtoOrder dtoOrder = new DtoOrder();
            BeanUtils.copyProperties(order, dtoOrder);
            // Ürünleri ekle
            if (order.getProducts() != null && !order.getProducts().isEmpty()) {
                for (Product product : order.getProducts()) {
                    DtoProduct dtoProduct = new DtoProduct();
                    BeanUtils.copyProperties(product, dtoProduct);
                    dtoOrder.getProducts().add(dtoProduct);
                }
            }
            // Kullanıcıyı ekle
            if (order.getUser() != null) {
                dtoOrder.setUser_id(order.getUser().getId());
            }
            dtoOrders.add(dtoOrder);
        }
        return dtoOrders;
    }
}
