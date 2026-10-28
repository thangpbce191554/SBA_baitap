package org.example.controller;


import org.example.entities.Employee;
import org.example.exceptions.EmployeeNotFoundException;
import org.example.services.IEmployeeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final IEmployeeService employeeService;

    // Inject Service thông qua Constructor (Spring Boot khuyên dùng)
    public EmployeeController(IEmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // 1. GET danh sách nhân viên có Paging & Sorting
    // Ví dụ: GET /api/employees?page=0&size=2&sortBy=name&direction=asc
    @GetMapping
    public ResponseEntity<Page<Employee>> getAllEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "empId") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        // Tạo đối tượng Sort (tăng dần asc hoặc giảm dần desc)
        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Employee> result = employeeService.getAllEmployees(pageable);

        return ResponseEntity.ok(result); // Trả về status 200 OK + JSON
    }

    // 2. GET nhân viên theo ID
    // Ví dụ: GET /api/employees/E001
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable String id) {
        Employee employee = employeeService.getEmployeeById(id);

        // Nếu không tìm thấy, ném Exception để GlobalExceptionHandler bắt và trả lỗi 404
        if (employee == null) {
            throw new EmployeeNotFoundException("Không tìm thấy nhân viên có mã: " + id);
        }

        return ResponseEntity.ok(employee); // Trả về status 200 OK
    }

    // 3. POST tạo mới nhân viên
    // Ví dụ: POST /api/employees với Body JSON
    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        Employee createdEmployee = employeeService.createEmployee(employee);

        // Trả về status 201 Created (theo đúng chuẩn RESTful API)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEmployee);
    }

    // 4. PUT cập nhật thông tin nhân viên
    // Ví dụ: PUT /api/employees/E001
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(
            @PathVariable String id,
            @RequestBody Employee employee) {

        Employee updatedEmployee = employeeService.updateEmployee(id, employee);
        if (updatedEmployee == null) {
            throw new EmployeeNotFoundException("Không tìm thấy nhân viên để cập nhật: " + id);
        }
        return ResponseEntity.ok(updatedEmployee);
    }

    // 5. DELETE xóa nhân viên
    // Ví dụ: DELETE /api/employees/E001
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable String id) {
        boolean isDeleted = employeeService.deleteEmployee(id);
        if (!isDeleted) {
            throw new EmployeeNotFoundException("Không tìm thấy nhân viên để xóa: " + id);
        }
        return ResponseEntity.noContent().build(); // Trả về status 204 No Content
    }
}
