package com.emin.services;

import com.emin.dto.DtoUser;

public interface IUserService {
    
    public DtoUser findUserById(Long id);

    public DtoUser addUser(DtoUser dtoUser);

    public void deleteUserById(Long id);

    public DtoUser updateUser(Long id, DtoUser dtoUser);

}
