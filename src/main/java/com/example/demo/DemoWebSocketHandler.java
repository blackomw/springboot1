package com.example.demo;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class DemoWebSocketHandler extends TextWebSocketHandler {

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		String payload = message.getPayload();
//		Map<String, String> map = JSONObject.parseObject(payload, HashMap.class);
		System.out.println(session + " recv: " + payload);
		session.sendMessage(new TextMessage("send: " + payload));
	}
}
