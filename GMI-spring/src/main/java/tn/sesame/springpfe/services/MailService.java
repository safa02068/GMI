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
	JavaMailSender mailsender;

	@Autowired
	JavaMailSender javaMailSender;

	@Autowired
	IuserRepository userrepos;

	public Map<String, Boolean> renitialisermp(String emailcrypter)
			throws NoSuchAlgorithmException, NoSuchPaddingException {
		Map<String, Boolean> success = new TreeMap<String, Boolean>();
		
		// Check if email is null or empty
		if (emailcrypter == null || emailcrypter.trim().isEmpty()) {
			success.put("response", false);
			return success;
		}

		// First check if user exists
		User u = this.userrepos.findByEmail(emailcrypter);
		if (u == null) {
			success.put("response", false);
			return success;
		}

		try {
			MimeMessage mimeMessage = javaMailSender.createMimeMessage();
			MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
			mimeMessageHelper.setSubject("Rénitialiser Mot de passe");
			mimeMessageHelper.setFrom(emailcrypter);
			mimeMessageHelper.setTo(emailcrypter);
			String content = " Bonjour Mr (Mme),<br>"
					+ "voila le lien pour modifier votre mot de passe <br><br>"
					+ "<a href=\"http://localhost:4200/authentication/reset-password;id=" + u.getId() + "\">Changer le mot de passe</a><br>"
					+ "Cordialement ,<br><br>";
			mimeMessageHelper.setText(content);
			mimeMessageHelper.setText("<html><body><p>" + content + "</p> </body></html>", true);
			javaMailSender.send(mimeMessageHelper.getMimeMessage());
			success.put("response", true);
		} catch (MessagingException x) {
			x.printStackTrace();
			success.put("response", false);
		}
		return success;
	}
}
