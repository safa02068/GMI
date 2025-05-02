package tn.sesame.springpfe.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tn.sesame.springpfe.entities.User;

import java.util.List;
@Repository
public interface IuserRepository extends JpaRepository<User, Long> {
	
    User findByEmail(String email);
    List<User> findByArchiverIsFalse();

}
