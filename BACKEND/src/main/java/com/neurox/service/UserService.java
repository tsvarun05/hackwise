package com.neurox.service;

import com.neurox.entity.User;
import com.neurox.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Map<String, Object> register(Map<String, String> body) {
        String username = body.get("username");
        String email    = body.getOrDefault("email", "");
        String password = body.get("password");
        String name     = body.getOrDefault("name", username);

        log.info("Register request: username={} email={}", username, email);

        if (username == null || username.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is required");
        }
        if (password == null || password.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }

        // Check duplicate by username OR email
        if (userRepository.findByUsername(username).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }
        if (!email.isBlank() && userRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setEmail(email);
        user.setName(name);

        User saved = userRepository.save(user);
        log.info("Registered user id={} username={}", saved.getId(), saved.getUsername());
        return toResponse(saved);
    }

    public Map<String, Object> login(Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        log.info("Login request: username={}", username);

        if (username == null || username.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        if (password == null || password.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }

        // Try by username first, then by email (frontend sends email as username)
        Optional<User> found = userRepository.findByUsername(username);
        if (found.isEmpty()) {
            found = userRepository.findByEmail(username);
        }

        User user = found
                .filter(u -> u.getPassword().equals(password))
                .orElseThrow(() -> {
                    log.warn("Login failed for username={}", username);
                    return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
                });

        log.info("Login success: userId={}", user.getId());
        return toResponse(user);
    }

    private Map<String, Object> toResponse(User user) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", user.getId());
        map.put("username", user.getUsername());
        map.put("email", user.getEmail());
        map.put("name", user.getName() != null ? user.getName() : user.getUsername());
        map.put("token", "token-" + user.getId());
        return map;
    }
}
