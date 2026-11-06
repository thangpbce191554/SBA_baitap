/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.hotel.repository;

import com.hotel.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Integer> {
}

