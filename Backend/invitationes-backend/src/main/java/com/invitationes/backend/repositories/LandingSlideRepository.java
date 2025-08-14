package com.invitationes.backend.repositories;

import com.invitationes.backend.models.LandingSlide;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LandingSlideRepository extends JpaRepository<LandingSlide, Long> {
    List<LandingSlide> findAllByActiveTrueOrderByOrderIndexAsc();
}



