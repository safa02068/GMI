package tn.sesame.springpfe.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.sesame.springpfe.entities.Materiel;

import java.util.List;

public interface IMaterielRepository extends JpaRepository<Materiel, Long> {
    List<Materiel> findByArchiverIsFalse();
    
//    List<Materiel> findByIsManquantTrue();
//    List<Materiel> findByEnMaintenanceTrue();
//
//    List<Materiel> findByIsDamagedTrue();
    List<Materiel> findByModel(String model);

    List<Materiel> findByProjetId(Long projetId);
    
    @Query("SELECT m FROM Materiel m WHERE m.projet.id IN (SELECT p.id FROM Projet p JOIN p.users u WHERE u.id = :userId) AND m.allProjectUsersAccess = true")
    List<Materiel> findByProjetUsersIdAndAllProjectUsersAccessTrue(@Param("userId") Long userId);
    
    @Query("SELECT m FROM Materiel m WHERE m.projet.id IN (SELECT p.id FROM Projet p JOIN p.users u WHERE u.id = :userId) AND :userId IN (SELECT u.id FROM m.Utilisateurs u)")
    List<Materiel> findByProjetUsersIdAndUtilisateurs_Id(@Param("userId") Long userId);











}
