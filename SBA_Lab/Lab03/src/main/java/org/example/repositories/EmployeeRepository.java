package org.example.repositories;

import org.example.entities.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class EmployeeRepository implements IEmployeeRepository {

    private final List<Employee> employeeList = new ArrayList<>();

    public EmployeeRepository() {
        // Dữ liệu mẫu ban đầu[cite: 4]
        employeeList.add(new Employee("E001", "Nguyen Van A", "Developer", 15000000.0));
        employeeList.add(new Employee("E002", "Tran Thi B", "Tester", 12000000.0));
        employeeList.add(new Employee("E003", "Le Van C", "Manager", 25000000.0));
    }

    @Override
    public Page<Employee> findAll(Pageable pageable) {
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), employeeList.size());

        if (start > employeeList.size()) {
            return new PageImpl<>(new ArrayList<>(), pageable, employeeList.size());
        }

        List<Employee> subList = employeeList.subList(start, end);
        return new PageImpl<>(subList, pageable, employeeList.size());
    }

    @Override
    public Employee getEmployeeById(String id) {
        return employeeList.stream()
                .filter(e -> e.getEmpId().equalsIgnoreCase(id))
                .findFirst()
                .orElse(null);
    }

    @Override
    public Employee create(Employee employee) {
        employeeList.add(employee);
        return employee;
    }

    @Override
    public Employee update(String id, Employee employee) {
        for (int i = 0; i < employeeList.size(); i++) {
            if (employeeList.get(i).getEmpId().equalsIgnoreCase(id)) {
                employee.setEmpId(id);
                employeeList.set(i, employee);
                return employee;
            }
        }
        return null;
    }

    @Override
    public boolean delete(String id) {
        return employeeList.removeIf(e -> e.getEmpId().equalsIgnoreCase(id));
    }
}