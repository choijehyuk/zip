package com.lastdance.ziip.schedule.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CalendarDayDiaryResponseDto {

    private Long diaryId;
    private Long memberId;
    private String memberName;
    private String title;
    private String content;

    List<CalendarDayCommentResponseDto> calendarDayCommentResponseDtoList;
}
