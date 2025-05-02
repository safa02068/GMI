package tn.sesame.springpfe.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.sesame.springpfe.entities.Materiel;
import tn.sesame.springpfe.repositories.IMaterielRepository;

import java.util.List;

@Service
public class MaterielService {
    @Autowired
    private IMaterielRepository matR;

    public Materiel addMateriel(Materiel materiel) {
        return matR.save(materiel);
    }

    public Materiel updateMateriel(Materiel materiel) {
        return matR.save(materiel);
    }

    public void deleteMateriel(Long id) {
        matR.deleteById(id);
    }

    public Materiel getMaterielById(Long id) {
        return matR.findById(id).get();
    }

    public List<Materiel> getAllMateriels() {
        return matR.findAll();
    }

    public List<Materiel> getMaterielsByModele(String modele) {
        return matR.findByModel(modele);
    }
}




