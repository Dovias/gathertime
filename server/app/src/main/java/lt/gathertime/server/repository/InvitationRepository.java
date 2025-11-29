package lt.gathertime.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import lt.gathertime.server.entity.Invitation;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Long>{
}
