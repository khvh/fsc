import { Service } from 'typedi';
import WebSocket from 'ws';

@Service()
export class WebSocketHandler {
  private ws: WebSocket;
  private host: string;
  private subs: any[] = [];
  private handleAll;

  init(addr: string) {
    this.host = addr;

    return this;
  }

  connect(onConnect: (ws: WebSocket) => void) {
    this.ws = new WebSocket(this.host);

    this.ws.on('open', () => onConnect(this.ws));
    this.ws.on('error', (err) => console.log('err -> ', err));
    this.ws.on('message', (m) => this.parseMessage(m));

    return this;
  }

  send(event, data) {
    this.ws.send(JSON.stringify({ event, data }));
  }

  json(data) {
    this.ws.send(JSON.stringify(data));

    return this;
  }

  parseMessage(message) {
    try {
      const res = JSON.parse(String(message));

      if (res.event) {
        const payload = { ...res };

        delete payload.event;
        this.subs.filter((s) => s.event === res.event).forEach((s) => s.cb(payload));
      } else {
        this.handleAll(res);
      }
    } catch (err) {
      // console.log('error while parsing %s', message);
    }

    return this;
  }

  sub(event, cb) {
    this.subs.push({ event, cb });

    return this;
  }

  all(cb) {
    this.handleAll = cb;

    return this;
  }
}

/**
 *
 * @WebSocket({ host: 'someHost', port: 11111 })
 * class SocketHandler {
 * 		@Action('some.action')
 * 		handler() {
 * 			this.ws.send('lmao')
 * 		}
 * }
 *
 */
