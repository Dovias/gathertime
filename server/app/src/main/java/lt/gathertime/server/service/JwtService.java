package lt.gathertime.server.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private static final String SECRET_KEY = "404E635266556A586E327235753B782F413F4428472B4B6250645367566B5970";

    public String extractUsername(final String token) {
        return this.extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(final String token, final Function<Claims, T> claimsResolver){
        final Claims claims = this.extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(
            final UserDetails userDetails
    ){
        return this.generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(
            final Map<String, Object> extraClaims,
            final UserDetails userDetails
    ){
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 24))
                .signWith(this.getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(final String token, final UserDetails userDetails){
        final String username = this.extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !this.isTokenExpired(token);
    }

    private boolean isTokenExpired(final String token) {
        return this.extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(final String token) {
        return this.extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(final String token){
        return Jwts.parser()
                .setSigningKey(this.getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        final byte[] keyBytes = Decoders.BASE64.decode(JwtService.SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
