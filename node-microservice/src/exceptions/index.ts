class GitException extends Error {
  public statusNumber: number;

  constructor(statusNumber: number, message: string) {
    super(message);
    this.statusNumber = statusNumber;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  getStatusNumber(): number {
    return this.statusNumber;
  }
  getMessage(): string {
    return this.message;
  }
}

export { GitException };
