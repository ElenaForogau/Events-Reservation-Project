package com.project.EventsReservationProject.controller;

import com.project.EventsReservationProject.exception.UserAlreadyExistsException;
import com.project.EventsReservationProject.model.User;
import com.project.EventsReservationProject.request.LoginRequest;
import com.project.EventsReservationProject.security.jwt.JwtUtils;
import com.project.EventsReservationProject.response.JwtResponse;
import com.project.EventsReservationProject.service.AuditLogService;
import com.project.EventsReservationProject.security.user.EventUserDetails;
import com.project.EventsReservationProject.service.IUserSevice;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final IUserSevice userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    @Autowired
    private JavaMailSender mailSender;
    private final AuditLogService auditLogService;

    @PostMapping("/register-user")
    public ResponseEntity<?> registerUser(@RequestBody User user){
        try{
            User registeredUser = userService.registerUser(user);
            try {
                sendVerificationEmail(registeredUser);
                return ResponseEntity.ok("Registration successful! Please check your email to confirm your account.");
            } catch (Exception e) {
                return ResponseEntity.ok("User registered, but failed to send verification email.");
            }
        } catch (UserAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already in use.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed, please try again later.");
        }
    }

    private void sendVerificationEmail(User user) {
        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(user.getEmail());
        mailMessage.setSubject("Complete Registration!");
        mailMessage.setFrom("no-reply@yourdomain.com");
        mailMessage.setText("Hello! :)" +
                "To confirm your account, please click here : "
                + "http://localhost:5173/confirm-account?token=" + token);
        mailSender.send(mailMessage);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest request){
        Authentication authentication =
                authenticationManager
                        .authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtTokenForUser(authentication);
        EventUserDetails userDetails = (EventUserDetails) authentication.getPrincipal();

        User user = userService.getUser(userDetails.getEmail());
        user.setLastLogin(LocalDateTime.now());
        userService.saveUser(user);
        auditLogService.logEvent(user.getId(), "LOGIN");

        List<String> roles = userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority).toList();
        return ResponseEntity.ok(new JwtResponse(
                userDetails.getId(),
                userDetails.getEmail(),
                jwt,
                roles));
    }

    @GetMapping("/confirm-account")
    public ResponseEntity<?> confirmUserAccount(@RequestParam("token") String token) {
        User user = userService.findByVerificationToken(token);

        if (user == null) {
            return new ResponseEntity<>("The link is invalid or broken!", HttpStatus.BAD_REQUEST);
        } else {
            user.setEmailVerified(true);
            user.setVerificationToken(null);
            userService.registerUser(user);
            return ResponseEntity.ok("Account verified successfully!");
        }
    }

}