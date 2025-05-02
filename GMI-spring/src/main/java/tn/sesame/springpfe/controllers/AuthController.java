package tn.sesame.springpfe.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tn.sesame.springpfe.entities.LoginRequest;
import tn.sesame.springpfe.entities.LoginResponse;
import tn.sesame.springpfe.entities.User;
import tn.sesame.springpfe.repositories.IuserRepository;
import tn.sesame.springpfe.security.JwtTokenUtils;

import lombok.NonNull;

@RestController
@CrossOrigin("*")
@RequestMapping("auth")
public class AuthController {
	
@Autowired
PasswordEncoder passwordencoder ;
@Autowired
AuthenticationManager authenticationManager;
@Autowired
JwtTokenUtils JwtTokenUtils ;
@Autowired
IuserRepository userrepos ; 

@PostMapping("/login")
public ResponseEntity<LoginResponse> login (@RequestBody LoginRequest loginRequest ){
	Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
	SecurityContextHolder.getContext().setAuthentication(authentication);
	UserDetails userDetails =  (UserDetails) authentication.getPrincipal();
	String token = this.JwtTokenUtils.generateToken(userDetails);
	User user = this.userrepos.findByEmail(loginRequest.getEmail());
	return ResponseEntity.ok(new LoginResponse(token,"Bearer","Login Succefully",user.getP(),user.getEmail(),user.getId()));
}
}
