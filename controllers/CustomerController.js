import CustomerModel from "../model/CustomerModel";
import {customerAr} from "../db/db";

$('#btnSaveCustomer').click(function (event) {
    cusSave($('#customerId').val(),$('#customerName').val(),$('#customerAddress').val(),$('#customerSalary').val());
});

function cusSave(customerID,customerName,customerAddress,customerSalary) {

    let customerObj = new CustomerModel(customerID, customerName, customerAddress, customerSalary);
    customerAr.push(customerObj);

    /*Double click to remove*/

    addCustomerTable();
    dblClickCusDelete();
    loadAllCustomerId();
    clearAllCusData();
}

function addCustomerTable() {
    $("#tblCustomer> tr").detach();

    for (var customer of customerAr){
        var row="<tr><td>"+customer.cusId+"</td><td>"+customer.cusName+"</td><td>"+customer.cusAddress+"</td><td>"+customer.cusSalary+"</td></tr>";
        $('#tblCustomer').append(row);
    }
    trCusSelector();
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

    for (let customerKey of customerAr) {

        //check the ComboBox Id Equal
        console.log($('#cusCombo').val());

        if($('#cusCombo').val()==="ID"){
            //check Id
            // alert(customerKey.id+"=="+$('#inputCusSearch').val());

            if(customerKey.cusId===$('#inputCusSearch').val()){
                $('#cId').val(customerKey.cusId);
                $('#cName').val(customerKey.cusName);
                $('#cSalary').val(customerKey.cusSalary);
                $('#cAddress').val(customerKey.cusAddress);
            }
        }else if($('#cusCombo').val()==="1"){
            //check Name
            if(customerKey.cusName===$('#inputCusSearch').val()){
                $('#cId').val(customerKey.cusId);
                $('#cName').val(customerKey.cusName);
                $('#cSalary').val(customerKey.cusSalary);
                $('#cAddress').val(customerKey.cusAddress);
            }
        }
    }
});

/*Double Click delete*/
function dblClickCusDelete() {
    $("#tblCustomer>tr").dblclick(function (){
        deleteCustomer($(this).children(':eq(0)').text());
        $(this).remove();
        addCustomerTable();
    });
}

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

