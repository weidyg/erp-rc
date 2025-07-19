import { PrintClientType } from '../types';

export type EventData = {
  requestID: string;
  [k: string]: any;
};

export type EventCallback<T extends EventData> = (rawData: T) => void;

export class EventBus {
  private events: { [key: string]: { id?: string; fn: Function }[] } = {};
  private readonly eventNames = {
    open: 'open',
    close: 'close',
    error: 'error',
    print: 'print',
    notifyPrintResult: 'notifyPrintResult',
    getPrinters: 'getPrinters',
  } as const;

  public emit<T extends EventData>(eventName: string, data: T) {
    // console.log('【EventBus】emit', eventName, data, this.events);
    this.events[eventName]?.forEach((item) => item?.fn(data));
  }
  public on<T extends EventData>(eventName: string, fn: EventCallback<T>, id?: string) {
    this.events[eventName] = this.events[eventName] || [];
    if (id) {
      let events = this.events[eventName]?.filter((f) => f.id != id);
      events.push({ id, fn });
      this.events[eventName] = events;
      // console.log('【EventBus】replace ' + id, eventName, this.events);
    } else if (!this.events[eventName].some((s) => s.fn == fn)) {
      this.events[eventName].push({ id, fn });
      // console.log('【EventBus】push', eventName, this.events);
    }
  }
  public off<T extends EventData>(eventName: string, fn: EventCallback<T>, id?: string) {
    // console.log('【EventBus】off', eventName, this.events);
    if (this.events[eventName]) {
      let events = this.events[eventName]?.filter((f) => f.fn != fn);
      if (id) {
        events = this.events[eventName]?.filter((f) => f.id != id);
      }
      if (!events?.length) {
        delete this.events[eventName];
      } else {
        this.events[eventName] = events;
      }
    }
  }

  // Convenience methods for specific events
  public onOpen(type: PrintClientType, fun: EventCallback<EventData>, id?: string) {
    this.on(this.eventNames.open + type, fun, id);
    return () => { this.off(this.eventNames.close + type, fun, id); };
  }
  public emitOpen(type: PrintClientType, data: EventData) {
    this.emit(this.eventNames.open + type, data);
  }

  public onClose(type: PrintClientType, fun: EventCallback<EventData>, id?: string) {
    this.on(this.eventNames.close + type, fun, id);
    return () => { this.off(this.eventNames.close + type, fun, id); };
  }
  public emitClose(type: PrintClientType, data: EventData) {
    this.emit(this.eventNames.error + type, data);
  }

  public onError(type: PrintClientType, fun: EventCallback<EventData>, id?: string) {
    this.on(this.eventNames.error + type, fun, id);
    return () => { this.off(this.eventNames.error + type, fun, id); };
  }
  public emitError(type: PrintClientType, data: EventData) {
    this.emit(this.eventNames.error + type, data);
  }

  public onGetPrinters(type: PrintClientType, fun: EventCallback<EventData>, id?: string) {
    this.on(this.eventNames.getPrinters + type, fun, id);
    return () => { this.off(this.eventNames.getPrinters + type, fun, id); };
  }
  public emitGetPrinters(type: PrintClientType, data: EventData) {
    this.emit(this.eventNames.getPrinters + type, data);
  }

  public onPrint(type: PrintClientType, fun: EventCallback<EventData>, id?: string) {
    this.on(this.eventNames.print + type, fun, id);
    return () => { this.off(this.eventNames.print + type, fun, id); };
  }
  public emitPrint(type: PrintClientType, data: EventData) {
    this.emit(this.eventNames.print + type, data);
  }

  public onNotifyPrintResult(type: PrintClientType, fun: EventCallback<EventData>, id?: string) {
    this.on(this.eventNames.notifyPrintResult + type, fun, id);
    return () => { this.off(this.eventNames.notifyPrintResult + type, fun, id); };
  }
  public emitNotifyPrintResult(type: PrintClientType, data: EventData) {
    this.emit(this.eventNames.notifyPrintResult + type, data);
  }
}
