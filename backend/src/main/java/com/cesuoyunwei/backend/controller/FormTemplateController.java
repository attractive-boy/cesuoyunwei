package com.cesuoyunwei.backend.controller;

import com.cesuoyunwei.backend.model.FormTemplate;
import com.cesuoyunwei.backend.repository.FormTemplateRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/forms/templates")
public class FormTemplateController {
    private final FormTemplateRepository repo;

    public FormTemplateController(FormTemplateRepository repo) { this.repo = repo; }

    @GetMapping
    public List<FormTemplate> list() { return repo.findAll(); }

    @PostMapping
    public FormTemplate create(@RequestBody FormTemplate t) { return repo.save(t); }
}
