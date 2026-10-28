package org.example.services;

import org.example.entities.Employee;
import org.example.repositories.IEmployeeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService implements IEmployeeService {

    private final IEmployeeRepository employeeRepository;

    // Inject Repository thông qua Constructor
    // Giúp việc viết Unit Test với Mockito (@InjectMocks) dễ dàng và sạch sẽ
    public EmployeeService(IEmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public Page<Employee> getAllEmployees(Pageable pageable) {
        return employeeRepository.findAll(pageable);
    }

    @Override
    public Employee getEmployeeById(String id) {
        return employeeRepository.getEmployeeById(id);
    }

    @Override
    public Employee createEmployee(Employee employee) {
        return employeeRepository.create(employee);
    }

    @Override
    public Employee updateEmployee(String id, Employee employee) {
        return employeeRepository.update(id, employee);
    }

    @Override
    public boolean deleteEmployee(String id) {
        return employeeRepository.delete(id);
    }
}