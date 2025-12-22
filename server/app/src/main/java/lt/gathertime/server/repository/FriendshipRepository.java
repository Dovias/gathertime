package lt.gathertime.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import lt.gathertime.server.entity.Friendship;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    
    @Query("""
    SELECT f FROM Friendship f
    WHERE f.friend.id = :userId
        AND f.isConfirmed = false
    """)
    List<Friendship> getFriendshipRequests(
            @Param("userId") Long userId);

    @Query("""
    SELECT f FROM Friendship f
    WHERE f.user.id = :userId
        AND f.isConfirmed = true
    """)
    List<Friendship> getFriendships(
            @Param("userId") Long userId);
}
