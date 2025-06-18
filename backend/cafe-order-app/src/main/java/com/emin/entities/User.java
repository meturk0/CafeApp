package com.emin.entities;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Users")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    @Size(max = 50, message = "İsim en fazla 50 karakter olabilir.")
    private String name;

    @Size(max = 30, message = "Soyisim en fazla 30 karakter olabilir.")
    @Column
    private String surname;

    @Size(max = 100, message = "Email en fazla 100 karakter olabilir.")
    @Column(unique = true)
    private String email;

    @Size(max = 30, message = "Parola en fazla 30 karakter olabilir.")
    @Column
    private String password;

    @Size(max = 30, message = "Rol en fazla 30 karakter olabilir.")
    @Column
    private String role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders;
}
