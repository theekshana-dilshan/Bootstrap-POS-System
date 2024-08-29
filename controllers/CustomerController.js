$("#customerId").val(cusIdGenerate());
addCustomerTable();
loadAllCustomerId();

$('#btnSaveCustomer').click(function (e) {
    e.preventDefault();
    const customer = {
        customerId:$("#customerId").val(),
        customerName: $('#customerName').val(),
        customerAddress: $('#customerAddress').val(),
        customerSalary: $('#customerSalary').val()
    };
    const customerJson=JSON.stringify(customer);
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

    http.open("POST","http://localhost:8080/bootstrapPosBackend/customer",true);
    http.setRequestHeader("Content-Type","application/json");
    http.send(customerJson);

    console.log('Customer data:', customer);
    alert('Customer information saved successfully!');

    $("#customerId").val(cusIdGenerate());

    addCustomerTable();
    loadAllCustomerId();
    clearAllCusData();
});

function cusIdGenerate() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                const response = JSON.parse(http.responseText);
                $("#customerId").val(response.customerId);
                console.log("Generated Customer ID:", response.customerId);
            } else {
                console.error("Failed to generate Customer ID");
                console.error(http.status);
            }
        }
    };

    http.open("GET", "http://localhost:8080/bootstrapPosBackend/customer?action=generateId", true);
    http.send();
}

function addCustomerTable() {
    $("#tblCustomer > tr").detach();

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                const customers = JSON.parse(http.responseText);

                for (var customer of customers) {
                    var row = "<tr><td>" + customer.customerId + "</td><td>" + customer.customerName + "</td><td>" + customer.customerAddress + "</td><td>" + customer.customerSalary + "</td></tr>";
                    $('#tblCustomer').append(row);
                }

                trCusSelector();
            } else {
                console.error("Failed to fetch customer data");
                console.error(http.status);
            }
        }
    };

    http.open("GET", "http://localhost:8080/bootstrapPosBackend/customer", true);
    http.send();
}

function loadAllCustomerId() {
    $('#customerIdOrd').empty();

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                const customers = JSON.parse(http.responseText);

                for (let customer of customers) {
                    $('#customerIdOrd').append(`<option>${customer.customerId}</option>`);
                }
            } else {
                console.error("Failed to load customer IDs");
                console.error(http.status);
            }
        }
    };

    http.open("GET", "http://localhost:8080/bootstrapPosBackend/customer", true);
    http.send();
}

/*====Add Focus Event when user Click Enter====*/
$('#customerId').on('keydown',function (event){

    if(event.key==="Enter" && check(cusIDRegEx, $("#customerId"))){
        $("#customerName").focus();
    }else if(event.key==="ArrowUp"){
        $("#customerSalary").focus();
    }

});
$('#customerName').on('keydown',function (event){

    if(event.key==="Enter" && check(cusNameRegEx, $("#customerName"))){
        $("#customerAddress").focus();
    }else if(event.key==="ArrowUp"){
        $("#customerId").focus();
    }

});
$('#customerAddress').on('keydown',function (event){

    if(event.key==="Enter" && check(cusAddressRegEx, $("#customerAddress"))){
        $("#customerSalary").focus();
    }else if(event.key==="ArrowUp"){
        $("#customerName").focus();
    }

});
$('#customerSalary').on('keydown',function (event){

    if(event.key==="Enter" && check(cusSalaryRegEx, $("#customerSalary"))){
        let res = confirm("Do you want to add this customer.?");
        if (res) {
            cusSave($('#customerId').val(),$('#customerName').val(),$('#customerAddress').val(),$('#customerSalary').val());
        }

    }else if(event.key==="ArrowUp"){
        $("#customerAddress").focus();
    }
});

/*Search Customer*/
$('#btnSearchButton').click(function () {
    const searchValue = $('#inputCusSearch').val();
    const searchBy = $('#cusCombo').val();
    let url = "http://localhost:8080/bootstrapPosBackend/customer";

    if (searchBy === "ID") {
        url += `?customerId=${searchValue}`;
    } else if (searchBy === "1") {
        url += `?customerName=${searchValue}`;
    }

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                const customer = JSON.parse(http.responseText);
                if (customer) {
                    $('#cId').val(customer.customerId);
                    $('#cName').val(customer.customerName);
                    $('#cSalary').val(customer.customerSalary);
                    $('#cAddress').val(customer.customerAddress);
                    $("#customerId").val(cusIdGenerate());
                } else {
                    alert("Customer not found");
                    $("#customerId").val(cusIdGenerate());
                }
            } else {
                console.error("Failed to search customer");
                console.error(http.status);
                $("#customerId").val(cusIdGenerate());
            }
        }
    };

    http.open("GET", url, true);
    http.send();
});


/*When the table click set data to the field*/
function trCusSelector() {

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
}

/*for Delete Customer*/
$("#btnCusDelete").click(function (e) {
    e.preventDefault();
    const customerId = $("#cId").val();

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState == 4) {
            if (http.status == 204) {
                console.log("Customer deleted successfully");
                alert('Customer deleted successfully!');
                clearAllCusData();
                $("#customerId").val(cusIdGenerate());
                addCustomerTable();
                loadAllCustomerId();
            } else {
                console.error("Failed to delete customer");
                console.error(http.status);
                $("#customerId").val(cusIdGenerate());
            }
        }
    };

    http.open("DELETE", `http://localhost:8080/bootstrapPosBackend/customer?customerId=${customerId}`, true);
    http.send();
});

/*Update Customer*/
$("#btnCusUpdate").click(function (e) {
    e.preventDefault();
    const customerId = $("#cId").val();
    const customer = {
        customerId: $('#cId').val(),
        customerName: $('#cName').val(),
        customerAddress: $('#cAddress').val(),
        customerSalary: $('#cSalary').val()
    };
    const customerJson = JSON.stringify(customer);

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState == 4) {
            if (http.status == 204) {
                console.log("Customer updated successfully");
                alert('Customer information updated successfully!');
                $("#customerId").val(cusIdGenerate());
                addCustomerTable();
                loadAllCustomerId();
            } else {
                console.error("Failed to update customer");
                console.error(http.status);
                $("#customerId").val(cusIdGenerate());
            }
        }
    };

    http.open("PATCH", `http://localhost:8080/bootstrapPosBackend/customer?customerId=${customerId}`, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(customerJson);
});
/*Disable Tab*/
$("#customerId,#customerName,#customerAddress,#customerSalary").on('keydown', function (event) {
    if (event.key === "Tab") {
        event.preventDefault();
    }
});

/*For Validation*/
$("#customerId").focus();

// customer reguler expressions
const cusIDRegEx = /^(C00-)[0-9]{1,3}$/;
const cusNameRegEx = /^[A-z ]{5,20}$/;
const cusAddressRegEx = /^[0-9/A-z. ,]{7,}$/;
const cusSalaryRegEx = /^[0-9]{1,}[.]?[0-9]{1,2}$/;

let customerValidations = [];
customerValidations.push({reg: cusIDRegEx, field: $('#customerId'),error:'Customer ID Pattern is Wrong : C00-001'});
customerValidations.push({reg: cusNameRegEx, field: $('#customerName'),error:'Customer Name Pattern is Wrong : A-z 5-20'});
customerValidations.push({reg: cusAddressRegEx, field: $('#customerAddress'),error:'Customer Address Pattern is Wrong : A-z 0-9 ,/'});
customerValidations.push({reg: cusSalaryRegEx, field: $('#customerSalary'),error:'Customer Salary Pattern is Wrong : 100 or 100.00'});



$("#customerId,#customerName,#customerAddress,#customerSalary").on('keyup', function (event) {
    checkCusValidity();
});

$("#customerId,#customerName,#customerAddress,#customerSalary").on('blur', function (event) {
    checkCusValidity();
});

function checkCusValidity() {
    let errorCount=0;
    for (let validation of customerValidations) {
        if (checkCus(validation.reg,validation.field)) {
            textCusSuccess(validation.field,"");
        } else {
            errorCount=errorCount+1;
            setCusTextError(validation.field,validation.error);
        }
    }
    setCusButtonState(errorCount);
}

function checkCus(regex, txtField) {
    let inputValue = txtField.val();
    return regex.test(inputValue) ? true : false;
}

function textCusSuccess(txtField,error) {
    if (txtField.val().length <= 0) {
        defaultCusText(txtField,"");
    } else {
        txtField.css('border', '2px solid green');
        txtField.parent().children('span').text(error);
    }
}

function setCusTextError(txtField,error) {
    if (txtField.val().length <= 0) {
        defaultCusText(txtField,"");
    } else {
        txtField.css('border', '2px solid red');
        txtField.parent().children('span').text(error);
    }
}

function defaultCusText(txtField,error) {
    txtField.css("border", "1px solid #ced4da");
    txtField.parent().children('span').text(error);
}

function setCusButtonState(value){
    if (value>0){
        $("#btnSaveCustomer").attr('disabled',true);
    }else{
        $("#btnSaveCustomer").attr('disabled',false);
    }
}

$("#clearCus").click(function () {
    clearAllCusData();
    $("#customerId").val(cusIdGenerate());
});

function clearAllCusData() {
    $('#customerId').val("");
    $('#customerName').val("");
    $('#customerAddress').val("");
    $('#customerSalary').val("");

    $('#cId').val("");
    $('#cName').val("");
    $('#cSalary').val("");
    $('#cAddress').val("");
}