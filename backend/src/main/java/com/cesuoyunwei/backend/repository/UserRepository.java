package com.cesuoyunwei.backend.repository;

import com.cesuoyunwei.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}
