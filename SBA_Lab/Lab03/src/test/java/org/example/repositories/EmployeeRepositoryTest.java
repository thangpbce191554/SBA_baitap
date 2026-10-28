package org.example.repositories;

import org.example.entities.Employee;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import static org.junit.jupiter.api.Assertions.*;

class EmployeeRepositoryTest {

    private EmployeeRepository employeeRepository;

    private Employee employee1;
    private Employee employee2;
    private Employee employee3;

    @BeforeEach
    void setUp() {
        employeeRepository = new EmployeeRepository();
        
        employee1 = new Employee("E001", "Nguyen Van A", "Developer", 15000000.0);
        employee2 = new Employee("E002", "Tran Thi B", "Tester", 12000000.0);
        employee3 = new Employee("E003", "Le Van C", "Manager", 25000000.0);
    }

    @Test
    void findAll_ShouldReturnAllEmployees() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Employee> result = employeeRepository.findAll(pageable);

        assertEquals(3, result.getContent().size());
        assertEquals(3, result.getTotalElements());
        assertEquals(1, result.getTotalPages());
    }

    @Test
    void findAll_WithPaging_ShouldReturnCorrectPage() {
        Pageable pageable = PageRequest.of(0, 2);
        Page<Employee> result = employeeRepository.findAll(pageable);

        assertEquals(2, result.getContent().size());
        assertEquals(3, result.getTotalElements());
        assertEquals(2, result.getTotalPages());
        assertEquals(0, result.getNumber());
        assertEquals(2, result.getSize());
    }

    @Test
    void findAll_WithPageBeyondSize_ShouldReturnEmptyPage() {
        Pageable pageable = PageRequest.of(10, 10);
        Page<Employee> result = employeeRepository.findAll(pageable);

        assertEquals(0, result.getContent().size());
        assertEquals(3, result.getTotalElements());
    }

    @Test
    void getEmployeeById_WhenExists_ShouldReturnEmployee() {
        Employee result = employeeRepository.getEmployeeById("E001");

        assertNotNull(result);
        assertEquals("E001", result.getEmpId());
        assertEquals("Nguyen Van A", result.getName());
        assertEquals("Developer", result.getDesignation());
        assertEquals(15000000.0, result.getSalary());
    }

    @Test
    void getEmployeeById_WhenNotFound_ShouldReturnNull() {
        Employee result = employeeRepository.getEmployeeById("E999");

        assertNull(result);
    }

    @Test
    void getEmployeeById_CaseInsensitive_ShouldReturnEmployee() {
        Employee result = employeeRepository.getEmployeeById("e001");

        assertNotNull(result);
        assertEquals("E001", result.getEmpId());
    }

    @Test
    void create_ShouldAddEmployeeToList() {
        Employee newEmployee = new Employee("E004", "Test User", "Developer", 18000000.0);
        
        Employee result = employeeRepository.create(newEmployee);

        assertNotNull(result);
        assertEquals("E004", result.getEmpId());
        
        Pageable pageable = PageRequest.of(0, 10);
        Page<Employee> allEmployees = employeeRepository.findAll(pageable);
        assertEquals(4, allEmployees.getTotalElements());
    }

    @Test
    void update_WhenExists_ShouldUpdateEmployee() {
        Employee updatedEmployee = new Employee("E001", "Nguyen Van A Updated", "Senior Developer", 20000000.0);
        
        Employee result = employeeRepository.update("E001", updatedEmployee);

        assertNotNull(result);
        assertEquals("E001", result.getEmpId());
        assertEquals("Nguyen Van A Updated", result.getName());
        assertEquals("Senior Developer", result.getDesignation());
        assertEquals(20000000.0, result.getSalary());
    }

    @Test
    void update_WhenNotFound_ShouldReturnNull() {
        Employee updatedEmployee = new Employee("E999", "Not Found", "Developer", 10000000.0);
        
        Employee result = employeeRepository.update("E999", updatedEmployee);

        assertNull(result);
    }

    @Test
    void update_CaseInsensitive_ShouldUpdateEmployee() {
        Employee updatedEmployee = new Employee("e001", "Nguyen Van A Updated", "Senior Developer", 20000000.0);
        
        Employee result = employeeRepository.update("e001", updatedEmployee);

        assertNotNull(result);
        assertEquals("e001", result.getEmpId());
    }

    @Test
    void delete_WhenExists_ShouldReturnTrue() {
        boolean result = employeeRepository.delete("E001");

        assertTrue(result);
        
        Pageable pageable = PageRequest.of(0, 10);
        Page<Employee> allEmployees = employeeRepository.findAll(pageable);
        assertEquals(2, allEmployees.getTotalElements());
    }

    @Test
    void delete_WhenNotFound_ShouldReturnFalse() {
        boolean result = employeeRepository.delete("E999");

        assertFalse(result);
    }

    @Test
    void delete_CaseInsensitive_ShouldDeleteEmployee() {
        boolean result = employeeRepository.delete("e001");

        assertTrue(result);
        
        Pageable pageable = PageRequest.of(0, 10);
        Page<Employee> allEmployees = employeeRepository.findAll(pageable);
        assertEquals(2, allEmployees.getTotalElements());
    }
}
