package org.example.controller;

import org.example.entities.Employee;
import org.example.services.IEmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EmployeeController.class)
class EmployeeControllerPagingSortingTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IEmployeeService employeeService;

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
    void getAllEmployees_WithPaging_ShouldReturnCorrectMetadata() throws Exception {
        List<Employee> employees = Arrays.asList(employee1, employee2);
        Page<Employee> page = new PageImpl<>(employees, PageRequest.of(0, 2), 3);
        
        when(employeeService.getAllEmployees(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/employees")
                .param("page", "0")
                .param("size", "2")
                .param("sortBy", "empId")
                .param("direction", "asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.totalElements").value(3))
                .andExpect(jsonPath("$.totalPages").value(2))
                .andExpect(jsonPath("$.number").value(0))
                .andExpect(jsonPath("$.size").value(2));

        verify(employeeService, times(1)).getAllEmployees(any(Pageable.class));
    }

    @Test
    void getAllEmployees_WithSortingAsc_ShouldReturnAscendingOrder() throws Exception {
        List<Employee> employees = Arrays.asList(employee1, employee2, employee3);
        Page<Employee> page = new PageImpl<>(employees);
        
        when(employeeService.getAllEmployees(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/employees")
                .param("page", "0")
                .param("size", "10")
                .param("sortBy", "name")
                .param("direction", "asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Nguyen Van A"))
                .andExpect(jsonPath("$.content[1].name").value("Tran Thi B"))
                .andExpect(jsonPath("$.content[2].name").value("Le Van C"));

        verify(employeeService, times(1)).getAllEmployees(any(Pageable.class));
    }

    @Test
    void getAllEmployees_WithSortingDesc_ShouldReturnDescendingOrder() throws Exception {
        List<Employee> employees = Arrays.asList(employee3, employee1, employee2);
        Page<Employee> page = new PageImpl<>(employees);
        
        when(employeeService.getAllEmployees(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/employees")
                .param("page", "0")
                .param("size", "10")
                .param("sortBy", "salary")
                .param("direction", "desc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].salary").value(25000000.0))
                .andExpect(jsonPath("$.content[1].salary").value(15000000.0))
                .andExpect(jsonPath("$.content[2].salary").value(12000000.0));

        verify(employeeService, times(1)).getAllEmployees(any(Pageable.class));
    }
}
