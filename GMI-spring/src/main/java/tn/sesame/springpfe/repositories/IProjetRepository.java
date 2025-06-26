package tn.sesame.springpfe.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.sesame.springpfe.entities.Projet;
import tn.sesame.springpfe.entities.User;

import java.util.List;

@Repository
public interface IProjetRepository extends JpaRepository<Projet, Long> {

    List<Projet> findByArchiverIsFalse();

    Projet findByNom(String nom);
}
