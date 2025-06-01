package tn.sesame.springpfe.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import tn.sesame.springpfe.entities.Materiel;

import java.util.List;

public interface IMaterielRepository extends JpaRepository<Materiel, Long> {
    List<Materiel> findByArchiverIsFalse();
   

    List<Materiel> findByIsManquantTrue();
    List<Materiel> findByEnMaintenanceTrue();

    List<Materiel> findByIsDamagedTrue();
    List<Materiel> findByModel(String model);

//    List<Object> prixmatriel();


//    @Query(nativeQuery=true,value="select modele, COUNT(maintenance) from materiel where YEAR(dateachat)=:date GROUP BY modele")
//    List<Object> matrielmaintenace (Long date);
//
//    @Query(nativeQuery=true,value="select modele, SUM(prix) from materiel GROUP BY modele")
//    List<Object> prixmatriel ();









}
