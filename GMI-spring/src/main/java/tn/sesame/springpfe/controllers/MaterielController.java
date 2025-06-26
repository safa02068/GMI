package tn.sesame.springpfe.controllers;

import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tn.sesame.springpfe.entities.Materiel;
import tn.sesame.springpfe.entities.MaterielManquant;
import tn.sesame.springpfe.entities.Projet;
import tn.sesame.springpfe.entities.User;
import tn.sesame.springpfe.repositories.IMaterielManqRepository;
import tn.sesame.springpfe.repositories.IMaterielRepository;
import tn.sesame.springpfe.repositories.IProjetRepository;
import tn.sesame.springpfe.repositories.IuserRepository;

import java.util.List;


@RestController
@RequestMapping("/materiel")
@CrossOrigin("*")
public class MaterielController {

    @Autowired
    private IMaterielRepository matR;

    @Autowired
    private IProjetRepository projetRepository;

    @Autowired
    private IuserRepository userRepository;

    
    private MaterielManquant matM;

    @Autowired 
    private IMaterielManqRepository matMR;  
    
    
    @Transactional
    @PostMapping("/addmateriel")
    public Materiel ajout(@RequestBody Materiel materiel) {
        String nomLower = materiel.getNom().toLowerCase();
        boolean exists = matR.findByNom(nomLower).stream().anyMatch(m -> m.getNom().toLowerCase().equals(nomLower));
        if (exists) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Un materiel avec ce nom existe déja");
        }
        materiel.setArchiver(false);
        materiel.setNom(materiel.getNom());
        return this.matR.save(materiel);
    }
    
    

    @Transactional
    @PutMapping("/updatemateriel/{id}")
    public Materiel updateMateriel(@PathVariable long id, @RequestBody Materiel materiel) {
    	Materiel mat = matR.findById(id).orElse(null);
        mat.setModel(materiel.getModel());
        mat.setNom(materiel.getNom());
        mat.setPrix(materiel.getPrix());
        mat.setEnMaintenance(materiel.isEnMaintenance());
        mat.setDate_ajout(materiel.getDate_ajout());
        mat.setDamaged(materiel.isDamaged());
        mat.setStock(materiel.getStock());
        
        mat.setDate_suppression(materiel.getDate_suppression());
        return matR.save(mat);
    }

    
    @GetMapping("/affichierlistmateriel")
    public List<Materiel> affichierlist() {
        return this.matR.findByArchiverIsFalse();
    }
    
    

    @GetMapping("/affichermaterielparid/{id}")
    @PreAuthorize("hasAuthority('CHEF_PROJET')")
    public Materiel afficherrecherche(@PathVariable long id) {
        return matR.findById(id).orElse(null);
    }
    
    
    
   // @PreAuthorize("hasAuthority('CHEF_PROJET')")
   @PostMapping("archiver")
    public String archiverMateriel(Long id) {
	   
    	
        Materiel arch = matR.findById(id).orElse(null);
      
        arch.setArchiver(true);
        this.matR.save(arch);
        return "true";
    }
    
    //add materiel manquant 
    @PreAuthorize("hasAuthority('TECHNICIEN')")
    @PostMapping("/addmaterielmanquant")
    public MaterielManquant addmaterielmanquant(@RequestBody MaterielManquant materielmanquant) {
        String nomLower = materielmanquant.getNom().toLowerCase();
        MaterielManquant existing = matMR.findByNom(nomLower);
        if (existing != null && existing.getNom().toLowerCase().equals(nomLower)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "MaterielManquant with this name already exists");
        }
        return this.matMR.save(materielmanquant);
    }
    
    
    //afficher materiel manquant 
    @PreAuthorize("hasAuthority('TECHNICIEN')")
    @GetMapping("/affichermatirlmanquant")
    public List<MaterielManquant>affichermatirlmanquant(){
    	return this.matMR.findAll();
    }
    
    
//    @PreAuthorize("hasAuthority('CHEF_PROJET')")
//    @GetMapping("/afficher-liste-manquant")
//    public List<Materiel> afficherMaterielManquant() {
//        return this.matR.findByIsManquantTrue();
//    }

    
    // delete materielmanquant
    
    @PreAuthorize("hasAuthority('TECHNICIEN')")
    @DeleteMapping("/supprimermatmanquant")
    public String supprimer(Long id) {
    	MaterielManquant mat = this.matMR.findById(id).get();
    	this.matMR.delete(mat);
    	return "true" ; 
    }
    
    
    
    @Autowired
    IMaterielManqRepository imamanqurepos ; 
    
    @GetMapping("allmatrielmanquant")
    public List<MaterielManquant>allmat(){
    	return this.imamanqurepos.findAll() ; 
    }
    
    @PostMapping("ajoutmatmanquant")
    public String ajout(@RequestBody MaterielManquant matman ) {
        String nomLower = matman.getNom().toLowerCase();
        MaterielManquant existing = imamanqurepos.findByNom(nomLower);
        if (existing != null && existing.getNom().toLowerCase().equals(nomLower)) {
            return "duplicate";
        }
        this.imamanqurepos.save(matman); 
        return "true" ; 
    }
    
    
//    @PreAuthorize("hasAuthority('CHEF_PROJET')")
//    @DeleteMapping("/supprimerManquant/{id}")
//    public String supprimerMaterielManquant(@PathVariable long id) {
//        Materiel materiel = matR.findById(id).orElse(null);
//        if (materiel == null) {
//            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Materiel non trouvé");
//        }
//        if (materiel.isManquant()) {
//            this.matR.delete(materiel);
//            return "Matériel manquant supprimé avec succès !";
//        }
//        else {
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ce matériel n'est pas marqué comme manquant");
//        }
//    }
    
    
    @PreAuthorize("hasAuthority('TECHNICIEN')")
    @PostMapping("etat_enmaintenance")
    public String status(Long id) {
        Materiel m = this.matR.findById(id).get();
        m.setEnMaintenance(true);
        m.setDamaged(false);
        this.matR.save(m);
        return "true";
    }
    
    @PreAuthorize("hasAuthority('TECHNICIEN')")
    @PostMapping("etat_endommage")
    public String status2(Long id) {
        Materiel m = this.matR.findById(id).get();
        m.setEnMaintenance(false);
        m.setDamaged(true);
        this.matR.save(m);
        return "true";
    }



//    @PreAuthorize("hasAuthority('CHEF_PROJET')")
//    @GetMapping("/afficher-liste-endommagé")
//    public List<Materiel> afficherMaterielEndommagé() {
//        return this.matR.findByIsDamagedTrue();
//    }
//
//    @PreAuthorize("hasAuthority('CHEF_PROJET')")
//    @GetMapping("/afficher-liste-enmaintenance")
//    public List<Materiel> afficherMaterielMaintenance() {
//        return this.matR.findByEnMaintenanceTrue();
//    }

    @PutMapping("updatematrielmanquant")

    public String update(Long id , @RequestBody MaterielManquant mat) {
        System.out.println(id+"/////");
        System.out.println(mat.getModele()+"*****");
        MaterielManquant m = this.matMR.findById(id).get();
        m.setModele(mat.getModele());
        m.setStock(mat.getStock());
        m.setNom(mat.getNom());
        this.imamanqurepos.save(m);
        return "true" ;
    }

    @DeleteMapping("deletematrielmanquant")

    public String delete(Long id)  {
        MaterielManquant m = this.matMR.findById(id).get();
        this.imamanqurepos.delete(m);
        return "true" ;
    }

    @GetMapping("afficherbyprojet")
    public List<Materiel> allbyprojet(Long idP){
        System.out.println(idP);
        Projet p = this.projetRepository.findById(idP).get() ;
        return this.matR.findByProjet(p); 
    }


    @PostMapping("desafecter")
    public String desafeceter(Long id) {
        Materiel m = this.matR.findById(id).get() ;
        m.setProjet(null);
        this.matR.save(m);
        return "true" ;
    }



    //@PreAuthorize("hasAuthority('CHEF_PROJET')")
    @DeleteMapping("/deletemateriel/{id}")
    public String deleteMateriel(@PathVariable long id) {
        try {
            Materiel materiel = matR.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Matériel non trouvé"));
            
            // Vérifier si le matériel est associé à des interventions
            if (!materiel.getInterventions().isEmpty()) {
                return "Impossible de supprimer le matériel car il est associé à des interventions";
            }
            
            matR.delete(materiel);
            return "Matériel supprimé avec succès";
        } catch (ResponseStatusException e) {
        	return "false" ;
        	} catch (Exception e) {
            return "Erreur lors de la suppression du matériel";
        }
    }

}
