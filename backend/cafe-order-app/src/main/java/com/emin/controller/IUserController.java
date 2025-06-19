package com.emin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.emin.dto.DtoUser;

public interface IUserController {
   
   public DtoUser findUserById (Long id);

   public ResponseEntity<DtoUser> addUser( DtoUser dtoUser);

   public ResponseEntity<?> deleteUser(Long id);

   public ResponseEntity<DtoUser> updateUser(Long id, DtoUser dtoUser);

   public ResponseEntity<List<DtoUser>> getAllUsers();

}
