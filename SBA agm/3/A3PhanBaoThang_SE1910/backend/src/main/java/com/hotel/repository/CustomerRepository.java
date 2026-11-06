/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.hotel.repository;

import com.hotel.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    Optional<Customer> findByEmailAddress(String emailAddress);

    boolean existsByEmailAddress(String emailAddress);

    boolean existsByEmailAddressAndCustomerIdNot(String emailAddress, Integer customerId);

    // Tìm kiếm khách hàng theo tên, email hoặc số điện thoại
    @Query("SELECT c FROM Customer c WHERE " +
           "LOWER(c.customerFullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.emailAddress) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "c.telephone LIKE CONCAT('%', :keyword, '%')")
    List<Customer> searchCustomers(@Param("keyword") String keyword);
}

