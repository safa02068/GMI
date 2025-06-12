package tn.sesame.springpfe.entities;

import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor 
@Data
public class MaterielManquant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
	private String nom;
	private String modele;
	private int stock;
	

}
