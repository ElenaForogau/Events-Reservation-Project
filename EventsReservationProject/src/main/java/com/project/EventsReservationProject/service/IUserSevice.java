package com.project.EventsReservationProject.service;

import com.project.EventsReservationProject.model.User;

import java.util.List;

public interface IUserSevice {
    User registerUser(User user);
    User findByVerificationToken(String token);
    List<User> getUsers();
    void deleteUser(String email);
    User getUser(String email);
    User saveUser(User user);

}
