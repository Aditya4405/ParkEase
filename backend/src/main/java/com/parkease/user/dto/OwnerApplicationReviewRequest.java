package com.parkease.user.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OwnerApplicationReviewRequest {

    private String reviewNotes;
}
