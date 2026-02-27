package com.cesuoyunwei.backend.controller;

import com.cesuoyunwei.backend.model.User;
import com.cesuoyunwei.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository repo;

    public UserController(UserRepository repo) { this.repo = repo; }

    @GetMapping
    public List<User> list() { return repo.findAll(); }

    @GetMapping("/{id}")
    public User get(@PathVariable Long id) { return repo.findById(id).orElse(null); }

    @PostMapping
    public User create(@RequestBody User u) { return repo.save(u); }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User u) {
        u.setId(id);
        return repo.save(u);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { repo.deleteById(id); }
}
