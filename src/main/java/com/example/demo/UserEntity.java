package com.example.demo;

public class UserEntity {
    int id;
    String name;

    UserEntity(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
