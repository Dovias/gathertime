package lt.gathertime.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import lt.gathertime.server.model.enums.FreeTimeStatus;
import lt.gathertime.server.model.enums.PastimeType;

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
}
