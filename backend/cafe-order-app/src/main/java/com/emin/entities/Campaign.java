package com.emin.entities;

import java.sql.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Campaigns")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column(nullable = true)
    private Date start_date;

    @Column(nullable = true)
    private Date end_date;

    @Column(nullable = true)
    private String description;

    @Column
    private float price;

    @ManyToMany
    @JoinTable(
        name = "campaigns_products",
        joinColumns = @JoinColumn(name = "campaign_id"),
        inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<Product> products;
}
