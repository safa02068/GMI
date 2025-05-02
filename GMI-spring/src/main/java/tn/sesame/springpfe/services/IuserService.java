package tn.sesame.springpfe.services;

import tn.sesame.springpfe.entities.User;

import java.util.List;

public interface IuserService {
    void  add(User user);
    void  deleteUser(Long idUser);

    List<User> GetUser();


}
