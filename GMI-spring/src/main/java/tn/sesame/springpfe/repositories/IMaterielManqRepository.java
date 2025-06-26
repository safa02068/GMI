package tn.sesame.springpfe.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.sesame.springpfe.entities.Intervention;
import tn.sesame.springpfe.entities.MaterielManquant;

public interface IMaterielManqRepository  extends JpaRepository<MaterielManquant, Long>  {

    MaterielManquant findByNom(String nom);

}
