package sbs.frames;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;

import org.springframework.web.socket.WebSocketSession;

public class RoomMgr {
	static final RoomMgr Instance = new RoomMgr();

	int roomIdCounter; // 房间id计数器
	HashMap<Integer, Room> rooms = new HashMap<>(); // key:roomId
	HashMap<String, Integer> playerRoomIds = new HashMap<>(); // playerId=>roomId

	RoomMgr() {

	}

	public void tick() {
		rooms.forEach((__, room) -> room.tick());
	}

	public void handleMsg(PlayerMsg msg) throws IOException {
		int type = msg.type;
		WebSocketSession session = msg.session;
		if (type == '0') {
			Room room = rooms.get(autoJoin(session));
			if (room != null)
				room.noticePlayerInfo();
		} else {
			String playerId = session.getId();
			Integer roomId = playerRoomIds.get(playerId);
			Room room = roomId != null ? rooms.get(roomId) : null;
			if (room != null)
				room.playerAction(session, Byte.parseByte(msg.data));
		}
	}

	public int autoJoin(WebSocketSession session) {
		Integer roomId = playerRoomIds.get(session.getId());
		if (roomId != null)
			return roomId;
		roomId = joinRoom(session);
		return roomId > 0 ? roomId : createRoom(session);
	}

	public boolean isInRoom(WebSocketSession session) {
		return playerRoomIds.containsKey(session.getId());
	}

	public int createRoom(WebSocketSession session) {
		String playerId = session.getId();
		Integer roomId = playerRoomIds.get(playerId);
		Room room = roomId != null ? rooms.get(roomId) : null;
		if (room != null) {
			leaveRoom(room, session);
		}
		room = new Room(roomId = ++roomIdCounter);
		room.addPlayer(session);
		rooms.put(roomId, room);
		playerRoomIds.put(playerId, roomId);
		return roomId;
	}

	public void leaveRoom(WebSocketSession session) {
		String playerId = session.getId();
		Integer roomId = playerRoomIds.get(playerId);
		Room room = roomId != null ? rooms.get(roomId) : null;
		if (room != null) {
			leaveRoom(room, session);
		}
	}

	private void leaveRoom(Room room, WebSocketSession session) {
		room.removePlayer(session);
		playerRoomIds.remove(session.getId());
		if (room.getPlayerCount() == 0)
			rooms.remove(room.getId());
	}

	public int joinRoom(WebSocketSession session) {
		String playerId = session.getId();
		Integer roomId = playerRoomIds.get(playerId);
		Room room = roomId != null ? rooms.get(roomId) : null;
		if (room != null)
			leaveRoom(room, session);

		for (Iterator<Room> it = rooms.values().iterator(); it.hasNext();) {
			Room r = it.next();
			if (r.addPlayer(session)) {
				playerRoomIds.put(playerId, r.getId());
				return r.getId();
			}
		}
		return 0;
	}

}
