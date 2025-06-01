package tn.sesame.springpfe.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import tn.sesame.springpfe.entities.Materiel;
import tn.sesame.springpfe.entities.Projet;
import tn.sesame.springpfe.entities.User;
import tn.sesame.springpfe.repositories.IMaterielRepository;
import tn.sesame.springpfe.repositories.IProjetRepository;
import tn.sesame.springpfe.repositories.IuserRepository;

import java.util.List;

@RestController
@RequestMapping("/projets")
@CrossOrigin("*")
public class ProjetController {

    @Autowired
    private IProjetRepository projetR;

    

    //tester déjà
    @PreAuthorize("hasAuthority('CHEF_PROJET')")
    @PostMapping("/addprojet")
    public Projet ajout(@RequestBody Projet projet) {
        projet.setArchiver(false);
        return projetR.save(projet);
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


}




