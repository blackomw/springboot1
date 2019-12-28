package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/")
public class UserController {

    @Autowired
    UserMapper userMapper;
    
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String indexPage()
    {
    	return "index page1";
    }

    /**
     * 获取用户信息
     */
    @RequestMapping(value = "/getUser", method = RequestMethod.GET)
    public String getUser(@RequestParam(value = "id", defaultValue = "1") int id) {
        UserEntity b = userMapper.getUser(id);
        if (b != null)
            return b.getName();
        return "not exist";
    }

    @RequestMapping(value = "/addUser", method = RequestMethod.GET)
    public String addUser(@RequestParam(value = "id") int id,
                          @RequestParam(value = "name") String name) {
        if (id <= 0 || name == null || name.isEmpty())
            return "invalid params";
        if (userMapper.addUser(new UserEntity(id, name)))
            return name;
        return "add failed";
    }

    @RequestMapping(value = "/getAll", method = RequestMethod.GET)
    public List<UserEntity> getAllUser() {
        List<UserEntity> all = userMapper.getAllUser();
        return all;
    }
}
