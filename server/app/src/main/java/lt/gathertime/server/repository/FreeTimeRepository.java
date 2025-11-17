package lt.gathertime.server.repository;

import lt.gathertime.server.model.FreeTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FreeTimeRepository extends JpaRepository<FreeTime, Long> {
}
