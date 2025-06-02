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

    @PreAuthorize("hasAuthority('EMPLOYE')")
    @PostMapping("/addintervention")
    public ResponseEntity<Intervention> addinter(@RequestBody Intervention newIntervention, String email, Long id ) {
    try {
    User user = userR.findByEmail(newIntervention.getEmail());
    Materiel materiel = matR.findById(id).get();
    newIntervention.setMateriel(materiel);
    newIntervention.setDemandeur(user);
    newIntervention.setDatedecreation(new Date(System.currentTimeMillis()));;
    newIntervention.setEtat("En Attente");
    Intervention savedIntervention = intR.save(newIntervention);
    Commentaire c = new Commentaire();	
    c.setCommentaire(newIntervention.getCommentaire());
    c.setIntervention(newIntervention);
    c.setDate((new Date(System.currentTimeMillis())));

    commentaireR.save(c);

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
            I.setEtat(etat);
            I.setDatederesolution(new Date(System.currentTimeMillis()));
            intR.saveAndFlush(I);
            return "true";
//
        }
        I.setEtat(etat);
        intR.saveAndFlush(I);
        return "true";
    }


    @PreAuthorize("hasAuthority('EMPLOYE')")
    @PostMapping("addcommentaire")
    public String commentaire(Long id , String c) {
        Intervention I = intR.findById(id).get();
        Commentaire com = new Commentaire();
        com.setCommentaire(c);
        com.setIntervention(I);
        com.setDate((new Date(System.currentTimeMillis())));
        commentaireR.save(com);
        return "true";
    }

    
    @GetMapping("affichercommentaire")
    public List<Commentaire> listcomm(Long id){
        Intervention I= intR.findById(id).get();
        return commentaireR.findByIntervention(I);
    }

    @PreAuthorize("hasAuthority('EMPLOYE')")
    @PutMapping("/updateintervention")
    public String updateinter(@RequestBody Intervention interv) {
        Intervention existinginter = (Intervention) intR.findById(interv.getId()).get();
        if (existinginter == null) {
            return "intervention non trouvé";
        } else {
            existinginter.setTitre(interv.getTitre());
            existinginter.setDescription(interv.getDescription());
            existinginter.setDemandeur(interv.getDemandeur());
            existinginter.setDatedecreation(new Date(System.currentTimeMillis()));
            existinginter.setDatederesolution(interv.getDatederesolution());
            
            existinginter.setEtat(interv.getEtat());

            intR.save(existinginter);
            return "intervention a modifier avec succès";
        }
    }


    @GetMapping("listintervbyuser")
    public List<Intervention>list(String email){
    User u = userR.findByEmail(email);
    System.out.println(u.getEmail());
    return intR.findByEmail(email);
    }


    //afficher les détails de chaque intervention
    @GetMapping("/interventiondetail/{id}")
    public Intervention Detailsintervention(@PathVariable Long id) {
        Intervention inter = (Intervention) intR.findById(id).get();
        return inter;
    }



    @GetMapping("/allintervention")
    public List<Intervention> all() {
        return intR.findAll();
    }



    @GetMapping("/findinterventionparid/{id}")
    public Optional<Intervention> getInterventionById(@PathVariable Long id) {
        return intR.findById(id);
    }

    @PreAuthorize("hasAuthority('TECHNICIEN')")
    @PutMapping("archiverintervention/{id}")
    public String archiverIntervention(@PathVariable Long id) {
        Intervention arch = intR.findById(id).get();
        arch.setArchiver(true);
        intR.save(arch);
        return "Intervention  archivé !";
    }
}
