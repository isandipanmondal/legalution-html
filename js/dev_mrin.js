'use strict'
var baseUrl="";
$(document).ready(function(){
    getBasePath();
    talk_io_widget();
    console.log(baseUrl);

    //rti related form section 
    $("#rti_form1").validate({
        rules:{
            name:{
                required:true,
                maxlength:100,
            },
            fname:{
                required:true,
                maxlength:100,
            },
            mno:{
                required:true,
                digits:true,
                minlength:10,
                maxlength:10,
            },
            Email:{
                required:true,
                email:true,
            },
            address:{
                required:true,
                maxlength:200,
            },
            states:{
                required:true,
                maxlength:100,
            },
            pin:{
                required:true,
                minlength:6,
                maxlength:6,
            },
        },
        errorElement:"em",
        errorClass:"text-danger",
        validCalss:"text-success",
        submitHandler:function(form){
            // maild basic details of the user who filled the data
            let frmdata = $(form).serializeArray();
            //now save all the form data into the storage 
            let rti_form_key_value={};
            $.each(frmdata,function(i,item){
                rti_form_key_value[item.name] = item.value;
            });
            cleareData('rti_form_key_value');
            doSaveData('rti_form_key_value',rti_form_key_value);
            //how send send email about this complain
            let path = "backend.php?func=rti_basic_info";
            doAjaxCall(path,rti_form_key_value,function(response){
                form.submit();
            });
        }
    });

    // rti payment section 
    $("#rti_payment").bind("click",function(e){
        e.preventDefault();
        let rti_form_key_value = getSavedData('rti_form_key_value');
        //now add the extra value is urgent or not 
        let urgent_work=0;
        if($("#urgent_work").is(":checked")){
            urgent_work=1;
        }
        rti_form_key_value['urgent_work']=urgent_work;
        cleareData('rti_form_key_value');
        doSaveData('rti_form_key_value',rti_form_key_value);
        //now call for pyment response 
        let path = "backend.php?func=rti_payment_request";
        doAjaxCall(path,rti_form_key_value,function(response){
            if(!response.error){
                //need to redirect to the payment url
                window.location=response.full_res.url;//get the payment url redirection
            }
        });
    });

});

//basepath retrive
function getBasePath(){
    let htef = location.href;
    baseUrl= htef.substring(0,htef.lastIndexOf('/')+1);
}
//validator function

function doAjaxCall(path,data,callback){
    let msg='Something wrong.';
    let error=true;
    let full_res={};
    $.ajax({
        url:baseUrl+path,
        type:'post',
        dataType:'json',
        contentType:'application/json;',
        data:JSON.stringify(data),
        start:function(){
            console.log("start");
        },
        success:function(response){
            msg=response.messages;
            if(response.status){
                error=false;
            }
            full_res=response;
        },
        error:function(){
            console.log("error");
        },
        complete:function(){
            console.log("End");
            callback({error:error,msg:msg,full_res:full_res});
        }
    });
}

//store the data into the browser db
function doSaveData(keyName='',datas=[]){
    if(checkedSupport()){
        window.localStorage.setItem(keyName,JSON.stringify(datas));
    }
}

function getSavedData(keyName=''){
    let dataObj=[];
    if(checkedSupport()){
        let datastr = window.localStorage.getItem(keyName);
        dataObj =  JSON.parse(datastr);
    }
    return dataObj;
}

function cleareData(keyName){
    if(checkedSupport()){
        window.localStorage.removeItem(keyName);
    }
}

function checkedSupport(){
    if (typeof(Storage) !== "undefined") {
        return true;
    } else {
        // No web storage Support.
        console.log("browser not supported ");
        return false;
    }
}

//talk.to chat widget 
function talk_io_widget(){
    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    (function(){
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/5e567c09298c395d1ce9eba8/1e4rbi3uu';
    s1.charset='UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
    })();
}
//end talk widget