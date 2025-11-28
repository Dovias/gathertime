package lt.gathertime.server.repository;

import lt.gathertime.server.model.Meeting;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    @Query("""
        SELECT f.meeting FROM FreeTime f
        WHERE f.owner.id = :ownerId
    """)
    public List<Meeting> findAllByOwnerId(@Param("ownerId")Long ownerId);
}
