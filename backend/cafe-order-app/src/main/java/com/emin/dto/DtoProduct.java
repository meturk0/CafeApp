package com.emin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DtoProduct {

    private Long id;

    private String name;

    private float price;

    private String description;

    private String imageLink;

    private String category;

    private boolean activity;
}
