import { BoardUpdateModel } from '@/contracts/BoardUpdateModel.ts';
import {AppMessage} from "@/contracts/AppMessage.ts";
import { StepModel } from "@/contracts/StepModel";
import { StateModel } from '@/contracts/StateModel.ts';
import io from 'socket.io-client';
import {CONNECTION_TIMEOUT, GAME_SERVER} from "@/const/config";

export abstract class Connection {
    socket: SocketIOClient.Socket;
    accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
        this.socket = io(GAME_SERVER, { autoConnect: false, reconnection: true, query: { token: this.accessToken }, timeout: CONNECTION_TIMEOUT });
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
            .on(AppMessage.TimeSync, (timeLeft: number) => {
                console.log('TIME LEFT', timeLeft);
                this.timeSync(timeLeft);
            })
            .on(AppMessage.Steps, (steps: any[]) => {
                console.log('REPLY STEPS', steps);
                this.steps(steps);
            })
            .on(AppMessage.Complete, (winnerId: string) => {
                console.log(`WINNER: ${winnerId}`);
                this.complete(winnerId);
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
     * @param line Номер линии
     * @param pos Номер позиции
     * @param cardId Идентификатор карты из колоды
     */
    sendBoardUpdate(line: number, pos: number, cardId: number): void {
        if (!this.socket.connected) return;
        const data = new BoardUpdateModel(line, pos, cardId);
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
     * Симуляция боя завершена
     * @param steps Список шагов, сформированный в процессе симуляции боя
     */
    abstract steps(steps: Array<StepModel>): void;
    /**
     * Игра завершена
     * @param winner идентификатор победившего пользователя
     */
    abstract complete(winnerId: string): void;
}
