package lt.gathertime.server.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import lt.gathertime.server.entity.Friendship;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    @Query("""
        SELECT f FROM Friendship f
        WHERE f.user.id = :userId
          AND f.friend.id = :userId2
        ORDER BY f.starDateTime DESC
    """)
    List<Friendship> getFriendshipsByUsersOrdered(
            @Param("userId") Long userId,
            @Param("userId2") Long userId2
    );

    default Optional<Friendship> getLatestFriendshipByUsers(Long userId, Long userId2) {
        return getFriendshipsByUsersOrdered(userId, userId2).stream().findFirst();
    }

    @Query("""
        SELECT f FROM Friendship f
        WHERE f.user.id = :userId
          AND f.status = 'NOT_CONFIRMED'
        ORDER BY f.starDateTime DESC
    """)
    List<Friendship> getFriendshipRequests(@Param("userId") Long userId);

    @Query("""
        SELECT f FROM Friendship f
        WHERE f.friend.id = :userId
          AND f.status = 'CONFIRMED'
    """)
    List<Friendship> getFriendships(@Param("userId") Long userId);
}
