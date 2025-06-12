package tn.sesame.springpfe.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.sesame.springpfe.entities.Materiel;
import tn.sesame.springpfe.entities.Intervention;
import tn.sesame.springpfe.entities.Projet;
import tn.sesame.springpfe.entities.MaterielManquant;
import tn.sesame.springpfe.repositories.IMaterielManqRepository;
import tn.sesame.springpfe.repositories.IMaterielRepository;
import tn.sesame.springpfe.repositories.IProjetRepository;
import tn.sesame.springpfe.repositories.IinterventionRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin("*")
public class DashboardController {

    @Autowired
    private IMaterielRepository materielRepository;

    @Autowired
    private IinterventionRepository interventionRepository;

    @Autowired
    private IProjetRepository projetRepository;

    @Autowired
    private IMaterielManqRepository materielManquantRepository;

    // Helper method to convert Date to LocalDateTime
    private LocalDateTime convertToLocalDateTime(Date date) {
        return date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }

    // 1b. Nombre de matériels ajoutés par date
    @GetMapping("/materiels-ajoutes-par-date")
    public ResponseEntity<Map<Object, Long>> getMaterielsAjoutesParDate() {
        List<Materiel> materiels = materielRepository.findAll();
        Map<Object, Long> countByDate = materiels.stream()
            .filter(m -> m.getDate_ajout() != null)
            .collect(Collectors.groupingBy(
                m -> m.getDate_ajout().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().toString(),
                Collectors.counting()
            ));
        return ResponseEntity.ok(countByDate);
    }

    // 2. Interventions par type
    @GetMapping("/interventions-par-type")
    public ResponseEntity<Map<Object, Long>> getInterventionsParType() {
        List<Intervention> interventions = interventionRepository.findAll();
        Map<Object, Long> interventionsByType = interventions.stream()
                .filter(i -> i.getType() != null)
                .collect(Collectors.groupingBy(
                    intervention -> intervention.getType(),
                    Collectors.counting()
                ));
        return ResponseEntity.ok(interventionsByType);
    }

    // 3. Nombre de projets effectués
    @GetMapping("/projets-effectues")
    public ResponseEntity<Long> getProjetsEffectues() {
        LocalDateTime now = LocalDateTime.now();
        return ResponseEntity.ok(projetRepository.findAll().stream()
                .filter(projet -> projet.getDate_fin() != null && 
                        convertToLocalDateTime(projet.getDate_fin()).isBefore(now))
                .count());
    }

    // 4. Nombre de matériels manquants
    @GetMapping("/materiels-manquants")
    public ResponseEntity<Long> getMaterielsManquants() {
        return ResponseEntity.ok(materielManquantRepository.count());
    }

    // 5. Taux de complétion des projets
    @GetMapping("/taux-completion-projets")
    public ResponseEntity<Map<String, Object>> getTauxCompletionProjets() {
        LocalDateTime now = LocalDateTime.now();
        List<Projet> projets = projetRepository.findAll();
        long totalProjets = projets.size();
        long projetsTermines = projets.stream()
                .filter(projet -> projet.getDate_fin() != null && 
                        convertToLocalDateTime(projet.getDate_fin()).isBefore(now))
                .count();
        double tauxCompletion = totalProjets > 0 ? (double) projetsTermines / totalProjets * 100 : 0;

        Map<String, Object> response = new HashMap<>();
        response.put("tauxCompletion", tauxCompletion);
        response.put("totalProjets", totalProjets);
        response.put("projetsTermines", projetsTermines);
        return ResponseEntity.ok(response);
    }

    // 6. Distribution des modèles de matériels
    @GetMapping("/distribution-modeles-materiels")
    public ResponseEntity<Map<String, Long>> getDistributionModelesMateriels() {
        List<Materiel> materiels = materielRepository.findAll();
        Map<String, Long> distribution = materiels.stream()
                .collect(Collectors.groupingBy(
                    materiel -> materiel.getModel() != null ? materiel.getModel() : "Non spécifié",
                    Collectors.counting()
                ));
        return ResponseEntity.ok(distribution);
    }

    // 7. Interventions par date
    @GetMapping("/interventions-par-date")
    public ResponseEntity<Map<Object, Long>> getInterventionsParDate() {
        List<Intervention> interventions = interventionRepository.findAll();
        Map<Object, Long> tendance = interventions.stream()
                .filter(i -> i.getDatedecreation() != null)
                .collect(Collectors.groupingBy(
                    intervention -> intervention.getDatedecreation().toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate()
                        .toString(),
                    Collectors.counting()
                ));
        return ResponseEntity.ok(tendance);
    }

    // 8. Ratio matériels manquants vs disponibles
    @GetMapping("/ratio-materiels")
    public ResponseEntity<Map<String, Object>> getRatioMateriels() {
        long totalMateriels = materielRepository.count();
        long materielsManquants = materielManquantRepository.count();
        double ratio = totalMateriels > 0 ? (double) materielsManquants / totalMateriels * 100 : 0;

        Map<String, Object> response = new HashMap<>();
        response.put("ratio", ratio);
        response.put("totalMateriels", totalMateriels);
        response.put("materielsManquants", materielsManquants);
        return ResponseEntity.ok(response);
    }

    // 9. Projets en cours vs terminés
    @GetMapping("/projets-status")
    public ResponseEntity<Map<String, Long>> getProjetsStatus() {
        LocalDateTime now = LocalDateTime.now();
        List<Projet> projets = projetRepository.findAll();
        Map<String, Long> status = projets.stream()
                .collect(Collectors.groupingBy(
                    projet -> {
                        if (projet.getDate_fin() == null) return "Non spécifié";
                        return convertToLocalDateTime(projet.getDate_fin()).isBefore(now) ? "Terminé" : "En cours";
                    },
                    Collectors.counting()
                ));
        return ResponseEntity.ok(status);
    }
} 