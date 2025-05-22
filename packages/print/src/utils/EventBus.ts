export type EventData = {
  requestID: string;
  [k: string]: any;
};

export type EventCallback<T extends EventData> = (rawData: T) => void;

export class EventBus {
  private events: { [key: string]: Function[] } = {};
  private readonly eventNames = {
    error: 'error',
    print: 'print',
    notifyPrintResult: 'notifyPrintResult',
    getPrinters: 'getPrinters',
  } as const;

  public emit<T extends EventData>(eventName: string, data: T) {
    this.events[eventName]?.forEach((fn) => fn(data));
    console.log('【EventBus】emit', eventName, data, this.events);
  }

  public on<T extends EventData>(eventName: string, fn: EventCallback<T>) {
    this.events[eventName] = this.events[eventName] || [];
    if (!this.events[eventName].some((existingFn) => existingFn === fn)) {
      this.events[eventName].push(fn);
    }
    console.log('【EventBus】on', eventName, this.events);
  }

  public off<T extends EventData>(eventName: string, fn: EventCallback<T>) {
    if (this.events[eventName]) {
      const events = this.events[eventName]?.filter((f) => f !== fn);
      if (!events?.length) {
        delete this.events[eventName];
      } else {
        this.events[eventName] = events;
      }
    }
    console.log('【EventBus】off', eventName, this.events);
  }

  // Convenience methods for specific events
  public onError(fun: EventCallback<EventData>) {
    this.on(this.eventNames.error, fun);
  }
  public offError(fun: EventCallback<EventData>) {
    this.off(this.eventNames.error, fun);
  }
  public emitError(data: EventData) {
    this.emit(this.eventNames.error, data);
  }

  public onGetPrinters(fun: EventCallback<EventData>) {
    this.on(this.eventNames.getPrinters, fun);
  }
  public offGetPrinters(fun: EventCallback<EventData>) {
    this.off(this.eventNames.getPrinters, fun);
  }
  public emitGetPrinters(data: EventData) {
    this.emit(this.eventNames.getPrinters, data);
  }

  public onPrint(fun: EventCallback<EventData>) {
    this.on(this.eventNames.print, fun);
  }
  public offPrint(fun: EventCallback<EventData>) {
    this.off(this.eventNames.print, fun);
  }
  public emitPrint(data: EventData) {
    this.emit(this.eventNames.print, data);
  }

  public onNotifyPrintResult(fun: EventCallback<EventData>) {
    this.on(this.eventNames.notifyPrintResult, fun);
  }
  public offNotifyPrintResult(fun: EventCallback<EventData>) {
    this.off(this.eventNames.notifyPrintResult, fun);
  }
  public emitNotifyPrintResult(data: EventData) {
    this.emit(this.eventNames.notifyPrintResult, data);
  }
}
