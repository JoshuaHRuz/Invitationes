package com.invitationes.backend.repositories;

import com.invitationes.backend.models.ContentBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContentBlockRepository extends JpaRepository<ContentBlock, Long> {
    List<ContentBlock> findAllByPageAndActiveTrueOrderByOrderIndexAsc(String page);
    List<ContentBlock> findAllByPageOrderByOrderIndexAsc(String page);
}



