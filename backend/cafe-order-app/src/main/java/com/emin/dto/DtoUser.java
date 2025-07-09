package com.emin.dto;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DtoUser {
    private Long id;

    private String name;

    private String surname;

    private String email;

    private String phone_number;

    private String password;

    @Size(max = 30, message = "Rol en fazla 30 karakter olabilir.")
    private String role;

    private List<DtoOrder> orders = new ArrayList<>();
}
