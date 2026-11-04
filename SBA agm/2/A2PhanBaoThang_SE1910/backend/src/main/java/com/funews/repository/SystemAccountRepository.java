/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.funews.repository;

import com.funews.entity.SystemAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SystemAccountRepository extends JpaRepository<SystemAccount, Short> {

    Optional<SystemAccount> findByAccountEmail(String accountEmail);

    boolean existsByAccountEmail(String accountEmail);

    @Query("SELECT a FROM SystemAccount a WHERE " +
           "LOWER(a.accountName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.accountEmail) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<SystemAccount> searchAccounts(@Param("keyword") String keyword);

    @Query("SELECT COALESCE(MAX(a.accountId), 0) FROM SystemAccount a")
    Short findMaxAccountId();
}

