package lt.gathertime.server.repository;

import lt.gathertime.server.model.FreeTime;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FreeTimeRepository extends JpaRepository<FreeTime, Long> {

    @Query("""
            SELECT f 
            FROM FreeTime f
            JOIN f.user u
            LEFT JOIN Friendship fs ON (fs.friend.id = u.id AND fs.user.id = :userId)
            WHERE f.user.id IN :friendIds
                AND f.status = 'FREE'
                AND f.startDateTime >= CURRENT_TIMESTAMP
            ORDER BY 
                FUNCTION('DATE', f.startDateTime),
                CASE WHEN fs.isBestFriends = true THEN 0 ELSE 1 END,
                f.startDateTime
            """)
    List<FreeTime> getFutureFreeTimesOfFriends(
        @Param("userId") Long userId,
        @Param("friendIds") List<Long> friendIds);

    @Query("""
            SELECT f
            FROM FreeTime f
            JOIN f.user friend
            LEFT JOIN Friendship fs ON (fs.friend.id = friend.id AND fs.user.id = :userId)
            JOIN FreeTime uft ON uft.user.id = :userId
            WHERE f.status = 'FREE'
                AND uft.status = 'FREE'
                AND f.startDateTime >= CURRENT_TIMESTAMP
                AND f.startDateTime < uft.endDateTime
                AND f.endDateTime > uft.startDateTime
                AND f.user.id IN :friendIds
            ORDER BY
                FUNCTION('DATE', f.startDateTime), 
                CASE WHEN fs.isBestFriends = true THEN 0 ELSE 1 END,
                f.startDateTime
            """)
    List<FreeTime> getOverlappingFutureFreeTimesOfFriends(
        @Param("userId") Long userId,
        @Param("friendIds") List<Long> friendIds);

    @Query("""
            SELECT f FROM FreeTime f
            WHERE f.user.id = :userId
                AND f.startDateTime <= :endDateTime
                AND f.endDateTime >= :startDateTime
                AND f.status = 'FREE'
            """)
    public List<FreeTime> getFreeTimesInRange(
            @Param("userId") Long userId,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime);
}
