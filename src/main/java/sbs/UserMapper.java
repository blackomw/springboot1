package sbs;


import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface UserMapper {
    @Select("select * from user where id=#{id}")
    UserEntity getUser(int id);

    @Select("select * from user")
    List<UserEntity> getAllUser();

    @Insert("insert into user (id,name) values (#{id}, #{name})")
    boolean addUserBy(@Param("id") int id, @Param("name") String name);
    @Insert("insert into user (id,name) values (#{id}, #{name})")
    boolean addUser(UserEntity userEntity);

    @Update("update user set name=#{name} where id=#{id}")
    boolean update(UserEntity userEntity);
}
