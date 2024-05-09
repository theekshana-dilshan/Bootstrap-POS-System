export default class OrderModel {
    constructor(orderId, orderDate, customerName, discount, subTotal) {
        this._orderId =orderId;
        this._orderDate = orderDate;
        this._customerName = customerName;
        this._discount = discount;
        this._subTotal = subTotal;
    }


    get orderId() {
        return this._orderId;
    }

    set orderId(value) {
        this._orderId = value;
    }

    get orderDate() {
        return this._orderDate;
    }

    set orderDate(value) {
        this._orderDate = value;
    }

    get customerName() {
        return this._customerName;
    }

    set customerName(value) {
        this._customerName = value;
    }

    get discount() {
        return this._discount;
    }

    set discount(value) {
        this._discount = value;
    }

    get subTotal() {
        return this._subTotal;
    }

    set subTotal(value) {
        this._subTotal = value;
    }
}