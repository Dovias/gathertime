package lt.gathertime.server.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import lt.gathertime.server.entity.Meeting;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    @Query("""
        SELECT m FROM Meeting m
        LEFT JOIN m.meetingParticipants p
        WHERE 
            p.id = :userId
            AND m.startDateTime >= :startDateTime
            AND m.endDateTime <= :endDateTime
        """)
    public List<Meeting> findUserMeetingsInRange(
        @Param("userId") Long userId,
        @Param("startDateTime") LocalDateTime startDateTime,
        @Param("endDateTime") LocalDateTime endDateTime
    );
}
