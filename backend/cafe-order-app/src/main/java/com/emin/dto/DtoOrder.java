package com.emin.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DtoOrder {
    private Long id;

    private String state;

    private Date date;

    private Long user_id;

    private List<DtoProduct> products = new ArrayList<>();
}
