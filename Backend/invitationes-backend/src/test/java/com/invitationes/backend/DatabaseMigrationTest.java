package com.invitationes.backend;

import com.invitationes.backend.models.User;
import com.invitationes.backend.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:mysql://localhost:3306/invitationes_test_db?createDatabaseIfNotExist=true",
    "spring.jpa.hibernate.ddl-auto=validate",
    "spring.flyway.clean-disabled=false"
})
public class DatabaseMigrationTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testDatabaseMigrationAndTestUsers() {
        System.out.println("[DEBUG_LOG] Starting database migration test");
        
        // Verify that test users were created
        List<User> allUsers = userRepository.findAll();
        System.out.println("[DEBUG_LOG] Found " + allUsers.size() + " users in database");
        
        // Should have at least 5 test users
        assertTrue(allUsers.size() >= 5, "Should have at least 5 test users");
        
        // Verify specific test users exist
        Optional<User> adminUser = userRepository.findByEmail("admin@invitationes.com");
        assertTrue(adminUser.isPresent(), "Admin user should exist");
        assertEquals("Administrator", adminUser.get().getName());
        System.out.println("[DEBUG_LOG] Admin user found: " + adminUser.get().getName());
        
        Optional<User> johnUser = userRepository.findByEmail("john.doe@example.com");
        assertTrue(johnUser.isPresent(), "John Doe user should exist");
        assertEquals("John Doe", johnUser.get().getName());
        System.out.println("[DEBUG_LOG] John Doe user found: " + johnUser.get().getName());
        
        Optional<User> janeUser = userRepository.findByEmail("jane.smith@example.com");
        assertTrue(janeUser.isPresent(), "Jane Smith user should exist");
        assertEquals("Jane Smith", janeUser.get().getName());
        System.out.println("[DEBUG_LOG] Jane Smith user found: " + janeUser.get().getName());
        
        // Verify password hashes are set (BCrypt hashes should start with $2a$)
        allUsers.forEach(user -> {
            assertNotNull(user.getPasswordHash(), "Password hash should not be null for user: " + user.getEmail());
            assertTrue(user.getPasswordHash().startsWith("$2a$"), "Password should be BCrypt hashed for user: " + user.getEmail());
            System.out.println("[DEBUG_LOG] User " + user.getEmail() + " has valid BCrypt password hash");
        });
        
        System.out.println("[DEBUG_LOG] Database migration test completed successfully");
    }
}