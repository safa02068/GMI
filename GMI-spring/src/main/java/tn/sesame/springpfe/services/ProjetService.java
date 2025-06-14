package tn.sesame.springpfe.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tn.sesame.springpfe.entities.Materiel;
import tn.sesame.springpfe.entities.Profil;
import tn.sesame.springpfe.entities.Projet;
import tn.sesame.springpfe.entities.User;
import tn.sesame.springpfe.repositories.IMaterielRepository;
import tn.sesame.springpfe.repositories.IProjetRepository;
import tn.sesame.springpfe.repositories.IuserRepository;


import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class ProjetService {

    @Autowired
    private IProjetRepository projetRepository;

    @Autowired
    private IuserRepository userRepository;
    
    @Autowired
    private IMaterielRepository matR;
    

    public String assignUserToProject(Long projectId, Long userId) {
        // Verify if the manager is a CHEF_PROJET
        
        // Verify if the user is an EMPLOYE
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));
        
        if (user.getP() != Profil.EMPLOYE) {
            throw new IllegalStateException("Seul les EMPLOYE peuvent être assignés à des projets");
        }

        Projet projet = projetRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Projet non trouvé"));

        // Remove user from current project if any
        if (user.getProjet() != null) {
            user.getProjet().getUsers().remove(user);
        }

        // Assign to new project
        user.setProjet(projet);
        projet.getUsers().add(user);
        this.userRepository.save(user);
        this.projetRepository.save(projet);
        return "true" ;
    }

    public void removeUserFromProject(Long projectId, Long userId, Long managerId) {
        // Verify if the manager is a CHEF_PROJET
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new EntityNotFoundException("Manager non trouvé"));
        
        if (manager.getP() != Profil.CHEF_PROJET) {
            throw new IllegalStateException("Seul le CHEF_PROJET peut supprimer des utilisateurs des projets");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));
        
        if (user.getP() != Profil.EMPLOYE) {
            throw new IllegalStateException("Seul les EMPLOYE peuvent être supprimés des projets");
        }

        Projet projet = projetRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Projet non trouvé"));
        if (!projet.getUsers().contains(user)) {
            throw new IllegalStateException("L'utilisateur n'est pas assigné à ce projet");
        }

        projet.getUsers().remove(user);
        user.setProjet(null);;

        userRepository.save(user);
        projetRepository.save(projet);
    }

    public void switchUserProject(Long oldProjectId, Long newProjectId, Long userId, Long managerId) {
        // Verify if the manager is a CHEF_PROJET
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new EntityNotFoundException("Chef de projet non trouvé"));
        
        if (manager.getP() != Profil.CHEF_PROJET) {
            throw new IllegalStateException("Seul le CHEF_PROJET peut changer d'un projet à un autre");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));
        
        if (user.getP() != Profil.EMPLOYE) {
            throw new IllegalStateException("Seul les EMPLOYE peuvent changer de projet");
        }

        Projet oldProjet = projetRepository.findById(oldProjectId)
                .orElseThrow(() -> new EntityNotFoundException("Projet non trouvé"));

        Projet newProjet = projetRepository.findById(newProjectId)
                .orElseThrow(() -> new EntityNotFoundException("Projet non trouvé"));

        if (!oldProjet.getUsers().contains(user)) {
            throw new IllegalStateException("L'utilisateur n'est pas assigné au projet ancien");
        }

        oldProjet.getUsers().remove(user);
        newProjet.getUsers().add(user);
        user.setProjet(newProjet);

        userRepository.save(user);
        projetRepository.save(oldProjet);
        projetRepository.save(newProjet);
    }

    public List<User> getProjectUsers(Long projectId) {
        Projet projet = projetRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Projet non trouvé"));
        return projet.getUsers();
    }
    
    public void removeMaterielFromProject(Long projectId, Long materielId, Long managerId) {
        // Verify if the manager is a CHEF_PROJET
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new EntityNotFoundException("Manager non trouvé"));
        
        if (manager.getP() != Profil.CHEF_PROJET) {
            throw new IllegalStateException("Seul le CHEF_PROJET peut supprimer des matériels des projets");
        }

        Materiel materiel = matR.findById(materielId)
                .orElseThrow(() -> new EntityNotFoundException("Matériel non trouvé"));
        
      

        Projet projet = projetRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Projet non trouvé"));
        if (!projet.getMateriels().contains(materiel)) {
            throw new IllegalStateException("Le matériel n'est pas assigné à ce projet");
        }

        projet.getMateriels().remove(materiel);
        materiel.setProjet(null);;

        matR.save(materiel);
        projetRepository.save(projet);
    }
} 