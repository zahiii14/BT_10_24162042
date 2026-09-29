package vn.iotstar.services;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.TestPropertySource;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
    "security.jwt.secret-key=3cfa76ef14937c1c0ea519f8fc057a80fcd04a7420f8e8bcd0a7567c272e007b",
    "security.jwt.expiration-time=3600000",
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MySQL",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect"
})
public class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    @Test
    public void testGenerateAndValidateTokenWithNimbus() {
        UserDetails userDetails = new User("24162042@student.hcmute.edu.vn", "123456", Collections.emptyList());

        // 1. Generate token using Nimbus JOSE + JWT
        String token = jwtService.generateToken(userDetails);
        assertNotNull(token);
        assertTrue(token.length() > 0);

        // 2. Extract username
        String username = jwtService.extractUsername(token);
        assertEquals("24162042@student.hcmute.edu.vn", username);

        // 3. Validate token
        boolean isValid = jwtService.isTokenValid(token, userDetails);
        assertTrue(isValid);

        // 4. Validate with wrong user
        UserDetails wrongUser = new User("other@hcmute.edu.vn", "123456", Collections.emptyList());
        assertFalse(jwtService.isTokenValid(token, wrongUser));
    }
}
