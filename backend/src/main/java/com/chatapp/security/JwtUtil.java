package com.chatapp.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.util.Base64;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {
    // Secure base64 key for HS512 (generated)
    private final String jwtSecret = "Qk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3Rk1vQ2p3";
    private final long jwtExpirationMs = 86400000; // 1 day
    private final SecretKey key;

    public JwtUtil() {
        byte[] keyBytes = Base64.getDecoder().decode(jwtSecret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
