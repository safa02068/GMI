package tn.sesame.springpfe.entities;

import lombok.Data;
import lombok.NonNull;

@Data
public class LoginResponse {
	@NonNull
	private String token ;
	@NonNull
	private String type ;
	@NonNull
	private String message ; 
	@NonNull
	private Profil profil ;
	@NonNull
	private String email ;
	@NonNull
	private Long id ; 
	
	
}
