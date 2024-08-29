import TempCartModel from "../model/TempCartModel.js";
import OrderModel from "../model/OrderModel.js";
import {customerAr} from "../db/db.js";
import {itemAr} from "../db/db.js";
import {orders} from "../db/db.js";
import {tempOrderCartAr} from "../db/db.js";

$("#orderId").val(ordIdGenerate());

function ordIdGenerate() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                const response = JSON.parse(http.responseText);
                $("#orderId").val(response.orderId);
                console.log("Generated order ID:", response.orderId);
            } else {
                console.error("Failed to generate order ID");
                console.error(http.status);
            }
        }
    };

    http.open("GET", "http://localhost:8080/bootstrapPosBackend/orders?action=generateId", true);
    http.send();

    loadAllOrder()
    trOrderSelector()
}

$('#customerIdOrd').on('change',function (){
    const customerId = $('#customerIdOrd').val();

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                const customer = JSON.parse(http.responseText);
                if (customer) {
                    $('#customerIdOrd').val(customer.customerId);
                    $('#customerNameOrd').val(customer.customerName);
                    $('#salaryOrd').val(customer.customerSalary);
                    $('#addressOrd').val(customer.customerAddress);

                    console.log("Customer found")
                } else {
                    alert("Customer not found");
                }
            } else {
                console.error("Failed to search customer");
                console.error(http.status);
            }
        }
    };

    http.open("GET", `http://localhost:8080/bootstrapPosBackend/customer?customerId=${customerId}`, true);
    http.send();
});

/*Listener fir the Item Combo*/
$('#itemIdOrd').on('change',function (){
    const itemCode = $('#itemIdOrd').val();

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                const item = JSON.parse(http.responseText);
                if (item) {
                    $('#itemIdOrd').val(item.itemCode);
                    $('#item').val(item.itemName);
                    $('#qtyOnHandOrd').val(item.qtyOnHand);
                    $('#priceOrd').val(item.itemPrice);

                    console.log("Item found")
                    console.log(item)
                } else {
                    alert("Item not found");
                }
            } else {
                console.error("Failed to search item");
                console.error(http.status);
            }
        }
    };

    http.open("GET", `http://localhost:8080/bootstrapPosBackend/item?itemId=${itemCode}`, true);
    http.send();
});

$('#btnAddToCart').click(function (){

    let itemCode=$('#itemIdOrd').val();
    let itmName = $('#item').val();
    let itmPrice = $('#priceOrd').val();
    let itemOrderQty = $('#orderQty').val();
    let qtyOnHandOrd = $('#qtyOnHandOrd').val();

    let total =itmPrice*itemOrderQty;

    let toMinQty = qtyOnHandOrd;

    let rowExists = searchRowExists(itemCode);
    if(rowExists!=null){
        let newQty=((parseInt(rowExists.orItemQty))+(parseInt(itemOrderQty)));

        // rowExists.orItemQTY.val(newQty);
        rowExists.orItemQty=newQty;
        rowExists.orItemTotal=parseFloat(itmPrice)*newQty;

        toMinQty = qtyOnHandOrd - itemOrderQty;

        addCartData();

    }else{
        let tempCardObj = new TempCartModel(itemCode,itmName,itmPrice,itemOrderQty,total);
        tempOrderCartAr.push(tempCardObj);

        toMinQty = qtyOnHandOrd - itemOrderQty;

        addCartData();
    }

    minQty(itemCode,itmName ,toMinQty, itmPrice);
})

/*Add Table*/
function addCartData() {
    $("#tblCart> tr").detach();

    for (var tc of tempOrderCartAr){
        var row="<tr><td>"+tc.orItemCode+"</td><td>"+tc.orItemName+"</td><td>"+tc.orItemPrice+"</td><td>"+tc.orItemQty+"</td><td>"+tc.orItemTotal+"</td></tr>";
        $('#tblCart').append(row);
    }
    /*trCusSelector();*/
    getTotal();
}

/*function trCusSelector() {
    $("#tblCustomer>tr").click(function (){
        let id=$(this).children(':eq(0)').text();
        let name=$(this).children(':eq(1)').text();
        let address=$(this).children(':eq(2)').text();
        let salary=$(this).children(':eq(3)').text();

        console.log(id+"  "+name+"  "+address+" "+salary);

        $('#cId').val(id);
        $('#cName').val(name);
        $('#cAddress').val(address);
        $('#cSalary').val(salary);
    });
}*/

function getTotal() {
    let tempTot=0;
    for (let tempOrderCartArElement of tempOrderCartAr) {
        tempTot=tempTot+tempOrderCartArElement.orItemTotal;
    }
    $('#total').val(tempTot);

}

/*discount*/
let disTOGave=0;
$('#discount').on('keyup',function (){
    let dis=$('#discount').val();
    let tot=$('#total').val();
    var totMin=0;
    let subTot=0;

    console.log(dis+"=="+tot);
    totMin=parseFloat(tot)*(dis/100);
    console.log("dis Dis: "+totMin)

    subTot=tot-totMin;
    disTOGave=totMin;

    $('#subTotal').val(subTot);
})

/*Cash*/
$('#cash').on('keyup',function (){
    let cash=$('#cash').val();
    let subT=$('#subTotal').val();

    $('#balance').val((parseFloat(cash))-parseFloat(subT));
})

/*Remove Duplicate Row*/
function searchRowExists(itemCode) {
    for (let tempOr of tempOrderCartAr) {
        console.log(tempOr.orItemCode+"-----"+itemCode);
        if(tempOr.orItemCode===itemCode){
            return tempOr
        }
    }
    return null;
}

/*Min QTY*/
function minQty(itemCode, itemName, qtyOnHand, itemPrice) {
    const item = {
        itemCode,
        itemName,
        qtyOnHand,
        itemPrice
    };

    console.log(item);
    const customerJson = JSON.stringify(item);

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState == 4) {
            if (http.status == 204) {
                console.log("Item updated successfully");
                addTable();
                clearData();
            } else {
                console.error("Failed to update item");
                console.error(http.status);
            }
        }
    };

    http.open("PATCH", `http://localhost:8080/bootstrapPosBackend/item?itemCode=${itemCode}`, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(customerJson);
}

function addTable() {
    $("#tblItem > tr").detach();

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                const items = JSON.parse(http.responseText);

                for (var item of items) {
                    var row = "<tr><td>" + item.itemCode + "</td><td>" + item.itemName + "</td><td>" + item.qtyOnHand + "</td><td>" + item.itemPrice + "</td></tr>";
                    $('#tblItem').append(row);
                }

                trSelector();
            } else {
                console.error("Failed to fetch customer data");
                console.error(http.status);
            }
        }
    };

    http.open("GET", "http://localhost:8080/bootstrapPosBackend/item", true);
    http.send();

    trSelector();
}

function trSelector() {
    $("#tblItem>tr").click(function (){
        let code=$(this).children(':eq(0)').text();
        let name=$(this).children(':eq(1)').text();
        let qOH=$(this).children(':eq(2)').text();
        let price=$(this).children(':eq(3)').text();

        $('#itId').val(code);
        $('#itName').val(name);
        $('#qtyOnHand').val(qOH);
        $('#itPrice').val(price);
    });
}


function clearData() {
    $('#qtyOnHandOrd').val("");
    $('#item').val("");
    $('#priceOrd').val("");
    $('#orderQty').val("");
}

/*Purchase Order*/
$('#purchaseOrder').click(function (){
    let orderId = $('#orderId').val();
    let orderDate = $('#OrderDate').val();
    let orderCustomer = $('#customerNameOrd').val();
    let discount = disTOGave;
    let subTotal = $('#subTotal').val();

    const order = {
        orderId,
        orderDate,
        orderCustomer,
        discount,
        subTotal
    };
    const orderJson=JSON.stringify(order);
    const http=new XMLHttpRequest();
    http.onreadystatechange=()=>{
        if(http.readyState==4){
            if(http.status==200 || http.status==201){
                const jsonTypeResponse=JSON.stringify(http.responseText);
                console.log(jsonTypeResponse);
            }else{
                console.error("failed");
                console.error(http.status);
            }
        }else{
            console.log("Processing stage",http.readyState);
        }
    }

    http.open("POST","http://localhost:8080/bootstrapPosBackend/orders",true);
    http.setRequestHeader("Content-Type","application/json");
    http.send(orderJson);

    blindOrderRowClickEvent();
    clearOrderTexts();

    for (var tempOrder of tempOrderCartAr){
        tempOrderCartAr.pop();
    }
    tempOrderCartAr.pop();
    addCartData();

    $("#orderId").val(ordIdGenerate());
});

/*FUNCTIONS*/
function blindOrderRowClickEvent(){

    $('#tblOrder>tr').click(function (){
        let ordId = $(this).children(':eq(0)').text();
        $('#orderIdDash').val(ordId);
        let ordDate = $(this).children(':eq(1)').text();
        $('#OrderDateDash').val(ordDate);
        let ordName = $(this).children(':eq(2)').text();
        $('#customerNameDash').val(ordName);
        let ordDis = $(this).children(':eq(3)').text();
        $('#discountDash').val(ordDis);
        let ordCost = $(this).children(':eq(4)').text();
        $('#subTotDash').val(ordCost);
    });
}

function clearOrderTexts(){
    $('#orderId').val("");
    $('#OrderDate').val("");
    $('#customerNameOrd').val("");
    $('#salaryOrd').val("");
    $('#addressOrd').val("");

    $('#item').val("");
    $('#priceOrd').val("");
    $('#qtyOnHandOrd').val(0);
    $('#orderQty').val("");

    $('#cash').val("");
    $('#discount').val(0);
    $('#balance').val("");
    $('#subTotal').val(0);
}

function loadAllOrder(){
    $("#tblOrder> tr").detach();

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                const orders = JSON.parse(http.responseText);
                for (var i of orders) {
                    $('#tblOrder').append(
                        '<tr><td>' + i.orderId + '</td>' +
                        '<td>' + i.orderDate + '</td>' +
                        '<td>' + i.orderCustomer + '</td>' +
                        '<td>' + i.discount + '</td>' +
                        '<td>' + i.subTotal + '</td></tr>'
                    );
                }

                trOrderSelector();
            } else {
                console.error("Failed to load orders");
                console.error(http.status);
            }
        }
    };

    http.open("GET", "http://localhost:8080/bootstrapPosBackend/orders", true);
    http.send();
}

function trOrderSelector() {
    $("#tblOrder>tr").click(function (){
        let id=$(this).children(':eq(0)').text();
        let date=$(this).children(':eq(1)').text();
        let name=$(this).children(':eq(2)').text();
        let discount=$(this).children(':eq(3)').text();
        let subTotal=$(this).children(':eq(4)').text();

        $('#orderIdDash').val(id);
        $('#OrderDateDash').val(date);
        $('#customerNameDash').val(name);
        $('#discountDash').val(discount);
        $('#subTotDash').val(subTotal);
    });
}