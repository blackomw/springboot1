package sbs.frames;

import org.springframework.web.socket.WebSocketSession;

public class PlayerMsg {
	public static enum MsgType {
		Ready('0'), Start('1'), Click('2'),;

		private int type;

		MsgType(int type) {
			this.type = type;
		}

		public int getType() {
			return type;
		}
	}

	final int type;
	final WebSocketSession session;
	final String data;

	public PlayerMsg(int type, WebSocketSession session, String data) {
		this.type = type;
		this.session = session;
		this.data = data;
	}

	@Override
	public String toString() {
		return "PlayerMsg [type=" + type + ", session=" + session + ", data=" + data + "]";
	}

}
