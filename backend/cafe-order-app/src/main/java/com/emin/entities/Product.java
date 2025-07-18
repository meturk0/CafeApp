package com.emin.entities;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Products")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column
    private float price;

    @Column
    private String description;

    @Column
    private String imageLink;

    @Column
    private String category;

    @Column(nullable = false)
    private boolean activity = true;

    @ManyToMany(mappedBy = "products")
    private List<Order> orders;

    @ManyToMany(mappedBy = "products")
    private List<Campaign> campaigns;

}
