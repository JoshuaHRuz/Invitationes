package com.invitationes.backend.repositories;

import com.invitationes.backend.models.PageSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PageSettingRepository extends JpaRepository<PageSetting, Long> {
    List<PageSetting> findAllByEnabledTrueOrderByOrderIndexAsc();
}



