package com.cesuoyunwei.backend.controller;

import com.cesuoyunwei.backend.service.BlobStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {
    private final BlobStorageService blobService;

    public UploadController(BlobStorageService blobService) { this.blobService = blobService; }

    @PostMapping
    public ResponseEntity<?> upload(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String data = body.get("data");
        if (name == null || data == null) return ResponseEntity.badRequest().body(Map.of("error","missing name or data"));
        String url = blobService.uploadBase64(name, data);
        return ResponseEntity.ok(Map.of("url", url));
    }
}
