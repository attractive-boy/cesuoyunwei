package com.cesuoyunwei.backend.controller;

import com.cesuoyunwei.backend.model.MaintenanceRecord;
import com.cesuoyunwei.backend.repository.MaintenanceRecordRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {
    private final MaintenanceRecordRepository repo;

    public MaintenanceController(MaintenanceRecordRepository repo) { this.repo = repo; }

    @GetMapping
    public List<MaintenanceRecord> list() { return repo.findAll(); }

    @PostMapping
    public MaintenanceRecord create(@RequestBody MaintenanceRecord r) { return repo.save(r); }

    @GetMapping("/toilet/{toiletId}")
    public List<MaintenanceRecord> byToilet(@PathVariable Long toiletId) { return repo.findByToiletId(toiletId); }

    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportCsv() {
        var list = repo.findAll();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintWriter pw = new PrintWriter(baos, true, StandardCharsets.UTF_8);
        pw.println("id,toiletId,facilityIntact,hygiene,comfortScore,managementCompliance,serviceExtension,createdAt");
        for (var r : list) {
            pw.printf("%d,%d,%b,%s,%d,%s,%s,%s\n",
                    r.getId(), r.getToiletId(), r.getFacilityIntact(), r.getHygiene(),
                    r.getComfortScore() == null ? 0 : r.getComfortScore(), r.getManagementCompliance(), r.getServiceExtension(), r.getCreatedAt().toString());
        }
        pw.flush();
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=maintenance.csv")
                .body(baos.toByteArray());
    }
}
