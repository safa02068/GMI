package tn.sesame.springpfe.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import tn.sesame.springpfe.entities.Intervention;
import tn.sesame.springpfe.entities.User;

import java.util.List;

public interface IinterventionRepository extends JpaRepository<Intervention, Long> {
    List<Intervention> findByEmail(String email);
//    List<Intervention> findInterventionByEmail(String email);
   // @Query(nativeQuery=true,value="SELECT count(*) FROM ticket where etat=\"Resolue\" and YEAR(datedecreation)=:date")
   // int nbrtickeresolue (Long date);
}
