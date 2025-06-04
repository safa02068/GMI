package tn.sesame.springpfe;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import springfox.documentation.swagger2.annotations.EnableSwagger2;
import tn.sesame.springpfe.entities.User;
import tn.sesame.springpfe.entities.Profil;
import tn.sesame.springpfe.services.UserService;

@EnableSwagger2
@SpringBootApplication
public class SpringpfeApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringpfeApplication.class, args);
    }
/*
    @Bean
    CommandLineRunner run(UserService userService) {
        return args -> {
            User user = new User();
            user.setPassword("password");
            user.setNom("Doe");
            user.setPrenom("John");
            user.setEmail("admin@admin.com");
            user.setPoste("Développeur");
            user.setIBAN("TN5903700100101234567890");
            user.setCIN("F11412701");
            user.setTel("+21620000000");
            user.setAdresse("Menzel Bourguiba");
            user.setP(Profil.ADMIN);
            user.setArchiver(false);
            userService.add(user);
        };
    }*/
}
