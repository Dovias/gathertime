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
    SELECT f FROM FreeTime f
    WHERE f.user.id = :userId
        AND f.startDateTime <= :endDateTime
        AND f.endDateTime >= :startDateTime
        AND f.status = 'FREE'
    """)
    public List<FreeTime> getFreeTimes(
        @Param("userId") Long userId, 
        @Param("startDateTime") LocalDateTime startDateTime, 
        @Param("endDateTime") LocalDateTime endDateTime);
}
