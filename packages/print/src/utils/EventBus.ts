import { PrintClientType } from '../types';

export type EventData = {
  requestID: string;
  [k: string]: any;
};

export type EventCallback<T extends EventData> = (rawData: T) => void;

export class EventBus {
  private events: { [key: string]: { id?: string; fn: Function }[] } = {};

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
    const eventName = `open_${type}`;
    this.on(eventName, fun, id);
    return () => { this.off(eventName, fun, id); };
  }
  public emitOpen(type: PrintClientType, data: EventData) {
    const eventName = `open_${type}`;
    this.emit(eventName, data);
  }

  public onClose(type: PrintClientType, fun: EventCallback<EventData>, id?: string) {
    const eventName = `close_${type}`;
    this.on(eventName, fun, id);
    return () => { this.off(eventName, fun, id); };
  }
  public emitClose(type: PrintClientType, data: EventData) {
    const eventName = `close_${type}`;
    this.emit(eventName, data);
  }

  public onError(type: PrintClientType, fun: EventCallback<EventData>, id?: string) {
    const eventName = `error_${type}`;
    this.on(eventName, fun, id);
    return () => { this.off(eventName, fun, id); };
  }
  public emitError(type: PrintClientType, data: EventData) {
    const eventName = `error_${type}`;
    this.emit(eventName, data);
  }

  public onGetPrinters(type: PrintClientType, fun: EventCallback<EventData>, id?: string) {
    const eventName = `getPrinters_${type}`;
    this.on(eventName, fun, id);
    return () => { this.off(eventName, fun, id); };
  }
  public emitGetPrinters(type: PrintClientType, data: EventData) {
    const eventName = `getPrinters_${type}`;
    this.emit(eventName, data);
  }

  public onPrint(type: PrintClientType, fun: EventCallback<EventData>, id?: string) {
    const eventName = `print_${type}`;
    this.on(eventName, fun, id);
    return () => { this.off(eventName, fun, id); };
  }
  public emitPrint(type: PrintClientType, data: EventData) {
    const eventName = `print_${type}`;
    this.emit(eventName, data);
  }

  public onNotifyPrintResult(type: PrintClientType, fun: EventCallback<EventData>, id?: string) {
    const eventName = `notifyPrintResult_${type}`;
    this.on(eventName, fun, id);
    return () => { this.off(eventName, fun, id); };
  }
  public emitNotifyPrintResult(type: PrintClientType, data: EventData) {
    const eventName = `notifyPrintResult_${type}`;
    this.emit(eventName, data);
  }
}
