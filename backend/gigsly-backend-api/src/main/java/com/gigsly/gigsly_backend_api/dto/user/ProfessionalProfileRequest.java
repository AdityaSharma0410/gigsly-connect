package com.gigsly.gigsly_backend_api.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class ProfessionalProfileRequest {

    @NotBlank(message = "Primary category is required")
    private String primaryCategory;

    @NotEmpty(message = "At least one skill is required")
    private List<String> skills;

    @NotNull(message = "Hourly rate is required")
    private BigDecimal hourlyRate;

    @NotBlank(message = "Bio is required")
    private String bio;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Phone is required")
    private String phone;

    public String getPrimaryCategory() {
        return primaryCategory;
    }

    public void setPrimaryCategory(String primaryCategory) {
        this.primaryCategory = primaryCategory;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public BigDecimal getHourlyRate() {
        return hourlyRate;
    }

    public void setHourlyRate(BigDecimal hourlyRate) {
        this.hourlyRate = hourlyRate;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}

