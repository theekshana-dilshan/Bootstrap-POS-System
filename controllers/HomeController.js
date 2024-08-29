import {orders} from "../db/db.js";


$('#btnSearchOrder').click(function () {

    let OrderId = $('#chooseOrderType').val();

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                const order = JSON.parse(http.responseText);
                if (order) {
                    $('#orderIdDash').val(order.orderId);
                    $('#OrderDateDash').val(order.orderDate);
                    $('#customerNameDash').val(order.orderCustomer);
                    $('#discountDash').val(order.discount);
                    $('#subTotDash').val(order.subTotal);
                } else {
                    alert("Order not found");
                }
            } else {
                console.error("Failed to search order");
                console.error(http.status);
            }
        }
    };

    http.open("GET", `http://localhost:8080/bootstrapPosBackend/orders?orderId=${OrderId}`, true);
    http.send();
});

$('#btnClearOrd').click(function (){
    clearFeilds();
});

function clearFeilds() {
    $('#orderIdDash').val("");
    $('#OrderDateDash').val("");
    $('#customerNameDash').val("");
    $('#discountDash').val("");
    $('#subTotDash').val("");
    $('#searchOrder').val("");
}

$('#btnDeleteOrd').click(function (){
    let orderId = $('#orderIdDash').val();

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState == 4) {
            if (http.status == 204) {
                console.log("Order deleted successfully");
                alert('Order deleted successfully!');

                loadAllOrder()
                clearFeilds();
            } else {
                console.error("Failed to delete order");
                console.error(http.status);
            }
        }
    };

    http.open("DELETE", `http://localhost:8080/bootstrapPosBackend/orders?orderId=${orderId}`, true);
    http.send();
});


/*FUNCTIONS*/

function loadAllOrder(){
    $("#tblOrder> tr").detach(); // Clear the existing table rows

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

        console.log(id, date, name, discount, subTotal);

        $('#orderIdDash').val(id);
        $('#OrderDateDash').val(date);
        $('#customerNameDash').val(name);
        $('#discountDash').val(discount);
        $('#subTotDash').val(subTotal);
    });
}