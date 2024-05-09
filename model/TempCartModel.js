export default class TempCartModel {
    constructor(itemCode, itemName, itemPrice, itemOrderQty, total) {
        this._itemCode = itemCode;
        this._itemName = itemName;
        this._itemPrice =itemPrice;
        this._itemOrderQty = itemOrderQty;
        this._total = total;
    }


    get itemCode() {
        return this._itemCode;
    }

    set itemCode(value) {
        this._itemCode = value;
    }

    get itemName() {
        return this._itemName;
    }

    set itemName(value) {
        this._itemName = value;
    }

    get itemPrice() {
        return this._itemPrice;
    }

    set itemPrice(value) {
        this._itemPrice = value;
    }

    get itemOrderQty() {
        return this._itemOrderQty;
    }

    set itemOrderQty(value) {
        this._itemOrderQty = value;
    }

    get total() {
        return this._total;
    }

    set total(value) {
        this._total = value;
    }
}