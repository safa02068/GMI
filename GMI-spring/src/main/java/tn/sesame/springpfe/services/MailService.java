package tn.sesame.springpfe.services;


import java.security.NoSuchAlgorithmException;
import java.util.Map;
import java.util.TreeMap;

import javax.crypto.NoSuchPaddingException;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import tn.sesame.springpfe.entities.User;
import tn.sesame.springpfe.repositories.IuserRepository;



@Service
public class MailService {

	
@Autowired
JavaMailSender mailsender ; 

@Autowired
JavaMailSender javaMailSender ; 
@Autowired
IuserRepository userrepos ;








public Map<String, Boolean> renitialisermp(String emailcrypter)
throws NoSuchAlgorithmException, NoSuchPaddingException {
MimeMessage mimeMessage = javaMailSender.createMimeMessage();
Map<String, Boolean> success = new TreeMap<String, Boolean>();
try {
MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
User u = this.userrepos.findByEmail(emailcrypter);

success.put("response", true);

mimeMessageHelper.setSubject("Rénitialiser Mot de passe");
mimeMessageHelper.setFrom(emailcrypter);
mimeMessageHelper.setTo(emailcrypter);
String content =" Bonjour Mr (Mme),<br>"
				+"voila le lien pour modifier votre mot de passe <br><br>"
				+"<a href=\"http://localhost:4200/authentication/reset-password;id="+u.getId()+"\">http://localhost:4200/nouveaump</a><br>"
				+ "Cordialement ,<br><br>" ;
mimeMessageHelper.setText(content);
// Add a resource as an attachment
mimeMessageHelper.setText("<html><body><p>" + content
+ "</p> </body></html>",
true);
javaMailSender.send(mimeMessageHelper.getMimeMessage());



success.put("response", false);
} catch (MessagingException x) {
x.printStackTrace();
}
return success;

}





	
}
