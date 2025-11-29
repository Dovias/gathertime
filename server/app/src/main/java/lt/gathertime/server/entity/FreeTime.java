package lt.gathertime.server.entity;

import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import lt.gathertime.server.enums.FreeTimeStatus;
import lt.gathertime.server.enums.PastimeType;

@Entity
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Table(name = "free_time")
public class FreeTime extends TimeInterval {

    @Column(name = "public_for_all_friends")
    private Boolean publicForAllFriends;

    @Column(name = "pastime_type")
    @Enumerated(EnumType.STRING)
    private PastimeType pastimeType;

    @Enumerated(EnumType.STRING)
    private FreeTimeStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToMany
    @JoinTable(
        name = "momentary_interests",
        joinColumns = @JoinColumn(name = "free_time_id"),
        inverseJoinColumns = @JoinColumn(name = "activity_id")
    )
    private List<Activity> momentaryInterests;
}
