/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.funews.repository;

import com.funews.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Integer> {

    Optional<Tag> findByTagName(String tagName);

    @Query("SELECT COALESCE(MAX(t.tagId), 0) FROM Tag t")
    Integer findMaxTagId();
}

