package com.emin.entities;

import java.util.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Orders")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    @Size(max = 30, message = "Durum en fazla 30 karakter olabilir.")
    private String state;

    @Column
    private Date date;

    @ManyToOne
    @JoinColumn(name = "user_id") // Order tablosunda user_id foreign key olur
    private User user;

    @ManyToMany
    @JoinTable(name="orders_products",
    joinColumns =  @JoinColumn(name="order_id"), 
    inverseJoinColumns=@JoinColumn(name="product_id") )
    private List<Product> products;
}
