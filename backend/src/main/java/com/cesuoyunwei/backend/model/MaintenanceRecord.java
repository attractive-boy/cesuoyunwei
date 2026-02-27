package com.cesuoyunwei.backend.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "maintenance_records")
public class MaintenanceRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long toiletId;

    // Checklist fields
    private Boolean facilityIntact;
    private String hygiene;
    private Integer comfortScore;
    private String managementCompliance;
    private String serviceExtension;

    @Lob
    private String notes;

    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getToiletId() { return toiletId; }
    public void setToiletId(Long toiletId) { this.toiletId = toiletId; }
    public Boolean getFacilityIntact() { return facilityIntact; }
    public void setFacilityIntact(Boolean facilityIntact) { this.facilityIntact = facilityIntact; }
    public String getHygiene() { return hygiene; }
    public void setHygiene(String hygiene) { this.hygiene = hygiene; }
    public Integer getComfortScore() { return comfortScore; }
    public void setComfortScore(Integer comfortScore) { this.comfortScore = comfortScore; }
    public String getManagementCompliance() { return managementCompliance; }
    public void setManagementCompliance(String managementCompliance) { this.managementCompliance = managementCompliance; }
    public String getServiceExtension() { return serviceExtension; }
    public void setServiceExtension(String serviceExtension) { this.serviceExtension = serviceExtension; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
