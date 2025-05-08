package tn.sesame.springpfe.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import tn.sesame.springpfe.entities.Materiel;
import tn.sesame.springpfe.entities.Projet;
import tn.sesame.springpfe.entities.User;
import tn.sesame.springpfe.repositories.IMaterielRepository;
import tn.sesame.springpfe.repositories.IProjetRepository;
import tn.sesame.springpfe.repositories.IuserRepository;
//import tn.sesame.springpfe.services.ProjetService;
import tn.sesame.springpfe.services.ProjetService;

import java.util.List;

import javax.transaction.Transactional;

@RestController
@RequestMapping("/projets")
@CrossOrigin("*")
public class ProjetController {

    @Autowired
    private IProjetRepository projetR;

    @Autowired
    private ProjetService projetService;
    
    @Autowired 
    private IMaterielRepository matR;
    
    @Autowired
    private IuserRepository userRepository;
    
    private Projet projet ;  

    //tester déjà
    @PreAuthorize("hasAuthority('CHEF_PROJET')")
    @PostMapping("/addprojet")
    public Projet ajout(@RequestBody Projet projet) {
        projet.setArchiver(false);
        return projetR.save(projet);
    }
    
    
    
    @Transactional
    @PreAuthorize("hasAuthority('CHEF_PROJET')")
    @PutMapping("/updateprojet/{id}")
    public Projet updateProjet(@PathVariable long id, @RequestBody Projet projet) {
    	Projet proj = projetR.findById(id).orElse(null);
        proj.setNom(projet.getNom());
        proj.setDescription(projet.getDescription());
        proj.setDate_debut(projet.getDate_debut());
        proj.setDate_fin(projet.getDate_fin());
        return projetR.save(proj);
    }
    
    
    //tester déjà
    @PreAuthorize("hasAuthority('CHEF_PROJET')")
    @PutMapping("archiverprojet/{id}")
    public Projet archiverProjet(@PathVariable Long id) {
        Projet arch = projetR.findById(id).get();
        arch.setArchiver(true);
        return projetR.save(arch);
    }
    
    //tester déja
    @PreAuthorize("hasAuthority('CHEF_PROJET')")
    @GetMapping("/afficherlist")
   public List<Projet> prolist(){
       return this.projetR.findAll();
   }

  //tester déjà
  @PreAuthorize("hasAuthority('CHEF_PROJET')")
  @GetMapping("/rechercherprojetparid/{id}")
  public Projet rechercherprojet(@PathVariable Long id){
    Projet affiche =projetR.findById(id).get();
    return (affiche);
  }

//-----------------------------------------------------------------------------------------------
    @PostMapping("/{projectId}/users/{userId}")
    public ResponseEntity<String> affecterUtilisateur(
            @PathVariable Long projectId,
            @PathVariable Long userId,
            @RequestParam Long managerId) {
        try {
            projetService.assignUserToProject(projectId, userId, managerId);
            return ResponseEntity.ok("Utilisateur affecté au projet avec succès");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{projectId}/users/{userId}")
    public ResponseEntity<String> supprimerUtilisateur(
            @PathVariable Long projectId,
            @PathVariable Long userId,
            @RequestParam Long managerId) {
        try {
            projetService.removeUserFromProject(projectId, userId, managerId);
            return ResponseEntity.ok("Utilisateur supprimé du projet avec succès");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/users/{userId}/switch")
    public ResponseEntity<String> changerProjet(
            @PathVariable Long userId,
            @RequestParam Long oldProjectId,
            @RequestParam Long newProjectId,
            @RequestParam Long managerId) {
        try {
            projetService.switchUserProject(oldProjectId, newProjectId, userId, managerId);
            return ResponseEntity.ok("Utilisateur changé de projet avec succès");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{projectId}/users")
    public ResponseEntity<?> getUtilisateursProjet(@PathVariable Long projectId) {
        try {
            List<User> users = projetService.getProjectUsers(projectId);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    
    
    //materiel 
    @Transactional
    @PreAuthorize("hasAuthority('CHEF_PROJET')")
    @PostMapping("/{projetId}/affecter-materiel/{materielId}")
    public Materiel affecterMateriel(@PathVariable long materielId, @PathVariable long projetId) {
        Materiel materiel = matR.findById(materielId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Materiel non trouvé"));
        Projet projet = projetR.findById(projetId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Projet non trouvé"));
            
        materiel.setProjet(projet);
        return matR.save(materiel);
    }
    
    //permet de assigner si tous les utilisateurs du projet ont accès au matériel
    @Transactional
    @PreAuthorize("hasAuthority('CHEF_PROJET')")
    @PutMapping("/set-controle-acces/{materielId}")
    public Materiel setControleAcces(
            @PathVariable long materielId,
            @RequestParam boolean allProjectUsersAccess) {
        Materiel materiel = matR.findById(materielId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Materiel non trouvé"));
            
        materiel.setAllProjectUsersAccess(allProjectUsersAccess);
        if (allProjectUsersAccess) {
            materiel.setUtilisateurs(null); // on vide la liste des utilisateurs si tous les utilisateurs du projet ont accès au matériel
        }
        return matR.save(materiel);
    }
    
    //permet de savoir si tous les utilisateurs du projet ont accès au matériel
    @Transactional
    @PreAuthorize("hasAuthority('CHEF_PROJET')")
    @PostMapping("/{materielId}/utilisateurs")
    public Materiel setUtilisateurs(
            @PathVariable long materielId,
            @RequestBody List<Long> userIds) {
        Materiel materiel = matR.findById(materielId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Materiel non trouvé"));
            
        // Récupérer tous les utilisateurs du projet
        List<User> projectUsers = materiel.getProjet().getUsers();
        List<User> usersToAdd = userRepository.findAllById(userIds);
        
        // Vérifier si tous les utilisateurs appartiennent au projet
        boolean allUsersInProject = usersToAdd.stream()
            .allMatch(user -> projectUsers.stream()
                .anyMatch(projectUser -> projectUser.getId().equals(user.getId())));
                
        if (!allUsersInProject) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tous les utilisateurs doivent appartenir au projet qui possède ce matériel");
        }
        
        materiel.setUtilisateurs(usersToAdd);
        materiel.setAllProjectUsersAccess(false); // on désactive l'accès à tous les utilisateurs du projet
        return matR.save(materiel);
    }
    
    //permet de récupérer tous les matériels d'un projet
    @GetMapping("/project/{projetId}")
    @PreAuthorize("hasAuthority('CHEF_PROJET')")
    public List<Materiel> getMaterielsByProjet(@PathVariable long projetId) {
        return matR.findByProjetId(projetId);
    }

    //permet de récupérer tous les matériels accessibles à un utilisateur
    @GetMapping("/accessible/{userId}")
    public List<Materiel> getAccessibleMaterials(@PathVariable long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé"));
            
        // get tous les matériels d'un projet où l'utilisateur est dans la liste des utilisateurs du projet et où tous les utilisateurs du projet ont accès au matériel
        List<Materiel> allAccessMaterials = matR.findByProjetUsersIdAndAllProjectUsersAccessTrue(userId);
        
        // get tous les matériels d'un projet où l'utilisateur est dans la liste des utilisateurs du projet et où l'utilisateur est dans la liste des utilisateurs ayant accès au matériel
        List<Materiel> specificAccessMaterials = matR.findByProjetUsersIdAndUtilisateurs_Id(userId);
        
        // combine les deux listes, en supprimant les doublons
        allAccessMaterials.addAll(specificAccessMaterials);
        return allAccessMaterials;
    }
    
    
    
    @DeleteMapping("/{projectId}/materiel/{materielId}")
    public ResponseEntity<String> supprimerMateriel(
            @PathVariable Long projectId,
            @PathVariable Long materielId,
            @RequestParam Long managerId) {
        try {
            projetService.removeMaterielFromProject(projectId, materielId, managerId);
            return ResponseEntity.ok("Matériel supprimé du projet avec succès");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    
    
    
    
    
    
    
    
}

