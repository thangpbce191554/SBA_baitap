package org.example.services;

import org.example.dtos.LoginUserDto;
import org.example.dtos.RegisterUserDto;
import org.example.entities.User;
import org.example.repositories.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public User signup(RegisterUserDto input) {
        if (userRepository.existsByEmail(input.getEmail())) {
            throw new IllegalStateException("Email already exists");
        }

        User user = new User();
        user.setFullName(input.getFullName().trim());
        user.setEmail(input.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(input.getPassword())); // Hash password bằng BCrypt

        return userRepository.save(user);
    }

    public User authenticate(LoginUserDto input) {
        // Xác thực email & password thông qua Spring Security Pipeline
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        return userRepository.findByEmail(input.getEmail())
                .orElseThrow();
    }
}
