package com.mark.conduyt;

import com.mark.conduyt.config.EnvConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ConduytApplication {

    public static void main(String[] args) {
        EnvConfig.get("DUMMY"); // triggers static block and loads .env
        SpringApplication.run(ConduytApplication.class, args);
    }

}
