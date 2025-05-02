package tn.sesame.springpfe.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.sesame.springpfe.entities.User;
import tn.sesame.springpfe.repositories.IuserRepository;

import java.util.List;

@Service
public class UserService implements  IuserService{
    @Autowired
    private IuserRepository userRepository;


    @Override
    public void add(User user) {
        userRepository.save(user);
    }

    @Override
    public void deleteUser(Long idUser) {
        User user1 = userRepository.findById(idUser).orElse(null);
        userRepository.delete(user1);
    }

    @Override
    public List<User> GetUser() {
        List<User> user= (List<User>) userRepository.findByArchiverIsFalse();
        return  user;
    }
}