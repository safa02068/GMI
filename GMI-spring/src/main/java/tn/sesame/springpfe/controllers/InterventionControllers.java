package tn.sesame.springpfe.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.sesame.springpfe.entities.Commentaire;
import tn.sesame.springpfe.entities.Intervention;
import tn.sesame.springpfe.entities.Materiel;
import tn.sesame.springpfe.entities.User;
import tn.sesame.springpfe.repositories.IMaterielRepository;
import tn.sesame.springpfe.repositories.IcommentaireRepository;
import tn.sesame.springpfe.repositories.IinterventionRepository;
import tn.sesame.springpfe.repositories.IuserRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/interventions")
@CrossOrigin("*")
public class InterventionControllers {
	
	@Autowired
    private IinterventionRepository intR;
	
	@Autowired
    private IuserRepository userR;
    
	@Autowired
	private IcommentaireRepository commentaireR;
    
	@Autowired
	private IMaterielRepository matR;
    
	private Intervention inter;
    
    private User user;
@Autowired
IMaterielRepository imrepos ; 
@Autowired
IuserRepository userrepos ;
    
  //  @PreAuthorize("hasAuthority('EMPLOYE')")
    @PostMapping("/addintervention")
    public ResponseEntity<Intervention> addinter(@RequestBody Intervention newIntervention , Long idmat, String email) {
    try {
    	Materiel m = this.imrepos.findById(idmat).get(); 
    	User u = this.userR.findByEmail(email);
    newIntervention.setDatedecreation(new Date(System.currentTimeMillis()));;
    newIntervention.setStatut("En Attente");
    newIntervention.setMateriel(m);
    newIntervention.setDemandeur(u);
    newIntervention.setArchiver(false);
    Intervention savedIntervention = intR.save(newIntervention);;
    return ResponseEntity.ok(savedIntervention);
    } catch (Exception e) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
    }

    @PreAuthorize("hasAuthority('TECHNICIEN')")
    @PostMapping("etat")
    public String etat(Long id,String etat){
        Intervention I = intR.findById(id).get();

        if(etat.equals("Resolue")) {
            I.setStatut(etat);
            I.setDatederesolution(new Date(System.currentTimeMillis()));
            intR.saveAndFlush(I);
            return "true";
//
        }
        I.setStatut(etat);
        intR.saveAndFlush(I);
        return "true";
    }


    @PreAuthorize("hasAuthority('EMPLOYE')")
    @PostMapping("addcommentaire")
    public String commentaire(Long id , @RequestBody Commentaire c) {
        Intervention I = intR.findById(id).get();
        c.setDate((new Date(System.currentTimeMillis())));
    //    I.setCommentaire(c);
         intR.save(I);
        return "true";
    }

    /*
    @GetMapping("affichercommentaire")
    public Commentaire listcomm(Long id){
        Intervention I= intR.findById(id).orElse(null);
        return I.getCommentaire();
    }
*/
//    @PreAuthorize("hasAuthority('EMPLOYE')")
    @PutMapping("/updateintervention")
    public Intervention updateinter(@RequestBody Intervention interv) {
        Intervention existinginter = (Intervention) intR.findById(interv.getId()).get();
        if (existinginter == null) {
            return null;
        } else {
            existinginter.setTitre(interv.getTitre());
            existinginter.setDescription(interv.getDescription());
            existinginter.setDemandeur(interv.getDemandeur());
            existinginter.setCommentaire(interv.getCommentaire());
            existinginter.setDatedecreation(new Date(System.currentTimeMillis()));
            existinginter.setDatederesolution(interv.getDatederesolution());
            existinginter.setType(interv.getType());
            //existinginter.setEtat(interv.getEtat());

            intR.save(existinginter);
            return existinginter;
        }
    }



    //afficher les détails de chaque intervention
    @GetMapping("/interventiondetail/{id}")
    public Intervention Detailsintervention(@PathVariable Long id) {
        Intervention inter = (Intervention) intR.findById(id).get();
        return inter;
    }



    @GetMapping("/allintervention")
    public List<Intervention> all() {
        return intR.findByArchiverIsFalse();
    }



    @GetMapping("/findinterventionparid/{id}")
    public Optional<Intervention> getInterventionById(@PathVariable Long id) {
        return intR.findById(id);
    }

    // version Safe
    // @PreAuthorize("hasAuthority('TECHNICIEN')")
    // @PutMapping("archiverintervention/{id}")
    // public String archiverIntervention(@PathVariable Long id) {

    //@PreAuthorize("hasAuthority('TECHNICIEN')")
    @DeleteMapping("/archiverintervention/{id}")
    public Intervention archiverIntervention(@PathVariable Long id) {
        Intervention arch = intR.findById(id).get();
        arch.setArchiver(true);
        intR.save(arch);
        return arch;
    }
}
