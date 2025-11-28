package lt.gathertime.server.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lt.gathertime.server.model.enums.PastimeType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "free_time")
public class FreeTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "start_date_time")
    private LocalDateTime startDateTime;

    @Column(name = "end_date_time")
    private LocalDateTime endDateTime;

    @Column(name = "public_for_all_friends")
    private Boolean publicForAllFriends;

    @Column(name = "pastime_type")
    @Enumerated(EnumType.STRING)
    private PastimeType pastimeType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_id", unique = true)
    private Meeting meeting;

    @ManyToMany
    @JoinTable(
        name = "momentary_interests",
        joinColumns = @JoinColumn(name = "free_time_id"),
        inverseJoinColumns = @JoinColumn(name = "activity_id")
    )
    private List<Activity> momentaryInterests;
}
