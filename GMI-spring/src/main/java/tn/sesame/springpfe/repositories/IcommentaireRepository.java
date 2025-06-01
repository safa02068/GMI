package tn.sesame.springpfe.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.sesame.springpfe.entities.Commentaire;
import tn.sesame.springpfe.entities.Intervention;

import java.util.List;

public interface IcommentaireRepository extends JpaRepository<Commentaire, Long> {

}