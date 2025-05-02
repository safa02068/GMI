package tn.sesame.springpfe.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Materiel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String model;
    private int stock ;
    private String type; //individuelle ou bien personnel
    private float prix;
    private String disponibilite;
    private Date date_ajout;
    private Date date_suppression;
    private boolean isDamaged;
    private boolean enMaintenance;
    private boolean isManquant;
    private boolean archiver;
    

    
    @JsonIgnore
    @OneToMany
    private List<Intervention> interventions ;

}
