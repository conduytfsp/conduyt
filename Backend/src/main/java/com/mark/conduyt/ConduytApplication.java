package com.mark.conduyt;

import com.mark.conduyt.config.EnvConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ConduytApplication {

    public static void main(String[] args) {
        EnvConfig.get("DUMMY"); // triggers static block and loads .env
        SpringApplication.run(ConduytApplication.class, args);
    }

}
