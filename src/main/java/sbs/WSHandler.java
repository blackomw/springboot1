package sbs;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import sbs.frames.FrameThread;
import sbs.frames.PlayerMsg;

public class WSHandler extends TextWebSocketHandler implements HandshakeInterceptor {

	public static final ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

	@Override
	public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
			Map<String, Object> attributes) throws Exception {
		System.out.println("before Handshake " + request.getRemoteAddress());
		return true;
	}

	@Override
	public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
			Exception exception) {
		System.out.println("after Handshake");
	}

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
//		System.out.println(session.getRemoteAddress());
////		Map<String, String> map = JSONObject.parseObject(payload, HashMap.class);
//		System.out.println("handleTextMessage:" + session + " recv: " + payload);
//		session.sendMessage(new TextMessage("send: " + payload));
		sessions.putIfAbsent(session.getId(), session);
		String data = message.getPayload();
		FrameThread.Instance.putMsg(new PlayerMsg(data.charAt(0), session, data));
	}

	public static void broadcast() {
		sessions.forEach((id, session) -> {
			try {
				if (session.isOpen())
					session.sendMessage(new TextMessage("a"));
			} catch (IOException e) {
				e.printStackTrace();
			}
		});
	}

}
