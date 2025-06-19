package com.emin.controller.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.emin.controller.IUserController;
import com.emin.dto.DtoUser;
import com.emin.services.IUserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/rest/api/user")
public class UserControllerImpl implements IUserController{

    @Autowired
    private IUserService userService;

    @GetMapping(path = "/{id}")
    @Override
    public DtoUser findUserById(@PathVariable(name = "id")Long id){
        
        return userService.findUserById(id);
    }

    @PostMapping(path="/add")
    @Override
    public ResponseEntity<DtoUser> addUser(@Valid @RequestBody DtoUser dtoUser) {
        DtoUser savedUser = userService.addUser(dtoUser);
        if (savedUser == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(savedUser);
    }
    
    
    @DeleteMapping("/delete/{id}")
    @Override
    public ResponseEntity<?> deleteUser(@PathVariable(name="id") Long id) {
        try {
            userService.deleteUserById(id);
            return ResponseEntity.ok("Kullanıcı başarıyla silindi.");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body("Kullanıcı bulunamadı.");
        }
    }

    
    @PutMapping("/update/{id}")
    @Override
    public ResponseEntity<DtoUser> updateUser(@PathVariable Long id, @RequestBody DtoUser dtoUser) {
        DtoUser updatedUser = userService.updateUser(id, dtoUser);
        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/all")
    @Override
    public ResponseEntity<List<DtoUser>> getAllUsers() {
        List<DtoUser> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

}
