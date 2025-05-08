package tn.sesame.springpfe.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.sesame.springpfe.entities.Projet;
import tn.sesame.springpfe.entities.User;

import java.util.List;

public interface IProjetRepository extends JpaRepository<Projet, Long> {

    List<Projet> findByArchiverIsFalse();
   
}
