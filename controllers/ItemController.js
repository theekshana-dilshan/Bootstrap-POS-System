$("#itemId").val(itemIdGenerate());
addTable();
loadAllItemId();

$('#btnItemSave').click(function (e) {
    e.preventDefault();
    const item = {
        itemCode:$("#itemId").val(),
        itemName: $('#itemName').val(),
        qtyOnHand: $('#itemQtyOnHand').val(),
        itemPrice: $('#itemPrice').val()
    };
    const itemJson=JSON.stringify(item);
    const http=new XMLHttpRequest();
    http.onreadystatechange=()=>{
        if(http.readyState==4){
            if(http.status==200 || http.status==201){
                const jsonTypeResponse=JSON.stringify(http.responseText);
                console.log(jsonTypeResponse);
                $("#itemId").val(itemIdGenerate());
            }else{
                console.error("failed");
                console.error(http.status);
                $("#itemId").val(itemIdGenerate());
            }
        }else{
            console.log("Processing stage",http.readyState);
            $("#itemId").val(itemIdGenerate());
        }
    }

    http.open("POST","http://localhost:8080/bootstrapPosBackend/item",true);
    http.setRequestHeader("Content-Type","application/json");
    http.send(itemJson);

    console.log('Item data:', item);
    alert('Item information saved successfully!');

    $("#itemId").val(itemIdGenerate());

    addTable();
    loadAllItemId();
    clearAllItemData();
});

function itemIdGenerate() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                const response = JSON.parse(http.responseText);
                $("#itemId").val(response.itemCode);
                console.log("Generated Item ID:", response.itemCode);
            } else {
                console.error("Failed to generate item ID");
                console.error(http.status);
            }
        }
    };

    http.open("GET", "http://localhost:8080/bootstrapPosBackend/item?action=generateId", true);
    http.send();
}

function loadAllItemId() {
    $('#itemIdOrd').empty();

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                const items = JSON.parse(http.responseText);

                for (let item of items) {
                    $('#itemIdOrd').append(`<option>${item.itemCode}</option>`);
                }
            } else {
                console.error("Failed to load items IDs");
                console.error(http.status);
            }
        }
    };

    http.open("GET", "http://localhost:8080/bootstrapPosBackend/item", true);
    http.send();
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
}

/*====Add Focus Event when user Click Enter====*/
$('#itemId').on('keydown',function (event){

    if(event.key==="Enter" && check(itemCodeRegEx, $("#itemId"))){
        $("#itemName").focus();
    }else if(event.key==="ArrowUp"){
        $("#itemPrice").focus();
    }
});
$('#itemName').on('keydown',function (event){

    if(event.key==="Enter" && check(itemNameRegEx, $("#itemName"))){
        $("#itemPrice").focus();
    }else if(event.key==="ArrowUp"){
        $("#itemId").focus();
    }
});

$('#itemPrice').on('keydown',function (event){
    if(event.key==="Enter" && check(itemPriceRegEx, $("#itemPrice"))){
        $("#itemQtyOnHand").focus();
    }else if(event.key==="ArrowUp"){
        $("#itemName").focus();
    }
});

$('#itemQtyOnHand').on('keydown',function (event){

    if(event.key==="Enter" && check(itemQtyRegEx, $("#itemQtyOnHand"))){
        let res = confirm("Do you want to add this Item.?");
        if (res) {
            itemSave($('#itemId').val(),$('#itemName').val(),$('#itemQtyOnHand').val(),$('#itemPrice').val());
            console.log($('#itemId').val(),$('#itemName').val(),$('#itemQtyOnHand').val(),$('#itemPrice').val())
        }
    }else if(event.key==="ArrowUp"){
        $("#itemPrice").focus();
    }
});

/*Search Item*/
$('#btnItemSearch').click(function (e) {

    const searchValue = $('#inputItemSearch').val();
    const searchBy = $('#itemCombo').val();
    let url = "http://localhost:8080/bootstrapPosBackend/item";

    if (searchBy === "ID") {
        url += `?itemCode=${searchValue}`;
    } else if (searchBy === "1") {
        url += `?itemName=${searchValue}`;
    }

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                const item = JSON.parse(http.responseText);
                if (item) {
                    $('#itId').val(item.itemCode);
                    $('#itName').val(item.itemName);
                    $('#qtyOnHand').val(item.qtyOnHand);
                    $('#itPrice').val(item.itemPrice);
                    $("#itemId").val(itemIdGenerate());
                } else {
                    alert("Customer not found");
                    $("#itemId").val(itemIdGenerate());
                }
            } else {
                console.error("Failed to search customer");
                console.error(http.status);
                $("#itemId").val(itemIdGenerate());
            }
        }
    };

    http.open("GET", url, true);
    http.send();
});

/*When the table click set data to the field*/
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

/*for Delete Item*/
$("#btnItemDelete").click(function (e) {
    e.preventDefault();
    const itemCode = $("#itId").val();

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState == 4) {
            if (http.status == 204) {
                console.log("Item deleted successfully");
                alert('Item deleted successfully!');
                clearAllItemData();
                $("#itemId").val(itemIdGenerate());
                addTable();
                loadAllItemId();
            } else {
                console.error("Failed to delete customer");
                console.error(http.status);
                $("#itemId").val(itemIdGenerate());
            }
        }
    };

    http.open("DELETE", `http://localhost:8080/bootstrapPosBackend/item?itemCode=${itemCode}`, true);
    http.send();
});

/*Update Item*/
$("#btnItemUpdate").click(function (e) {
    e.preventDefault();
    const itemCode = $("#itId").val();
    const item = {
        itemCode: $('#itId').val(),
        itemName: $('#itName').val(),
        qtyOnHand: $('#qtyOnHand').val(),
        itemPrice: $('#itPrice').val()
    };
    const customerJson = JSON.stringify(item);

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState == 4) {
            if (http.status == 204) {
                console.log("Item updated successfully");
                alert('Item information updated successfully!');
                $("#itemId").val(itemIdGenerate());
                addTable();
                loadAllItemId();
            } else {
                console.error("Failed to update item");
                console.error(http.status);
                $("#itemId").val(itemIdGenerate());
            }
        }
    };

    http.open("PATCH", `http://localhost:8080/bootstrapPosBackend/item?itemCode=${itemCode}`, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(customerJson);
});

/*Disable Tab*/
$("#itemId,#itemName,#itemPrice,#itemQtyOnHand").on('keydown', function (event) {
    if (event.key == "Tab") {
        event.preventDefault();
    }
});

/*For Validation*/

// Item reguler expressions

const itemCodeRegEx = /^(I00-)[0-9]{1,3}$/;
const itemNameRegEx = /^[A-z ]{5,20}$/;
const itemQtyRegEx = /^[0-9]{1,7}$/;
const itemPriceRegEx = /^[0-9]{1,}[.]?[0-9]{1,2}$/;


let itemValidations = [];
itemValidations.push({reg: itemCodeRegEx, field: $('#itemId'),error:'Item Code Pattern is Wrong : I00-001'});
itemValidations.push({reg: itemNameRegEx, field: $('#itemName'),error:'Item Name Pattern is Wrong : A-z 5-20'});
itemValidations.push({reg: itemQtyRegEx, field: $('#itemPrice'),error:'Item Price Pattern is Wrong : 100 or 100.00'});
itemValidations.push({reg: itemPriceRegEx, field: $('#itemQtyOnHand'),error:'QTY Pattern is Wrong : 0-9'});


$("#itemId,#itemName,#itemPrice,#itemQtyOnHand").on('keyup', function (event) {
    checkValidity();
});
$("#itemId,#itemName,#itemPrice,#itemQtyOnHand").on('blur', function (event) {
    checkValidity();
});



function checkValidity() {
    let errorCount=0;
    for (let validation of itemValidations) {
        if (check(validation.reg,validation.field)) {
            textSuccess(validation.field,"");
        } else {
            errorCount=errorCount+1;
            setTextError(validation.field,validation.error);
        }
    }
    setButtonState(errorCount);
}

function check(regex, txtField) {
    let inputValue = txtField.val();
    return regex.test(inputValue) ? true : false;
}

function textSuccess(txtField,error) {
    if (txtField.val().length <= 0) {
        defaultText(txtField,"");
    } else {
        txtField.css('border', '2px solid green');
        txtField.parent().children('span').text(error);
    }
}

function setTextError(txtField,error) {
    if (txtField.val().length <= 0) {
        defaultText(txtField,"");
    } else {
        txtField.css('border', '2px solid red');
        txtField.parent().children('span').text(error);
    }
}

function defaultText(txtField,error) {
    txtField.css("border", "1px solid #ced4da");
    txtField.parent().children('span').text(error);
}

function setButtonState(value){
    if (value>0){
        $("#btnItemSave").attr('disabled',true);
    }else{
        $("#btnItemSave").attr('disabled',false);
    }
}

/*Clear Data*/
$("#btnItemClear").click(function () {
    clearAllItemData();
    $("#itemId").val(itemIdGenerate());
});

function clearAllItemData() {
    $('#itId').val("");
    $('#itName').val("");
    $('#qtyOnHand').val("");
    $('#itPrice').val("");

    $('#itemId').val("");
    $('#itemName').val("");
    $('#itemPrice').val("");
    $('#itemQtyOnHand').val("");
}