package tn.sesame.springpfe.controllers;

import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tn.sesame.springpfe.entities.Materiel;
import tn.sesame.springpfe.repositories.IMaterielRepository;

import java.util.List;


@RestController
@RequestMapping("/materiel")
@CrossOrigin("*")
public class MaterielController {

    @Autowired
    private IMaterielRepository matR;


    @Transactional
    @PostMapping("/addmateriel")
    public Materiel ajout(@RequestBody Materiel materiel) {
        return this.matR.save(materiel);
    }
    
    

    @Transactional
    @PutMapping("/updatemateriel/{id}")
    public Materiel updateMateriel(@PathVariable long id, @RequestBody Materiel materiel) {
    	Materiel mat = matR.findById(id).orElse(null);
        mat.setModel(materiel.getModel());
        mat.setType(materiel.getType());
        mat.setPrix(materiel.getPrix());
        mat.setDisponibilite(materiel.getDisponibilite());
        mat.setDate_ajout(materiel.getDate_ajout());
        mat.setDamaged(materiel.isDamaged());
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
    
    
    
    @PreAuthorize("hasAuthority('CHEF_PROJET')")
    @PutMapping("/archiver/{id}")
    public Materiel archiverMateriel(@PathVariable long id) {
        System.out.println("Called archive endpoint with ID: " + id);
        Materiel arch = matR.findById(id).orElse(null);
        if (arch == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Materiel not found");
        }
        arch.setArchiver(true);
        return matR.save(arch);
    }
    
    
    
    @PreAuthorize("hasAuthority('CHEF_PROJET')")
    @GetMapping("/afficher-liste-manquant")
    public List<Materiel> afficherMaterielManquant() {
        return this.matR.findByIsManquantTrue();
    }

    
    
    @DeleteMapping("/supprimerManquant/{id}")
    public String supprimerMaterielManquant(@PathVariable long id) {
        Materiel materiel = matR.findById(id).orElse(null);
        if (materiel == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Materiel non trouvé");
        }
        if (materiel.isManquant()) {
            this.matR.delete(materiel);
            return "Matériel manquant supprimé avec succès !";
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ce matériel n’est pas marqué comme manquant");
        }
    }
    
    
    @PreAuthorize("hasAuthority('CHEF_PROJET')")
    @PostMapping("etat")
    public String status(Long id) {
        Materiel m = this.matR.findById(id).get();
        m.setEnMaintenance(true);
        this.matR.save(m);
        return "true";
    }


    @PreAuthorize("hasAuthority('CHEF_PROJET')")
    @GetMapping("/afficher-liste-endommagé")
    public List<Materiel> afficherMaterielEndommagé() {
        return this.matR.findByIsDamagedTrue();
    }

    @PreAuthorize("hasAuthority('CHEF_PROJET')")
    @GetMapping("/afficher-liste-enmaintenance")
    public List<Materiel> afficherMaterielMaintenance() {
        return this.matR.findByEnMaintenanceTrue();
    }


    //hekom tester w ye5dmou

//    @GetMapping("prixmatriel")
//    public List<Object>prixmatriel(){
//        return this.matR.prixmatriel();
//    }







}
