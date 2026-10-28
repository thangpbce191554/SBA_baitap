package org.example.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.entities.Employee;
import org.example.exceptions.EmployeeNotFoundException;
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
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EmployeeController.class)
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

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
    void getAllEmployees_ShouldReturn200OKAndEmployeeList() throws Exception {
        List<Employee> employees = Arrays.asList(employee1, employee2, employee3);
        Page<Employee> page = new PageImpl<>(employees);
        
        when(employeeService.getAllEmployees(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/employees")
                .param("page", "0")
                .param("size", "10")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(3))
                .andExpect(jsonPath("$.content[0].empId").value("E001"))
                .andExpect(jsonPath("$.content[0].name").value("Nguyen Van A"))
                .andExpect(jsonPath("$.totalElements").value(3))
                .andExpect(jsonPath("$.totalPages").value(1));

        verify(employeeService, times(1)).getAllEmployees(any(Pageable.class));
    }

    @Test
    void getEmployeeById_WhenExists_ShouldReturn200OK() throws Exception {
        when(employeeService.getEmployeeById("E001")).thenReturn(employee1);

        mockMvc.perform(get("/api/employees/E001")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.empId").value("E001"))
                .andExpect(jsonPath("$.name").value("Nguyen Van A"))
                .andExpect(jsonPath("$.designation").value("Developer"))
                .andExpect(jsonPath("$.salary").value(15000000.0));

        verify(employeeService, times(1)).getEmployeeById("E001");
    }

    @Test
    void getEmployeeById_WhenNotFound_ShouldReturn404() throws Exception {
        when(employeeService.getEmployeeById("E999")).thenReturn(null);

        mockMvc.perform(get("/api/employees/E999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(employeeService, times(1)).getEmployeeById("E999");
    }

    @Test
    void createEmployee_ShouldReturn201Created() throws Exception {
        Employee newEmployee = new Employee("E004", "Test User", "Developer", 18000000.0);
        
        when(employeeService.createEmployee(any(Employee.class))).thenReturn(newEmployee);

        mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newEmployee)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.empId").value("E004"))
                .andExpect(jsonPath("$.name").value("Test User"))
                .andExpect(jsonPath("$.designation").value("Developer"))
                .andExpect(jsonPath("$.salary").value(18000000.0));

        verify(employeeService, times(1)).createEmployee(any(Employee.class));
    }

    @Test
    void updateEmployee_WhenExists_ShouldReturn200OK() throws Exception {
        Employee updatedEmployee = new Employee("E001", "Nguyen Van A Updated", "Senior Developer", 20000000.0);
        
        when(employeeService.updateEmployee(eq("E001"), any(Employee.class))).thenReturn(updatedEmployee);

        mockMvc.perform(put("/api/employees/E001")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedEmployee)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.empId").value("E001"))
                .andExpect(jsonPath("$.name").value("Nguyen Van A Updated"))
                .andExpect(jsonPath("$.designation").value("Senior Developer"))
                .andExpect(jsonPath("$.salary").value(20000000.0));

        verify(employeeService, times(1)).updateEmployee(eq("E001"), any(Employee.class));
    }

    @Test
    void updateEmployee_WhenNotFound_ShouldReturn404() throws Exception {
        Employee updatedEmployee = new Employee("E999", "Not Found", "Developer", 10000000.0);
        
        when(employeeService.updateEmployee(eq("E999"), any(Employee.class))).thenReturn(null);

        mockMvc.perform(put("/api/employees/E999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedEmployee)))
                .andExpect(status().isNotFound());

        verify(employeeService, times(1)).updateEmployee(eq("E999"), any(Employee.class));
    }

    @Test
    void deleteEmployee_WhenExists_ShouldReturn204NoContent() throws Exception {
        when(employeeService.deleteEmployee("E001")).thenReturn(true);

        mockMvc.perform(delete("/api/employees/E001")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(employeeService, times(1)).deleteEmployee("E001");
    }

    @Test
    void deleteEmployee_WhenNotFound_ShouldReturn404() throws Exception {
        when(employeeService.deleteEmployee("E999")).thenReturn(false);

        mockMvc.perform(delete("/api/employees/E999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(employeeService, times(1)).deleteEmployee("E999");
    }
}
