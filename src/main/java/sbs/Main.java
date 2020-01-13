package sbs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import sbs.frames.FrameThread;

@SpringBootApplication
public class Main {

	public static final Logger Log = LoggerFactory.getLogger("SBS");

	public static void main(String[] args) throws InterruptedException {
		Log.info("1111111111111111 {} {}", 3, 4);
		SpringApplication.run(Main.class, args);
		Log.info("2222222222222222 {}", 999);

		FrameThread.Instance.start();

		Thread.sleep(Long.MAX_VALUE);
//		while (true) {
//			Thread.sleep(40 + (int) (Math.random() * 260));
//			DemoWebSocketHandler.broadcast();
//		}

	}
}
