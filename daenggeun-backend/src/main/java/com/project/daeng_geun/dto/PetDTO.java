package com.project.daeng_geun.dto;

import com.project.daeng_geun.entity.Pet;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PetDTO {
    private String name;
    private Integer age;
    private String gender;
    private String breed;
    private String personality;

    public static PetDTO fromEntity(Pet pet) {
        return PetDTO.builder()
                .name(pet.getName())
                .age(pet.getAge())
                .gender(pet.getGender())
                .breed(pet.getBreed())
                .personality(pet.getPersonality())
                .build();
    }
}
