package tn.sesame.springpfe.entities;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Projet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String nom;
    private String description;
    private Date date_debut;
    private Date date_fin;
  
    @Column(nullable = false)
    private boolean archiver;
    @JsonIgnore
    @OneToMany(mappedBy = "projet")
    private List<User> users;
    
    @OneToMany(mappedBy = "projet")
    private List<Materiel> materiels;
    
    

   

}
