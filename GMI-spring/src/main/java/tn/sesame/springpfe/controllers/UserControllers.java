package tn.sesame.springpfe.controllers;

import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import tn.sesame.springpfe.entities.Profil;
import tn.sesame.springpfe.entities.Projet;
import tn.sesame.springpfe.entities.User;
import tn.sesame.springpfe.repositories.IProjetRepository;
import tn.sesame.springpfe.repositories.IuserRepository;
import tn.sesame.springpfe.services.IuserService;
import tn.sesame.springpfe.services.MailService;
import tn.sesame.springpfe.services.UserService;

import javax.crypto.NoSuchPaddingException;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Map;

@RequestMapping("users")
@RestController
@CrossOrigin("*")
public class UserControllers {

	@Autowired
	IuserRepository userR ;
	
	
    @Autowired
    UserService userService;


    @Autowired
    PasswordEncoder encoder ;
    
    @Autowired
    IProjetRepository projrepo ;
    	@GetMapping("allbyprojet")
    	public List<User> allbyprojet(Long id){
    		Projet p =this.projrepo.findById(id).get();
    		return this.userR.findByProjet(p);
    	}

    @PutMapping("desaffecter")
    public String desafecter(Long id) {
    	User u = this.userR.findById(id).get();
    	u.setProjet(null);
    	this.userR.saveAndFlush(u);
    	return "true"; 
    }
    
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public String Ajout(@RequestBody User user) {
    	User userexist = this.userR.findByEmail(user.getEmail());
    		if(userexist==null){
    			try {
    				user.setP(Profil.valueOf(user.getP().name()));
    			}catch(IllegalArgumentException e ){
    				return "profil invalid";
    			}
        String pass = encoder.encode(user.getPassword());
        user.setPassword(pass);
        this.userR.save(user);
        return "true";
    		}
    		else
    			return  "false";
       }
    


    //@PreAuthorize("hasAuthority('ADMIN')")
	@GetMapping("all")
	public List<User> all(){
    	return this.userR.findAll();
	}




	@Autowired
	MailService mailservice ;
	@PostMapping("renitialisermp")
	public ResponseEntity<?> testmail(@RequestParam(required = false) String email) throws NoSuchAlgorithmException, NoSuchPaddingException {
		if (email == null || email.trim().isEmpty()) {
			return ResponseEntity.badRequest().body("Email parameter is required");
		}
		Map<String, Boolean> response = this.mailservice.renitialisermp(email);
		if (response.get("response")) {
			return ResponseEntity.ok("Password reset email sent successfully");
		} else {
			return ResponseEntity.badRequest().body("Failed to send password reset email. User may not exist.");
		}
	}



	@PostMapping("modifiermp")
	public String modifiermp(Long id , String password) {
		User u = this.userR.findById(id).get();
		String pass = encoder.encode(password);
		u.setPassword(pass);
		this.userR.save(u);
		return "true" ;
	}


	@PreAuthorize("hasAuthority('ADMIN')")
	@DeleteMapping("/delete/{idUser}")
	public void deleteUser(@PathVariable(name = "idUser") long idUser)  {
	    userService.deleteUser(idUser); // Appele de la méthode sur l'instance créée
	}








    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("affichage")
    public List<User> affichage(){
        return this.userR.findByArchiverIsFalse();
    }


    //@PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("afficherbyemail")
    public User afficherbyemail(String email) {
        return this.userR.findByEmail(email);
    }

    @GetMapping("my-profile")
    public ResponseEntity<?> getMyProfile() {
        try {
            String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = this.userR.findByEmail(currentUserEmail);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching profile: " + e.getMessage());
        }
    }




    @PostMapping("modifier")
    public String modifier(@RequestBody User u) {
        User existing = userR.findByEmail(u.getEmail());
        System.out.println(u.getNom());
     /*   existing.setNom(u.getNom());
        existing.setPrenom(u.getPrenom());
        existing.setPoste(u.getPoste());
        existing.setTel(u.getTel());
        existing.setAdresse(u.getAdresse());
        existing.setIBAN(u.getIBAN());*/
        existing= userR.saveAndFlush(u);
        return "true";
    }

    @PostMapping("update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody User updatedUser) {
        try {
            // Get the current user's email from the security context
            String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            
            // Find the user by email
            User existingUser = userR.findByEmail(currentUserEmail);
            if (existingUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            // Update only allowed fields
            existingUser.setNom(updatedUser.getNom());
            existingUser.setPrenom(updatedUser.getPrenom());
            existingUser.setTel(updatedUser.getTel());
            existingUser.setAdresse(updatedUser.getAdresse());
            existingUser.setCIN(updatedUser.getCIN());

            // Save the updated user
            User savedUser = userR.save(existingUser);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating profile: " + e.getMessage());
        }
    }
}