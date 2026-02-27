package com.cesuoyunwei.backend.controller;

import com.cesuoyunwei.backend.model.FormSubmission;
import com.cesuoyunwei.backend.repository.FormSubmissionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forms/submissions")
public class FormSubmissionController {
    private final FormSubmissionRepository repo;

    public FormSubmissionController(FormSubmissionRepository repo) { this.repo = repo; }

    @GetMapping
    public List<FormSubmission> list() { return repo.findAll(); }

    @GetMapping("/{id}")
    public FormSubmission get(@PathVariable Long id) { return repo.findById(id).orElse(null); }

    @PostMapping
    public FormSubmission create(@RequestBody FormSubmission s) {
        return repo.save(s);
    }
}
