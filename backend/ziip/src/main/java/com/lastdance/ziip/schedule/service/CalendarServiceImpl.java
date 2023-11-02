package com.lastdance.ziip.schedule.service;

import com.lastdance.ziip.diary.repository.DiaryCommentRepository;
import com.lastdance.ziip.diary.repository.DiaryRepository;
import com.lastdance.ziip.diary.repository.entity.Diary;
import com.lastdance.ziip.diary.repository.entity.DiaryComment;
import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.plan.repository.PlanRepository;
import com.lastdance.ziip.plan.repository.entity.Plan;
import com.lastdance.ziip.schedule.dto.request.CalendarDayRequestDto;
import com.lastdance.ziip.schedule.dto.response.*;
import com.lastdance.ziip.schedule.repository.ScheduleRepository;
import com.lastdance.ziip.schedule.repository.entity.QSchedule;
import com.lastdance.ziip.schedule.repository.entity.Schedule;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CalendarServiceImpl implements CalendarService {

    private final ScheduleRepository scheduleRepository;
    private final JPAQueryFactory jpaQueryFactory;
    private final PlanRepository planRepository;
    private final DiaryRepository diaryRepository;
    private final DiaryCommentRepository diaryCommentRepository;

    public CalendarYearResponseDto yearCalendar(Member findMember, int year) {
        LocalDate startOfYear = LocalDate.of(year, 1, 1);
        LocalDate endOfYear = LocalDate.of(year, 12, 31);

        QSchedule qSchedule = QSchedule.schedule;

        List<Schedule> schedules = jpaQueryFactory
                .selectFrom(qSchedule)
                .where(qSchedule.startDate.between(startOfYear, endOfYear))
                .fetch();

        List<CalendarYearScheduleResponseDto> calendarYearScheduleResponseDtos = schedules.stream()
                .map(schedule -> toDto(schedule))
                .collect(Collectors.toList());

        CalendarYearResponseDto calendarYearResponseDto = CalendarYearResponseDto.builder()
                .calendarYearScheduleResponseDtoList(calendarYearScheduleResponseDtos)
                .build();

        return calendarYearResponseDto;
    }

    @Override
    public CalendarDayResponseDto dayCalendar(Member findMember, CalendarDayRequestDto calendarDayRequestDto) {
        // 해당하는 날짜의 스케줄 조회 및 스케줄의 플랜 조회
        List<CalendarDayScheduleResponseDto> calendarDayScheduleResponseDtoList =
                scheduleRepository.findAllByStartDate(calendarDayRequestDto.getTodayDateAsLocalDate())
                        .stream()
                        .flatMap(schedule -> planRepository.findAllBySchedule(Optional.ofNullable(schedule)).stream())
                        .map(plan -> CalendarDayScheduleResponseDto.builder()
                                .planId(plan.getId())
                                .name(plan.getTitle())
                                .build())
                        .collect(Collectors.toList());

        LocalDate inputDate = LocalDate.parse(calendarDayRequestDto.getTodayDate());
        LocalDateTime startOfDay = inputDate.atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        // 해당 일자의 다이어리 조회 및 다이어리의 코멘트 조회
        List<CalendarDayDiaryResponseDto> calendarDayDiaryResponseDtos =
                diaryRepository.findAllByCreatedAtBetween(startOfDay, endOfDay)
                        .stream()
                        .map(diary -> {
                            List<CalendarDayCommentResponseDto> calendarDayCommentResponseDtoList =
                                    diaryCommentRepository.findAllByDiary(diary)
                                            .stream()
                                            .map(diaryComment -> CalendarDayCommentResponseDto.builder()
                                                    .memberId(diaryComment.getMember().getId())
                                                    .profileImgUrl(diaryComment.getMember().getProfileImgUrl())
                                                    .content(diaryComment.getContent())
                                                    .build())
                                            .collect(Collectors.toList());

                            return CalendarDayDiaryResponseDto.builder()
                                    .diaryId(diary.getId())
                                    .memberId(diary.getMember().getId())
                                    .memberName(diary.getMember().getName())
                                    .title(diary.getTitle())
                                    .content(diary.getContent())
                                    .calendarDayCommentResponseDtoList(calendarDayCommentResponseDtoList)
                                    .build();
                        })
                        .collect(Collectors.toList());

        CalendarDayResponseDto calendarDayResponseDto = CalendarDayResponseDto.builder()
                .calendarDayScheduleResponseDtoList(calendarDayScheduleResponseDtoList)
                .calendarDayDiaryResponseDtos(calendarDayDiaryResponseDtos)
                .build();

        return calendarDayResponseDto;
    }


    private CalendarYearScheduleResponseDto toDto(Schedule schedule) {

        List<CalendarYearPlanResponseDto> calendarYearPlanResponseDtoList = schedule.getPlans()
                .stream()
                .map(this::toPlanDto)
                .collect(Collectors.toList());

        return CalendarYearScheduleResponseDto.builder()
                .scheduleId(schedule.getId())
                .familyId(schedule.getFamily().getId())
                .memberId(schedule.getMember().getId())
                .title(schedule.getTitle())
                .startDate(schedule.getStartDate().toString())
                .endDate(schedule.getEndDate().toString())
                .calendarYearPlanResponseDtoList(calendarYearPlanResponseDtoList)
                .build();
    }

    private CalendarYearPlanResponseDto toPlanDto(Plan plan) {
        return CalendarYearPlanResponseDto.builder()
                .planId(plan.getId())
                .memberId(plan.getMember().getId())
                .statusCode(plan.getStatusCode().getId())
                .title(plan.getTitle())
                .build();
    }


}
