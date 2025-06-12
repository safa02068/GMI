package tn.sesame.springpfe.entities;

import javax.persistence.*;
import lombok.*;

import javax.persistence.Id;
import java.util.Date;

@Entity

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Intervention {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titre;
    private String description;
    private Date datedecreation;
    private Date datederesolution;
    private Boolean archiver;
    private String type;
    
    private String commentaire;
    private String statut;
    //boolean archiver = false;

    @ManyToOne
    Materiel materiel;


    @ManyToOne
    private User demandeur;


}
