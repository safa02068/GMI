package tn.sesame.springpfe.controllers;

import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tn.sesame.springpfe.entities.Materiel;
import tn.sesame.springpfe.entities.Projet;
import tn.sesame.springpfe.entities.User;
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


    @Transactional
    @PreAuthorize("hasAuthority('CHEF_PROJET')")
    @PostMapping("/addmateriel")
    public Materiel ajout(@RequestBody Materiel materiel) {
        return this.matR.save(materiel);
    }
    
    

    @Transactional
    @PreAuthorize("hasAuthority('CHEF_PROJET')")
    @PutMapping("/updatemateriel/{id}")
    public Materiel updateMateriel(@PathVariable long id, @RequestBody Materiel materiel) {
    	Materiel mat = matR.findById(id).orElse(null);
        mat.setModel(materiel.getModel());
        mat.setType(materiel.getType());
        mat.setPrix(materiel.getPrix());
        mat.setDisponibilite(materiel.getDisponibilite());
        mat.setDate_ajout(materiel.getDate_ajout());
        mat.setDate_suppression(materiel.getDate_suppression());
        return matR.save(mat);
    }

    
    @GetMapping("/affichierlistmateriel")
    @PreAuthorize("hasAuthority('CHEF_PROJET')")
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

    
    
    @PreAuthorize("hasAuthority('CHEF_PROJET')")
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
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ce matériel n'est pas marqué comme manquant");
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

//    @Transactional
//    @PreAuthorize("hasAuthority('CHEF_PROJET')")
//    @PostMapping("/{projetId}/affecter-materiel/{materielId}")
//    public Materiel affecterMateriel(@PathVariable long materielId, @PathVariable long projetId) {
//        Materiel materiel = matR.findById(materielId)
//            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Materiel non trouvé"));
//        Projet projet = projetRepository.findById(projetId)
//            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Projet non trouvé"));
//            
//        materiel.setProjet(projet);
//        return matR.save(materiel);
//    }
//    
//    //permet de assigner si tous les utilisateurs du projet ont accès au matériel
//    @Transactional
//    @PreAuthorize("hasAuthority('CHEF_PROJET')")
//    @PutMapping("/set-controle-acces/{materielId}")
//    public Materiel setControleAcces(
//            @PathVariable long materielId,
//            @RequestParam boolean allProjectUsersAccess) {
//        Materiel materiel = matR.findById(materielId)
//            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Materiel non trouvé"));
//            
//        materiel.setAllProjectUsersAccess(allProjectUsersAccess);
//        if (allProjectUsersAccess) {
//            materiel.setUtilisateurs(null); // on vide la liste des utilisateurs si tous les utilisateurs du projet ont accès au matériel
//        }
//        return matR.save(materiel);
//    }
//    
//    //permet de savoir si tous les utilisateurs du projet ont accès au matériel
//    @Transactional
//    @PreAuthorize("hasAuthority('CHEF_PROJET')")
//    @PostMapping("/{materielId}/utilisateurs")
//    public Materiel setUtilisateurs(
//            @PathVariable long materielId,
//            @RequestBody List<Long> userIds) {
//        Materiel materiel = matR.findById(materielId)
//            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Materiel non trouvé"));
//            
//        // Récupérer tous les utilisateurs du projet
//        List<User> projectUsers = materiel.getProjet().getUsers();
//        List<User> usersToAdd = userRepository.findAllById(userIds);
//        
//        // Vérifier si tous les utilisateurs appartiennent au projet
//        boolean allUsersInProject = usersToAdd.stream()
//            .allMatch(user -> projectUsers.stream()
//                .anyMatch(projectUser -> projectUser.getId().equals(user.getId())));
//                
//        if (!allUsersInProject) {
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tous les utilisateurs doivent appartenir au projet qui possède ce matériel");
//        }
//        
//        materiel.setUtilisateurs(usersToAdd);
//        materiel.setAllProjectUsersAccess(false); // on désactive l'accès à tous les utilisateurs du projet
//        return matR.save(materiel);
//    }
//    
//    //permet de récupérer tous les matériels d'un projet
//    @GetMapping("/project/{projetId}")
//    @PreAuthorize("hasAuthority('CHEF_PROJET')")
//    public List<Materiel> getMaterielsByProjet(@PathVariable long projetId) {
//        return matR.findByProjetId(projetId);
//    }
//
//    //permet de récupérer tous les matériels accessibles à un utilisateur
//    @GetMapping("/accessible/{userId}")
//    public List<Materiel> getAccessibleMaterials(@PathVariable long userId) {
//        User user = userRepository.findById(userId)
//            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé"));
//            
//        // get tous les matériels d'un projet où l'utilisateur est dans la liste des utilisateurs du projet et où tous les utilisateurs du projet ont accès au matériel
//        List<Materiel> allAccessMaterials = matR.findByProjetUsersIdAndAllProjectUsersAccessTrue(userId);
//        
//        // get tous les matériels d'un projet où l'utilisateur est dans la liste des utilisateurs du projet et où l'utilisateur est dans la liste des utilisateurs ayant accès au matériel
//        List<Materiel> specificAccessMaterials = matR.findByProjetUsersIdAndUtilisateurs_Id(userId);
//        
//        // combine les deux listes, en supprimant les doublons
//        allAccessMaterials.addAll(specificAccessMaterials);
//        return allAccessMaterials;
//    }

}
