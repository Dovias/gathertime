package lt.gathertime.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import lt.gathertime.server.model.Activity;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {  
}
