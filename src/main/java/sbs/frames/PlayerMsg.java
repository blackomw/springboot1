package sbs.frames;

import org.springframework.web.socket.WebSocketSession;

public class PlayerMsg {
	final int type;
	final WebSocketSession session;
	final String data;

	public PlayerMsg(int type, WebSocketSession session, String data) {
		this.type = type;
		this.session = session;
		this.data = data;
	}

}
