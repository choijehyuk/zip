package com.lastdance.ziip.member.repository.entity;

import com.lastdance.ziip.member.enums.Gender;
import com.lastdance.ziip.family.repository.entity.FamilyMember;
import com.lastdance.ziip.global.entity.BaseEntity;
import com.lastdance.ziip.member.enums.Role;
import com.lastdance.ziip.member.enums.SocialType;
import com.lastdance.ziip.plan.repository.entity.Plan;
import com.lastdance.ziip.schedule.repository.entity.ScheduleMember;
import com.lastdance.ziip.schedule.repository.entity.SchedulePhoto;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Member extends BaseEntity{

    @Id @GeneratedValue
    private Long id;

    private String email;

    @Enumerated(EnumType.STRING)
    private Gender gender;
    private String name;
    private String profileImgUrl;
    private String profileImgName;
    private String socialId;

    @Enumerated(EnumType.STRING)
    private SocialType socialType;
    @Enumerated(EnumType.STRING)
    private Role role;


    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    private List<FamilyMember> familyMembers;

    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    private List<ScheduleMember> scheduleMembers;

    @OneToOne(mappedBy = "member", fetch = FetchType.LAZY)
    private Plan plan;
}
