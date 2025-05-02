package tn.sesame.springpfe.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.sesame.springpfe.entities.Intervention;
import tn.sesame.springpfe.repositories.IinterventionRepository;

import java.util.List;

@Service
public class InterventionService {
    @Autowired
    private IinterventionRepository intR ;

    public Intervention addinter (Intervention inter) {
        return intR.save(inter);
    }

    public Intervention updateinter(Intervention inter) {
        return intR.save(inter);
    }

    public void deleteinter(Long id) {
        Intervention i = this.intR.findById(id).get();
        intR.delete(i);
    }

    public Intervention getticById(Long id) {
        return intR.findById(id).get();
    }

    public List<Intervention> getAllinterventions() {
        return intR.findAll();
    }

    public Intervention getInterventionsByid(long id) {
        return intR.findById(id).get();
    }

}

