export class Currency {
  static format(value: number, currency: string) {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    });
    return formatter.format(value);
  }
}
