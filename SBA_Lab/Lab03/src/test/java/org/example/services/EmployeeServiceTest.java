package org.example.services;

import org.example.entities.Employee;
import org.example.repositories.IEmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private IEmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    private Employee employee1;
    private Employee employee2;
    private Employee employee3;

    @BeforeEach
    void setUp() {
        employee1 = new Employee("E001", "Nguyen Van A", "Developer", 15000000.0);
        employee2 = new Employee("E002", "Tran Thi B", "Tester", 12000000.0);
        employee3 = new Employee("E003", "Le Van C", "Manager", 25000000.0);
    }

    @Test
    void getAllEmployees_ShouldDelegateToRepository() {
        List<Employee> employees = Arrays.asList(employee1, employee2, employee3);
        Page<Employee> page = new PageImpl<>(employees);
        Pageable pageable = PageRequest.of(0, 10);

        when(employeeRepository.findAll(pageable)).thenReturn(page);

        Page<Employee> result = employeeService.getAllEmployees(pageable);

        assertNotNull(result);
        assertEquals(3, result.getContent().size());
        assertEquals("E001", result.getContent().get(0).getEmpId());

        verify(employeeRepository, times(1)).findAll(pageable);
        verify(employeeRepository, only()).findAll(pageable);
    }

    @Test
    void getEmployeeById_ShouldDelegateToRepository() {
        when(employeeRepository.getEmployeeById("E001")).thenReturn(employee1);

        Employee result = employeeService.getEmployeeById("E001");

        assertNotNull(result);
        assertEquals("E001", result.getEmpId());
        assertEquals("Nguyen Van A", result.getName());

        verify(employeeRepository, times(1)).getEmployeeById("E001");
        verify(employeeRepository, only()).getEmployeeById("E001");
    }

    @Test
    void getEmployeeById_WhenNotFound_ShouldReturnNull() {
        when(employeeRepository.getEmployeeById("E999")).thenReturn(null);

        Employee result = employeeService.getEmployeeById("E999");

        assertNull(result);

        verify(employeeRepository, times(1)).getEmployeeById("E999");
    }

    @Test
    void createEmployee_ShouldDelegateToRepository() {
        when(employeeRepository.create(employee1)).thenReturn(employee1);

        Employee result = employeeService.createEmployee(employee1);

        assertNotNull(result);
        assertEquals("E001", result.getEmpId());
        assertEquals("Nguyen Van A", result.getName());

        verify(employeeRepository, times(1)).create(employee1);
        verify(employeeRepository, only()).create(employee1);
    }

    @Test
    void updateEmployee_ShouldDelegateToRepository() {
        Employee updatedEmployee = new Employee("E001", "Nguyen Van A Updated", "Senior Developer", 20000000.0);
        when(employeeRepository.update(eq("E001"), any(Employee.class))).thenReturn(updatedEmployee);

        Employee result = employeeService.updateEmployee("E001", updatedEmployee);

        assertNotNull(result);
        assertEquals("E001", result.getEmpId());
        assertEquals("Nguyen Van A Updated", result.getName());

        verify(employeeRepository, times(1)).update(eq("E001"), any(Employee.class));
        verify(employeeRepository, only()).update(eq("E001"), any(Employee.class));
    }

    @Test
    void updateEmployee_WhenNotFound_ShouldReturnNull() {
        Employee updatedEmployee = new Employee("E999", "Not Found", "Developer", 10000000.0);
        when(employeeRepository.update(eq("E999"), any(Employee.class))).thenReturn(null);

        Employee result = employeeService.updateEmployee("E999", updatedEmployee);

        assertNull(result);

        verify(employeeRepository, times(1)).update(eq("E999"), any(Employee.class));
    }

    @Test
    void deleteEmployee_ShouldDelegateToRepository() {
        when(employeeRepository.delete("E001")).thenReturn(true);

        boolean result = employeeService.deleteEmployee("E001");

        assertTrue(result);

        verify(employeeRepository, times(1)).delete("E001");
        verify(employeeRepository, only()).delete("E001");
    }

    @Test
    void deleteEmployee_WhenNotFound_ShouldReturnFalse() {
        when(employeeRepository.delete("E999")).thenReturn(false);

        boolean result = employeeService.deleteEmployee("E999");

        assertFalse(result);

        verify(employeeRepository, times(1)).delete("E999");
    }
}
