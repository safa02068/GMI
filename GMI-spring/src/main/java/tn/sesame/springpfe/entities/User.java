package tn.sesame.springpfe.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import lombok.*;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class User {

    @Id
    @GeneratedValue(strategy =  GenerationType.AUTO)
    private Long id;
    private String password;
    private String nom;
    private String prenom;
    private String email;
    private String poste;
    private String IBAN;
    private String CIN;
    private String tel;
    private String adresse;
    private boolean archiver;

    @Enumerated(EnumType.STRING)
    private Profil p ;

    @ManyToOne
    @JoinColumn(name = "projet_id")
    private Projet projet;
    


}
