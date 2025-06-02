package tn.sesame.springpfe.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import javax.persistence.Id;
import java.util.Date;

@Entity

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Intervention {
	@JsonIgnore
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String titre;
    private String description;
    private Date datedecreation;
    private Date datederesolution;
    //private String priorite; //zeyda
    private String commentaire;
    private Boolean archiver;

    private String etat;
    //boolean archiver = false;

    @JsonIgnore
    @ManyToOne
    Materiel materiel;

    @JsonIgnore
    @ManyToOne
    private User demandeur;
}
