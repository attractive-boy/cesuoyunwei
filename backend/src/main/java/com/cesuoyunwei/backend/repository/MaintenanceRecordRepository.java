package com.cesuoyunwei.backend.repository;

import com.cesuoyunwei.backend.model.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, Long> {
    List<MaintenanceRecord> findByToiletId(Long toiletId);
}
