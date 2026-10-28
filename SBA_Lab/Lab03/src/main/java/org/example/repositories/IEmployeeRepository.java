package org.example.repositories;

import org.example.entities.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IEmployeeRepository {
    Page<Employee> findAll(Pageable pageable);
    Employee getEmployeeById(String id);
    Employee create(Employee employee);
    Employee update(String id, Employee employee);
    boolean delete(String id);
}
