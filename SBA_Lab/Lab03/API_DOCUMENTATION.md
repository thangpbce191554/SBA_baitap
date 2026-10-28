# Employee Management API Documentation

## Base URL
```
http://localhost:8080
```

## Endpoints

### 1. GET /api/employees - Lấy danh sách nhân viên (có phân trang & sắp xếp)

**Request:**
```
GET http://localhost:8080/api/employees?page=0&size=10&sortBy=empId&direction=asc
```

**Query Parameters:**
- `page` (optional, default: 0) - Số trang
- `size` (optional, default: 10) - Số lượng item mỗi trang
- `sortBy` (optional, default: empId) - Trường để sắp xếp (empId, name, designation, salary)
- `direction` (optional, default: asc) - Chiều sắp xếp (asc hoặc desc)

**Response (200 OK):**
```json
{
  "content": [
    {
      "empId": "E001",
      "name": "Nguyen Van A",
      "designation": "Developer",
      "salary": 15000000.0
    },
    {
      "empId": "E002",
      "name": "Tran Thi B",
      "designation": "Tester",
      "salary": 12000000.0
    },
    {
      "empId": "E003",
      "name": "Le Van C",
      "designation": "Manager",
      "salary": 25000000.0
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    }
  },
  "totalPages": 1,
  "totalElements": 3,
  "last": true,
  "first": true,
  "size": 10,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "numberOfElements": 3,
  "empty": false
}
```

---

### 2. GET /api/employees/{id} - Lấy nhân viên theo ID

**Request:**
```
GET http://localhost:8080/api/employees/E001
```

**Response (200 OK):**
```json
{
  "empId": "E001",
  "name": "Nguyen Van A",
  "designation": "Developer",
  "salary": 15000000.0
}
```

**Response (404 Not Found):**
```json
{
  "error": "Not Found",
  "message": "Không tìm thấy nhân viên có mã: E999"
}
```

---

### 3. POST /api/employees - Tạo nhân viên mới

**Request:**
```
POST http://localhost:8080/api/employees
Content-Type: application/json
```

**Body:**
```json
{
  "empId": "E004",
  "name": "Test User",
  "designation": "Developer",
  "salary": 18000000.0
}
```

**Response (201 Created):**
```json
{
  "empId": "E004",
  "name": "Test User",
  "designation": "Developer",
  "salary": 18000000.0
}
```

---

### 4. PUT /api/employees/{id} - Cập nhật nhân viên

**Request:**
```
PUT http://localhost:8080/api/employees/E001
Content-Type: application/json
```

**Body:**
```json
{
  "empId": "E001",
  "name": "Nguyen Van A Updated",
  "designation": "Senior Developer",
  "salary": 20000000.0
}
```

**Response (200 OK):**
```json
{
  "empId": "E001",
  "name": "Nguyen Van A Updated",
  "designation": "Senior Developer",
  "salary": 20000000.0
}
```

**Response (404 Not Found):**
```json
{
  "error": "Not Found",
  "message": "Không tìm thấy nhân viên để cập nhật: E999"
}
```

---

### 5. DELETE /api/employees/{id} - Xóa nhân viên

**Request:**
```
DELETE http://localhost:8080/api/employees/E001
```

**Response (204 No Content):**
```
(No body)
```

**Response (404 Not Found):**
```json
{
  "error": "Not Found",
  "message": "Không tìm thấy nhân viên để xóa: E999"
}
```

---

## Postman Collection Examples

### Example 1: Get all employees with pagination
- Method: GET
- URL: `http://localhost:8080/api/employees`
- Params: 
  - page: 0
  - size: 2
  - sortBy: name
  - direction: asc

### Example 2: Get employee by ID
- Method: GET
- URL: `http://localhost:8080/api/employees/E001`

### Example 3: Create new employee
- Method: POST
- URL: `http://localhost:8080/api/employees`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "empId": "E005",
  "name": "New Employee",
  "designation": "QA Engineer",
  "salary": 14000000.0
}
```

### Example 4: Update employee
- Method: PUT
- URL: `http://localhost:8080/api/employees/E001`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "empId": "E001",
  "name": "Updated Name",
  "designation": "Tech Lead",
  "salary": 30000000.0
}
```

### Example 5: Delete employee
- Method: DELETE
- URL: `http://localhost:8080/api/employees/E001`

---

## Notes

- Dữ liệu được lưu trong memory (ArrayList), sẽ reset khi restart server
- 3 nhân viên mẫu ban đầu:
  - E001: Nguyen Van A (Developer, 15,000,000)
  - E002: Tran Thi B (Tester, 12,000,000)
  - E003: Le Van C (Manager, 25,000,000)
- ID matching là case-insensitive (E001 = e001)
