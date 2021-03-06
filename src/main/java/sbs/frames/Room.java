package sbs.frames;

import java.io.IOException;
import java.util.ArrayList;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

public class Room {
	public static final int PLAYERS = 1;

	public static enum PlayerState { // Ready->Start->End->Ready
		Ready(0), Start(1), End(3);

		private int state;

		PlayerState(int state) {
			this.state = state;
		}

		public int getState() {
			return state;
		}
	}

	private class Frame {
		final int idx;
		byte[] op = new byte[PLAYERS];

		Frame(int idx) {
			this.idx = idx;
		}
	}

	private class FramePlayer {
		int idx;
		WebSocketSession session;
		PlayerState state;

		public FramePlayer(int idx, WebSocketSession session) {
			this.idx = idx;
			this.session = session;
			this.state = PlayerState.Ready;
		}
	}

	private final int id; // 房间id
	private int idx; // 当前帧数
	private Frame cur; // 当前帧
	private ArrayList<Frame> frames = new ArrayList<>(); // 所有帧数据
	private ArrayList<FramePlayer> players = new ArrayList<>(PLAYERS); // 房间内的玩家
	private int playerIdxCounter; // 房间内玩家索引计数器
	private int clientSeed; // 客户端障碍物随机种子

	public Room(int id) {
		this.id = id;
		this.clientSeed = allocClientSeed();
	}

	public int getId() {
		return id;
	}

	public void tick() {
		int n = players.size();
		if (n < PLAYERS)
			return;
		for (int i = 0; i < n; ++i) {
			if (players.get(i).state != PlayerState.Start)
				return;
		}

		if (cur == null)
			cur = new Frame(idx);
		frames.add(cur);
		sendFrame(cur);

		++idx;
		cur = new Frame(idx);
	}

	void sendFrame(Frame f) {
		StringBuilder sb = new StringBuilder(50);
		sb.append('f').append(f.idx).append(';');
		int n = players.size();
		for (int i = 0; i < n; ++i) {
			sb.append(players.get(i).idx).append(',').append(f.op[i]).append(';');
		}
		try {
			broadcast(new TextMessage(sb.toString()));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void playerReady(WebSocketSession session) {
		for (int i = 0, n = players.size(); i < n; ++i) {
			FramePlayer fp = players.get(i);
			if (fp.session == session && fp.state == PlayerState.End) {
				fp.state = PlayerState.Ready;
				break;
			}
		}
		reset();
	}

	public void playerStart(WebSocketSession session) {
		for (int i = 0, n = players.size(); i < n; ++i) {
			FramePlayer fp = players.get(i);
			if (fp.session == session && fp.state == PlayerState.Ready) {
				fp.state = PlayerState.Start;
				break;
			}
		}
	}

	public void playerEnd(WebSocketSession session) {
		for (int i = 0, n = players.size(); i < n; ++i) {
			FramePlayer fp = players.get(i);
			if (fp.session == session && fp.state == PlayerState.Start) {
				fp.state = PlayerState.End;
				break;
			}
		}
	}

	public void playerAction(WebSocketSession session, byte op) {
		int playerIdx = -1;
		for (int i = 0, n = players.size(); i < n; ++i) {
			FramePlayer fp = players.get(i);
			if (fp.session == session) {
				playerIdx = i;
				break;
			}
		}
		if (playerIdx >= 0)
			cur.op[playerIdx] = op;
	}

	public void noticePlayerInfo() throws IOException {
		StringBuilder sb = new StringBuilder(50);
		sb.append("r,").append(clientSeed).append(",");
		for (int i = 0, n = players.size(); i < n; ++i) {
			FramePlayer fp = players.get(i);
			if (fp.state == PlayerState.Ready)
				sb.append(fp.idx).append(",");
		}
		for (int i = 0, n = players.size(); i < n; ++i) {
			FramePlayer fp = players.get(i);
			WebSocketSession session = fp.session;
			if (session.isOpen())
				session.sendMessage(new TextMessage(sb.toString() + fp.idx));
		}
	}

	public boolean addPlayer(WebSocketSession session) {
		if (!session.isOpen())
			return false;
		for (int i = 0, n = players.size(); i < n;) {
			if (!players.get(i).session.isOpen()) {
				players.remove(i);
				--n;
			} else {
				++i;
			}
		}
		if (players.size() < PLAYERS) {
			players.add(new FramePlayer(++playerIdxCounter, session));
			return true;
		}
		return false;
	}

	public boolean removePlayer(WebSocketSession session) {
		for (int i = 0, n = players.size(); i < n; ++i) {
			if (players.get(i).session == session) {
				players.remove(i);
				return true;
			}
		}
		return false;
	}

	public int getPlayerCount() {
		return players.size();
	}

	public void broadcast(TextMessage msg) throws IOException {
		for (int i = 0, n = players.size(); i < n; ++i) {
			WebSocketSession session = players.get(i).session;
			if (session.isOpen())
				session.sendMessage(msg);
		}
	}

	private void reset() {
		if (idx != 0) {
			idx = 0;
			cur = null;
			frames.clear();
			clientSeed = allocClientSeed();
		}
	}

	private int allocClientSeed() {
		return (int) (System.currentTimeMillis() / 1000 + id);
	}
}
