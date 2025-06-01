package tn.sesame.springpfe.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import lombok.*;

import java.util.Date;

@Entity

@AllArgsConstructor
@NoArgsConstructor
@Data

public class Commentaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String commentaire;
    private Date date;
}
