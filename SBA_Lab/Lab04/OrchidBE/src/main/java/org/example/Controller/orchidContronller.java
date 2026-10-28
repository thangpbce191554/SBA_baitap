package org.example.Controller;

import org.example.Entities.orchid;
import org.example.Services.orchidServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class orchidContronller {
    @Autowired
    orchidServices services;

    @RequestMapping("/orchids")
    @ResponseBody
    public List<orchid> showOrchid(Model model) {
        List<orchid> list = services.findAll();

        // Sắp xếp theo tên (alphabet)
        list.sort((s1, s2) -> {
            int name1 = s1.getId();
            int name2 = s2.getId();
//            if (name1 == null && name2 == null) return 0;
//            if (name1 == null) return 1;
//            if (name2 == null) return -1;
            return Integer.compare(name1, name2);
        });
//
//        // Nếu muốn sắp xếp theo tuổi thì thay bằng:
//        // list.sort(Comparator.comparingInt(Staff::getAge));
//
//        // Nếu muốn sắp xếp theo nhiều tiêu chí (tên rồi đến tuổi):
//        // list.sort(Comparator.comparing(Staff::getStaffName)
//        //                     .thenComparingInt(Staff::getAge));

        model.addAttribute("List", list);
        //return "ListTour";
        return list;
    }
    @DeleteMapping("orchids/{id}")
    public ResponseEntity<Void> deleteOrchid(@PathVariable("id") int id) {
        try {
            services.deleteOrchid(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("orchids")
    public ResponseEntity<orchid> addOrchid(@RequestBody orchid orchid) {
        orchid savedOrchid = services.saveOrchid(orchid);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrchid);
    }

    @PutMapping("orchids/{id}")
    public ResponseEntity<orchid> updateOrchid(@PathVariable("id") int id, @RequestBody orchid orchidDetails) {
        try {
            orchid updatedOrchid = services.updateOrchid(id, orchidDetails);
            return ResponseEntity.ok(updatedOrchid);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("orchids/{id}")
    public ResponseEntity<orchid> getOrchidById(@PathVariable("id") int id) {
        try {
            orchid orchid = services.findById(id);
            return ResponseEntity.ok(orchid);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("orchids/search")
    public List<orchid> searchOrchids(@RequestParam("name") String name) {
        return services.searchByName(name);
    }

}
