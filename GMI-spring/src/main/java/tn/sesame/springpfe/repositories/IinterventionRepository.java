package tn.sesame.springpfe.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import tn.sesame.springpfe.entities.Intervention;
import tn.sesame.springpfe.entities.User;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Repository
public interface IinterventionRepository extends JpaRepository<Intervention, Long> {

	List<Intervention> findByArchiverIsFalse();
//    List<Intervention> findInterventionByEmail(String email);
   // @Query(nativeQuery=true,value="SELECT count(*) FROM ticket where etat=\"Resolue\" and YEAR(datedecreation)=:date")
   // int nbrtickeresolue (Long date);
	}
