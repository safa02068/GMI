package tn.sesame.springpfe.controllers;

import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import tn.sesame.springpfe.entities.Profil;
import tn.sesame.springpfe.entities.User;
import tn.sesame.springpfe.repositories.IuserRepository;
import tn.sesame.springpfe.services.IuserService;
import tn.sesame.springpfe.services.MailService;
import tn.sesame.springpfe.services.UserService;

import javax.crypto.NoSuchPaddingException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

@RequestMapping("users")
@RestController
@CrossOrigin("*")

public class UserControllers {

	@Autowired
	IuserRepository userR ;

    @Autowired
    PasswordEncoder encoder ;
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public String Ajout(@RequestBody User user,String p) {
    	User userexist = this.userR.findByEmail(user.getEmail());
    		if(userexist==null){
    			try {
    				user.setP(Profil.valueOf(p.toUpperCase()));
    			}catch(IllegalArgumentException e ){
    				return "profil invalid";
    			}
        String pass = encoder.encode(user.getPassword());
        user.setPassword(pass);
        this.userR.save(user);
        return "true";
    		}
    		else{
    			return  "false";
       }
    }
    
    
@PreAuthorize("hasAuthority('ADMIN')")
@GetMapping("all")
public List<User> all(){
return this.userR.findAll();
}




@Autowired
MailService mailservice ; 
@PostMapping("renitialisermp")
public String testmail(String email) throws NoSuchAlgorithmException, NoSuchPaddingException {
	this.mailservice.renitialisermp(email);
	return "true" ; 
	
}



@PostMapping("modifiermp")
public String modifiermp(Long id , String password) {
	User u = this.userR.findById(id).get();
	String pass = encoder.encode(password);
	u.setPassword(pass);
	this.userR.save(u);
	return "true" ; 
	
}



@PreAuthorize("hasAuthority('admin')")
@DeleteMapping("/delete")
@ApiOperation(value = "supprimer User ")
public void deleteUser(long idUser)  {
    IuserService utilisateurService = new UserService(); // Créez une instance de service
    utilisateurService.deleteUser(idUser); // Appele de la méthode sur l'instance créée
    }


        
    
//    //archive user
//	@PreAuthorize("hasAuthority('ADMIN')")
//    @PostMapping("/archiver")
//    public String archiver(Long id) {
//        User u =this.userR.findById(id).get();
//        u.setArchiver(true);
//        this.userR.saveAndFlush(u);
//        return "true";
//    }

    
    
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("affichage")
    public List<User> affichage(){
        return this.userR.findByArchiverIsFalse();
    }
    
    
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("afficherbyemail")
    public User afficherbyemail(String email) {
        return this.userR.findByEmail(email);

    }

    
    
 
    @PostMapping("modifier")
    public String modifier(String nom , String prenom , String email,String poste,String tel,String adresse,String IBAN) {

        User u = this.userR.findByEmail(email);
        u.setNom(nom);
        u.setPrenom(prenom);
        u.setPoste(poste);
        u.setTel(tel);
        u.setEmail(email);
        u.setAdresse(adresse);
        u.setIBAN(IBAN);
        this.userR.saveAndFlush(u);
        return "true";

    }
    

  
}