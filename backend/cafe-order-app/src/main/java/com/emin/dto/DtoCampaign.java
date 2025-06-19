package com.emin.dto;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class DtoCampaign {
    
    private Long id;

    private String name;

    private Date start_date;

    private Date end_date;

    private String description;

    private float price;

    private List<DtoProduct> products = new ArrayList<>();
}
