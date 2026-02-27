package com.cesuoyunwei.backend.controller;

import com.cesuoyunwei.backend.model.Toilet;
import com.cesuoyunwei.backend.repository.ToiletRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/toilets")
public class ToiletController {
    private final ToiletRepository repo;

    public ToiletController(ToiletRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Toilet> list() { return repo.findAll(); }

    @PostMapping
    public Toilet create(@RequestBody Toilet t) { return repo.save(t); }
}
