package tn.sesame.springpfe.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Materiel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
	private String nom;
    private String model;
    private int stock ;
    private float prix;
    private Date date_ajout;
    private Date date_suppression;
    
    private boolean isDamaged; 
    
    private boolean enMaintenance;
    
    private boolean archiver;
    
    
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "projet_id")
    private Projet projet;
    
    @JsonIgnore
    //permet de savoir si tous les utilisateurs du projet ont accès au matériel
    private boolean allProjectUsersAccess;
    
    @JsonIgnore
    @ManyToMany
    @JoinTable(
        name = "materiel_allowed_users",
        joinColumns = @JoinColumn(name = "materiel_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> Utilisateurs;
    
    @JsonIgnore
    @OneToMany
    private List<Intervention> interventions ;

}
