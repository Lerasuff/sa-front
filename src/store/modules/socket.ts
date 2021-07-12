import { BoardUpdateModel } from '@/contracts/BoardUpdateModel.ts';
import { AppMessage } from '@/contracts/AppMessage.ts';
import { StateModel } from '@/contracts/StateModel.ts';
import io from 'socket.io-client';
import { CONNECTION_TIMEOUT, GAME_SERVER } from '@/const/config';

export abstract class Connection {
  socket: SocketIOClient.Socket;
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.socket = io(GAME_SERVER, {
      autoConnect: false,
      reconnection: true,
      query: {token: this.accessToken},
      timeout: CONNECTION_TIMEOUT
    });
    this.socket
        .on('connect', () => {
          console.log('Connected');
          this.connected();
        })
        .on('disconnect', () => {
          console.log('Disconnected');
          this.disconnected();
        })
        .on('connect_error', (e: any) => {
          console.log('ERROR', e);
          this.error(e);
        })
        .on(AppMessage.Wait, () => {
          console.log('WAIT');
          this.wait();
        })
        .on(AppMessage.Ready, (board: StateModel) => {
          console.log('READY', board);
          this.ready(board);
        })
        .on(AppMessage.TimeSync, (timeLeft: { tick: number }) => {
          console.log('TIME LEFT', timeLeft);
          this.timeSync(timeLeft.tick);
        })
        .on(AppMessage.BadMove, (moveId: number) => {
          console.log('BAD MOVE', moveId);
          this.badMove(moveId);
        })
        .on(AppMessage.Complete, (winner: boolean) => {
          console.log(`WINNER: ${winner}`);
          this.complete(winner);
        });
  }

  /**
   * Подключение к серверу
   * @param deckId Идентификатор колоды
   */
  public connect(deckId: string): void {
    this.socket.io.reconnection(true);
    this.socket.connect();
    this.socket.emit(AppMessage.Connect, deckId);
  }

  /** Явное отключение со стороны клиента с предотвращением автоматических переподключений */
  public disconnect(): void {
    this.socket.io.reconnection(false);
    this.socket.disconnect();
  }

  /**
   * Отправка сигнала об обновлении доски
   * @param moveId Номер перемещения
   * @param line Номер линии
   * @param pos Номер позиции
   * @param cardId Идентификатор карты из колоды
   */
  sendBoardUpdate(moveId: number, line: number, pos: number, cardId: number): void {
    if (!this.socket.connected) return;
    const data = new BoardUpdateModel(moveId, line, pos, cardId);
    console.log(`send board update ${JSON.stringify(data)}`);
    this.socket.emit(AppMessage.BoardUpdate, data);
  }

  sendBoardReady(): void {
    if (!this.socket.connected) return;
    this.socket.emit(AppMessage.BoardReady);
  }

  /** Подключение к серверу установлено */
  abstract connected(): void;
  /** Соединение разорвано */
  abstract disconnected(): void;
  /**
   * Ошибка при обмене данными
   * @param e Описание ошибки
   */
  abstract error(e: unknown): void;
  /** Ожидание подключения противника */
  abstract wait(): void;
  /**
   * Сервер готов принимать ходы
   * @param board Текущее состояние всей доски (включая разложенные карты противника)
   */
  abstract ready(board: StateModel): void;
  /**
   * Сигнал синхоронизации времени окончания хода
   * @param timeLeft Количество секунд, оставшихся до окончания хода.
   * 0 означает, что ход завершен и последующие обновления доски будут формировать ошибку
   */
  abstract timeSync(timeLeft: number): void;
  /**
   * Сигнал о неправильно выполненом перемещении карты
   * @param moveId Идентфикатор перемещения
   * Идентфикатор перемещения должен быть уникальным в процессе всего сеанса игры. Например постоянно инкрементироваться.
   */
  abstract badMove(moveId: number): void;
  /**
   * Игра завершена
   * @param winner победа/провал пользователя
   */
  abstract complete(winner: boolean): void;
}
