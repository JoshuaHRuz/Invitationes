package com.invitationes.backend.repositories;

import com.invitationes.backend.models.LandingSection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LandingSectionRepository extends JpaRepository<LandingSection, Long> {
    List<LandingSection> findAllByActiveTrueOrderByOrderIndexAsc();
}



