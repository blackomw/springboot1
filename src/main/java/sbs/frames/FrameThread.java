package sbs.frames;

import java.util.concurrent.ConcurrentLinkedQueue;

public class FrameThread extends Thread {
	public static final FrameThread Instance = new FrameThread();
	public static final long TICK_TIME = 50;
	private ConcurrentLinkedQueue<PlayerMsg> msgQueue = new ConcurrentLinkedQueue<>();
	private long curTime;
	private long lastTickTime;

	FrameThread() {
		super("FrameThread-0");
		curTime = System.currentTimeMillis();
	}

	public void putMsg(PlayerMsg msg) {
		msgQueue.add(msg);
	}

	@Override
	public void run() {
		while (true) {
			PlayerMsg msg;
			RoomMgr roomMgr = RoomMgr.Instance;
			while ((msg = msgQueue.poll()) != null) {
				try {
					roomMgr.handleMsg(msg);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			curTime = System.currentTimeMillis();
			if (curTime - lastTickTime >= TICK_TIME) {
				lastTickTime = curTime;
				roomMgr.tick();
			}
		}
	}
}
