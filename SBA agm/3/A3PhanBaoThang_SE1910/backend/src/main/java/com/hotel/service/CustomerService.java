/**
 * Phan Bảo Thắng
 * SE1910
 */
package com.hotel.service;

import com.hotel.dto.CustomerDTO;
import com.hotel.entity.Customer;
import com.hotel.repository.BookingReservationRepository;
import com.hotel.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BookingReservationRepository bookingReservationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<CustomerDTO> getAllCustomers(String keyword) {
        List<Customer> list = StringUtils.hasText(keyword)
                ? customerRepository.searchCustomers(keyword.trim())
                : customerRepository.findAll();
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public CustomerDTO getCustomerById(Integer id) {
        Customer c = customerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy khách hàng!"));
        return toDTO(c);
    }

    @Transactional
    public CustomerDTO createCustomer(CustomerDTO dto) {
        if (customerRepository.existsByEmailAddress(dto.getEmailAddress().trim())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email đã tồn tại trong hệ thống!");
        }

        Customer c = new Customer();
        c.setCustomerFullName(dto.getCustomerFullName().trim());
        c.setTelephone(dto.getTelephone() != null ? dto.getTelephone().trim() : "");
        c.setEmailAddress(dto.getEmailAddress().trim());
        c.setCustomerBirthday(dto.getCustomerBirthday());
        c.setCustomerStatus(dto.getCustomerStatus() != null ? dto.getCustomerStatus() : (byte) 1);

        String rawPass = StringUtils.hasText(dto.getPassword()) ? dto.getPassword().trim() : "@1";
        c.setPassword(passwordEncoder.encode(rawPass));

        Customer saved = customerRepository.save(c);
        return toDTO(saved);
    }

    @Transactional
    public CustomerDTO updateCustomer(Integer id, CustomerDTO dto) {
        Customer c = customerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy khách hàng!"));

        if (customerRepository.existsByEmailAddressAndCustomerIdNot(dto.getEmailAddress().trim(), id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email này đã được dùng bởi khách hàng khác!");
        }

        c.setCustomerFullName(dto.getCustomerFullName().trim());
        c.setTelephone(dto.getTelephone() != null ? dto.getTelephone().trim() : "");
        c.setEmailAddress(dto.getEmailAddress().trim());
        c.setCustomerBirthday(dto.getCustomerBirthday());
        if (dto.getCustomerStatus() != null) {
            c.setCustomerStatus(dto.getCustomerStatus());
        }

        if (StringUtils.hasText(dto.getPassword())) {
            c.setPassword(passwordEncoder.encode(dto.getPassword().trim()));
        }

        Customer updated = customerRepository.save(c);
        return toDTO(updated);
    }

    @Transactional
    public void deleteCustomer(Integer id) {
        Customer c = customerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy khách hàng!"));

        // Ràng buộc: Chặn xóa nếu khách hàng đã từng có giao dịch đặt phòng
        boolean hasBookings = !bookingReservationRepository.findByCustomerIdOrderByBookingDateDesc(id).isEmpty();
        if (hasBookings) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                    "Không thể xóa khách hàng [" + c.getCustomerFullName() + "] vì đã có lịch sử đặt phòng trong hệ thống!");
        }

        customerRepository.deleteById(id);
    }

    private CustomerDTO toDTO(Customer c) {
        CustomerDTO dto = new CustomerDTO();
        dto.setCustomerId(c.getCustomerId());
        dto.setCustomerFullName(c.getCustomerFullName());
        dto.setTelephone(c.getTelephone());
        dto.setEmailAddress(c.getEmailAddress());
        dto.setCustomerBirthday(c.getCustomerBirthday());
        dto.setCustomerStatus(c.getCustomerStatus());
        dto.setPassword(null); // Không trả mật khẩu ra client
        return dto;
    }
}

