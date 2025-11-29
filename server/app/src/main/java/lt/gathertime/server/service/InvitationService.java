package lt.gathertime.server.service;

import java.util.List;

import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lt.gathertime.server.dto.invitation.InvitationRequestDTO;
import lt.gathertime.server.dto.invitation.InvitationResponseDTO;
import lt.gathertime.server.entity.Invitation;
import lt.gathertime.server.entity.Meeting;
import lt.gathertime.server.entity.User;
import lt.gathertime.server.enums.InvitationStatus;
import lt.gathertime.server.mapper.InvitationMapper;
import lt.gathertime.server.repository.InvitationRepository;
import lt.gathertime.server.repository.MeetingRepository;
import lt.gathertime.server.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class InvitationService {

    private final InvitationRepository invitationRepository;
    private final MeetingRepository meetingRepository;
    private final UserRepository userRepository;

    @Transactional
    public void createInvitation(InvitationRequestDTO dto) {
        Meeting meeting = meetingRepository.findById(dto.getMeetingId())
                .orElseThrow(() -> new EntityNotFoundException("Meeting not found"));

        User inviter = userRepository.findById(dto.getInviterId())
                .orElseThrow(() -> new EntityNotFoundException("Inviter not found"));

        User invitee = userRepository.findById(dto.getInviteeId())
                .orElseThrow(() -> new EntityNotFoundException("Invitee not found"));

        Invitation invitation = InvitationMapper.fromRequest(dto, meeting, inviter, invitee);
        invitationRepository.save(invitation);
    }

    public List<InvitationResponseDTO> getInvitationsForUser(Long userId) {
        return invitationRepository.findAll()
                .stream()
                .filter(i -> i.getInvitee().getId().equals(userId))
                .filter(i -> i.getStatus() == InvitationStatus.SENT)
                .map(InvitationMapper::toResponse)
                .toList();
    }
}
