package com.lastdance.ziip.album.service;

import com.lastdance.ziip.album.dto.response.AlbumImageResponseDto;
import com.lastdance.ziip.album.dto.response.AlbumListResponseDto;
import com.lastdance.ziip.album.enums.ImageCategory;
import com.lastdance.ziip.diary.repository.DiaryPhotoRepository;
import com.lastdance.ziip.diary.repository.entity.DiaryPhoto;
import com.lastdance.ziip.diary.repository.entity.QDiaryPhoto;
import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.schedule.repository.SchedulePhotoRepository;
import com.lastdance.ziip.schedule.repository.entity.QSchedulePhoto;
import com.lastdance.ziip.schedule.repository.entity.SchedulePhoto;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AlbumServiceImpl implements AlbumService{

    private final JPAQueryFactory jpaQueryFactory;
    private final DiaryPhotoRepository diaryPhotoRepository;
    private final SchedulePhotoRepository schedulePhotoRepository;

    @Override
    public AlbumListResponseDto listAlbum(Member findMember, Long familyId) {

        QSchedulePhoto qSchedulePhoto = QSchedulePhoto.schedulePhoto;

        List<SchedulePhoto> schedulePhotos = jpaQueryFactory
                .selectFrom(qSchedulePhoto)
                .where(qSchedulePhoto.schedule.family.id.eq(familyId))
                .fetch();


        QDiaryPhoto qDiaryPhoto = QDiaryPhoto.diaryPhoto;

        List<DiaryPhoto> diaryPhotos = jpaQueryFactory
                .selectFrom(qDiaryPhoto)
                .where(qDiaryPhoto.diary.family.id.eq(familyId))
                .fetch();

        List<AlbumImageResponseDto> resultList = new ArrayList<>();

        for (SchedulePhoto schedulePhoto : schedulePhotos) {
            resultList.add(schedulePhotoToDto(schedulePhoto));
        }


        for (DiaryPhoto diaryPhoto : diaryPhotos) {
            resultList.add(diaryPhotoToDto(diaryPhoto));
        }

        Collections.sort(resultList, Comparator.comparing(AlbumImageResponseDto::getCreatedAt));

        AlbumListResponseDto albumListResponseDto = AlbumListResponseDto.builder()
                .images(resultList)
                .build();

        return albumListResponseDto;
    }

    // 스케줄 사진 dto화
    private AlbumImageResponseDto schedulePhotoToDto(SchedulePhoto schedulePhoto){
        return AlbumImageResponseDto.builder()
                .category(ImageCategory.SCHEDULE)
                .imgUrl(schedulePhoto.getImgUrl())
                .createdAt(schedulePhoto.getCreatedAt())
                .build();
    }

    // 일정 사진 dto화
    private AlbumImageResponseDto diaryPhotoToDto(DiaryPhoto diaryPhoto){
        return AlbumImageResponseDto.builder()
                .category(ImageCategory.DIARY)
                .imgUrl(diaryPhoto.getImgUrl())
                .createdAt(diaryPhoto.getCreatedAt())
                .build();
    }

}