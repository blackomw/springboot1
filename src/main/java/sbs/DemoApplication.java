package sbs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) throws InterruptedException {
		System.out.println("1111111111111111");
		SpringApplication.run(DemoApplication.class, args);
		System.out.println("2222222222222222");

		while (true) {
			Thread.sleep(40 + (int) (Math.random() * 260));
			DemoWebSocketHandler.broadcast();
		}

	}
}
