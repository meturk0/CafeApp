package com.emin.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.emin.dto.DtoOrder;
import com.emin.dto.DtoUser;
import com.emin.entities.Order;
import com.emin.entities.User;
import com.emin.repository.OrderRepository;
import com.emin.repository.UserRepository;
import com.emin.services.IUserService;

@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public DtoUser findUserById(Long id) {
        DtoUser dtoUser = new DtoUser();
        Optional<User> optional = userRepository.findById(id);
        if (optional.isEmpty()) {
            return null;
        }
        User user = optional.get();

        List<Order> dbOrders = optional.get().getOrders();

        BeanUtils.copyProperties(user, dtoUser);
        if (dbOrders != null && !dbOrders.isEmpty()) {
            for (Order order : dbOrders) {
                DtoOrder dtoOrder = new DtoOrder();
                BeanUtils.copyProperties(order, dtoOrder);
                dtoUser.getOrders().add(dtoOrder);
            }
        }

        return dtoUser;
    }

    @Override
    public DtoUser addUser(DtoUser dtoUser) {
        if (dtoUser == null) {
            return null;
        }

        User user = new User();
        BeanUtils.copyProperties(dtoUser, user);
        // Şifreyi hash'le
        user.setPassword(passwordEncoder.encode(dtoUser.getPassword()));

        User savedUser = userRepository.save(user);

        DtoUser savedDto = new DtoUser();
        BeanUtils.copyProperties(savedUser, savedDto);
        return savedDto;
    }

    @Override
    public void deleteUserById(Long id) {
        Optional<User> optional = userRepository.findById(id);
        if (optional.isEmpty()) {
            throw new RuntimeException("Kullanıcı bulunamadı");
        }
        User user = optional.get();
        // Eğer kullanıcı bir order'da varsa silme, activity=false yap
        if (orderRepository.existsByUser_Id(id)) {
            user.setActivity(false);
            userRepository.save(user);
        } else {
            userRepository.deleteById(id);
        }
    }

    @Override
    public DtoUser updateUser(Long id, DtoUser dtoUser) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return null; // veya exception fırlat
        }

        User existingUser = optionalUser.get();

        // Güncellenecek alanları dto'dan al ve mevcut kullanıcıya aktar
        existingUser.setName(dtoUser.getName());
        existingUser.setSurname(dtoUser.getSurname());
        existingUser.setEmail(dtoUser.getEmail());
        existingUser.setPhone_number(dtoUser.getPhone_number());
        // Şifre güncelleniyorsa hash'le
        if (dtoUser.getPassword() != null && !dtoUser.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(dtoUser.getPassword()));
        }
        existingUser.setRole(dtoUser.getRole());

        User updatedUser = userRepository.save(existingUser);

        DtoUser updatedDto = new DtoUser();
        BeanUtils.copyProperties(updatedUser, updatedDto);

        return updatedDto;
    }

    @Override
    public List<DtoUser> getAllUsers() {
        List<User> users = userRepository.findByActivityTrue();
        List<DtoUser> dtoUsers = new ArrayList<>();
        for (User user : users) {
            DtoUser dtoUser = new DtoUser();
            BeanUtils.copyProperties(user, dtoUser);
            dtoUsers.add(dtoUser);
        }
        return dtoUsers;
    }

    @Override
    public DtoUser findUserByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return null;
        }
        DtoUser dtoUser = new DtoUser();
        BeanUtils.copyProperties(user, dtoUser);
        return dtoUser;
    }
}
