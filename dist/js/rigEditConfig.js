var globalChoice = -1;
var SUCC_EXEC = "SUCC_EXEC";
var ERRO_NOT_FOUND = "ERRO_NOT_FOUND";
var delete_id = null;
function checkIfExistInBatch(data, coin, des, bat, software, platform,name) {

    for (var index = 0; index < data.length; index++) {
        var item = data[index];
        if (item.platform == platform && item.software == software &&
            item.coins_related == coin && (removeAllSpace(item.description) == removeAllSpace(des)) &&
            item.bat_script == bat && item.name == name) {
            return true;
        }
    }
    return false;
}

function ask(id) {
    delete_id = id;
    $("#a").click();
}
function deleteCoin() {
    $("#nobutton").click();

    var id = delete_id;
    if(!id){
        alert("Chưa chọn loại tiền để xóa");
        return;
    }

    if(!globalData.coins_related){
        alert("không lấy được coin related");
        return;
    }
    var name = null;
    for(var index = 0;index < globalBatch.length;index ++){
        var obj = globalBatch[index];
        if(obj.id == id){
            name = obj.coins_related;
        }
    }


    $.ajax({
        url: "/rigEditConfig",
        type: "post", //send it through get method
        data: {
            action: "check_coin_using",
            data: JSON.stringify({
                runbatch_id: id
            })
        },
        success: function (response) {
            //Do Something
          if(response.response_code == "SUCC_CHECK_COIN_USING"){
              if(response.data == 0){
                  $.ajax({
                      url: "/rigEditConfig",
                      type: "post", //send it through get method
                      data: {
                          action: "delete_coin",
                          data: JSON.stringify({
                              id: id
                          })
                      },
                      success: function (response1) {
                          //Do Something
                          var pos = -1;
                          for(var index = 0;index < globalBatch.length;index ++){
                              if(globalBatch[index].id == id){
                                  pos = index;
                              }
                          }
                          if(pos > -1){
                              globalBatch.splice(pos, 1);
                          }
                          only_reset();
                          var table = $('#datatable-tabletools').DataTable();
                          table
                              .row($("#row"+id).parents('tr'))
                              .remove()
                              .draw();
                          // var row = document.getElementById("row"+id);
                          // row.parentNode.removeChild(row);
                          delete_id = null;
                          new PNotify({
                              title: 'Thông báo!',
                              text: 'Đã xóa thành công ['+name+']',
                              type: 'success'
                          });
                      },
                      error: function (xhr) {
                          //Do Something to handle error
                          delete_id = null;
                          new PNotify({
                              title: 'Thất bại!',
                              text: "Server bảo trì",
                              type: 'error'
                          });
                      }
                  });
              }else {
                  new PNotify({
                      title: 'Thất bại!',
                      text: 'Bạn không thể xóa ['+name+'] vì đang có '+response.data+' máy đang đào loại tiền này',
                      type: 'error'
                  });
              }
          }else if(response.response_code == "NOT_FOUND_CHECK_COIN_USING"){
              new PNotify({
                  title: 'Thất bại!',
                  text: "Loại đồng này không tồn tại",
                  type: 'error'
              });
          }
        },
        error: function (xhr1) {
            //Do Something to handle error
            new PNotify({
                title: 'Thất bại!',
                text: "Server bảo trì",
                type: 'error'
            });
        }
    });



}

function updateMachine() {
    var id = globalData.id;
    var email = globalData.email;
    var name = document.getElementById("name").value;
    var e = document.getElementById("select-coin");
    var coin_name_temp = e.options[e.selectedIndex].value;
    var coin_name = coin_name_temp;
    var pool = document.getElementById("pool").value;
    var wallet = document.getElementById("wallet").value;
    var machineId = globalData.machine_id;
    var platform = globalData.platform;
    var checked = document.getElementById("auto").checked;
    var auto_start = 0;
    if(checked){
        auto_start = 1;
    }

    $.ajax({
        url: "/rigEditConfig",
        type: "post", //send it through get method
        data: {
            action: "update_machine",
            data: JSON.stringify({
                id: id,
                email: email,
                name: name,
                coin_name: coin_name,
                pool: pool,
                wallet: wallet,
                machineId: machineId,
                platform: platform,
                auto_start: auto_start
            })
        },
        success: function (response) {
            //Do Something
            if(response.response_code == ERRO_NOT_FOUND){
                alert(response.description);
            }else{
                alert("thành công");
            }
            return false;

        },
        error: function (xhr) {
            //Do Something to handle error
            alert("lỗi");
        }
    });

}

function updateAndRunMachine() {
    var id = globalData.id;
    var email = globalData.email;
    var name = document.getElementById("name").value;
    var e = document.getElementById("select-coin");
    var coin_name_temp = e.options[e.selectedIndex].value;
    var coin_name = coin_name_temp;
    var pool = document.getElementById("pool").value;
    var wallet = document.getElementById("wallet").value;
    var machineId = globalData.machine_id;
    var platform = globalData.platform;
    var checked = document.getElementById("auto").checked;
    var auto_start = 0;
    if(checked){
        auto_start = 1;
    }

    $.ajax({
        url: "/rigEditConfig/run",
        type: "post", //send it through get method
        data: {
            action: "update_machine",
            data: JSON.stringify({
                id: id,
                email: email,
                name: name,
                coin_name: coin_name,
                pool: pool,
                wallet: wallet,
                machineId: machineId,
                platform: platform,
                auto_start: auto_start
            })
        },
        success: function (response) {
            //Do Something
            if(response.response_code == ERRO_NOT_FOUND){
                alert(response.description);
            }else{
                alert("thành công");
            }
            return false;

        },
        error: function (xhr) {
            //Do Something to handle error
            alert("lỗi");
        }
    });

}

function removeAllSpace(text) {
    return text.replace(/ /g, '');
}

function add(platform) {
    var text = document.getElementById("btn-add").innerHTML;
    if (text == "Thêm đơn vị đào") {
        var coin = document.getElementById('coin').value;
        var des = document.getElementById('des').value;
        var bat = document.getElementById('bat').value;
        var name = document.getElementById('name-batch').value;
        var e = document.getElementById("software-select");
        var softwareID = e.options[e.selectedIndex].value;
        var is_global = $('#is_global_check').is(":checked");
        if(is_global){
            is_global = 1;
        }else {
            is_global = 0;
        }
        if (coin.length == 0 || name.length == 0) {
            alert("còn trống dữ liệu")
            return;
        }
        if (des.length == 0) des = " ";
        addRunBatchToDB(platform, softwareID, coin, des, bat, name,email,is_global, function (status, response) {
            if (status == "ok") {
                var a = response;
                var id = response.data.insertId;
                globalBatch.push({
                    id: id,
                    platform: platform,
                    software: softwareID,
                    coins_related: coin,
                    description: des,
                    bat_script: bat,
                    name: name,
                    is_global: is_global
                });
                var table = $('#datatable-tabletools').DataTable();
                table.row.add( [
                    name,
                    coin,
                    getSoftwareFromId(softwareID),
                    des,
                    platform,
                    '<a class="modal-with-form btn btn-default"  onclick="edit(' + id + ',this,true)" >'+
                        ' <i class="fa fa-pencil"></i></a>'+
                    '<button class="btn btn-default" id="row'+ id+'" onclick="ask(' + id + ')">'+
                        ' <i class="fa fa-trash-o" ></i></button>'
                ] ).draw( false );
                sortBatchArray();
                resetCoinSelect();
                only_reset();
            }
        });
    } else  {
        var id = globalChoice;
        var coin = document.getElementById('coin').value;
        var des = document.getElementById('des').value;
        var bat = document.getElementById('bat').value;
        var name = document.getElementById('name-batch').value;
        var e = document.getElementById("software-select");
        var softwareID = e.options[e.selectedIndex].value;
        var is_global = $('#is_global_check').is(":checked");
        if(is_global){
            is_global = 1;
        }else {
            is_global = 0;
        }
        if (coin.length == 0 || name.length == 0) {
            alert("còn trống dữ liệu");
            return;
        }
        updateRunBatchToDB(id, platform, softwareID, coin, des, bat, name, is_global,  function (status) {
            if (status == "ok") {
                for (var index = 0; index < globalBatch.length; index++) {
                    var item = globalBatch[index];
                    if (item.id == id) {
                        item.platform = platform;
                        item.software = softwareID;
                        item.coins_related = coin;
                        item.description = des;
                        item.bat_script = bat;
                        item.name = name;
                        item.is_global = is_global;
                        var select = document.getElementById("select-coin");
                        select.options[index].innerHTML = name;

                        break;
                    }
                }

                var table = $('#datatable-tabletools').DataTable();
                table
                    .row($("#row"+id).parents('tr'))
                    .remove()
                    .draw();
                table.row.add( [
                    name,
                    coin,
                    getSoftwareFromId(softwareID),
                    des,
                    platform,
                    '<a class="modal-with-form btn btn-default"  onclick="edit(' + id + ',this,true)" >'+
                    ' <i class="fa fa-pencil"></i></a>'+
                    '<button class="btn btn-default" id="row'+ id+'" onclick="ask(' + id + ')">'+
                    ' <i class="fa fa-trash-o" ></i></button>'
                ] ).draw( false );

                // for (i = 0; i < length; i++) {
                // }
                resetCoinSelect();
                // resetTableBatchData(globalBatch);
                only_reset();

            }

        });
    }
    $("#escape").click();
}

function getSoftwareIdFromName(name) {
    for (var index = 0; index < globalDownloadLink.length; index ++){
        var id = globalDownloadLink[index].id;
        var ab = globalDownloadLink[index].software+" "+globalDownloadLink[index].version;
        if(ab == name){
            return id;
        }
    }
}


function getSoftwareFromId(id) {
    for(var index = 0;index < globalDownloadLink.length; index ++){
        var tempId = globalDownloadLink[index].id;
        if(tempId == id){
            return globalDownloadLink[index].name+" "+globalDownloadLink[index].version;
        }
    }
}


function naturalCompare(a, b) {
    var ax = [], bx = [];

    a.coins_related.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
        ax.push([$1 || Infinity, $2 || ""])
    });
    b.coins_related.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
        bx.push([$1 || Infinity, $2 || ""])
    });

    while (ax.length && bx.length) {
        var an = ax.shift();
        var bn = bx.shift();
        var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
        if (nn) return nn;
    }

    return ax.length - bx.length;
}

function sortBatchArray() {
    globalBatch.sort(naturalCompare);
}

function addRunBatchToDB(platform, software, coin, des, bat, name,email,is_global, callback) {


    var data = {
        coin: coin,
        platform: platform,
        software: software,
        des: des,
        bat: bat,
        name: name,
        email: email,
        is_global: is_global
    };

    $.ajax({
        url: "/rigEditConfig",
        type: "post", //send it through get method
        data: {
            action: "add",
            data: JSON.stringify(data)
        },
        success: function (response) {
            //Do Something
            callback("ok", response);
        },
        error: function (xhr) {
            //Do Something to handle error
            callback("err");
        }
    });
}

function apply(platform) {
    var id = globalData.id;
    var coin = document.getElementById('coin').value;
    var des = document.getElementById('des').value;
    var bat = document.getElementById('bat').value;
    var e = document.getElementById("software-select");
    var softwareID = e.options[e.selectedIndex].value;
    var name = document.getElementById('name-batch').value;
    var temp = coin+" | "+name;
    var is_global = $('#is_global_check').is(":checked");
    if(is_global){
        is_global = 1;
    }else {
        is_global = 0;
    }
    if (coin.length == 0 || name.length == 0) {
        alert("còn trống dữ liệu")
        return;
    }
    if (checkIfExistInBatch(globalBatch, coin, des, bat, softwareID, platform,name)) {

                globalData.coins_related = temp;
                resetCoinSelect();
                only_reset();

    } else {

        if (des.length == 0) des = " ";
        addRunBatchToDB(platform, softwareID, coin, des, bat, name, email, is_global,function (status, response) {
            if (status == "ok") {
                var id = response.data.insertId;
                globalChoice = id;
                globalBatch.push({
                    id: id,
                    platform: platform,
                    software: softwareID,
                    coins_related: coin,
                    description: des,
                    bat_script: bat,
                    name: name
                });
                globalData.coins_related = coin+" | "+name;
                var table = $('#datatable-tabletools').DataTable();
                table.row.add( [
                    name,
                    coin,
                    getSoftwareFromId(softwareID),
                    des,
                    platform,
                    '<a class="modal-with-form btn btn-default" onclick="edit(' + id + ',this,true)" >'+
                    ' <i class="fa fa-pencil"></i></a>'+
                    '<button class="btn btn-default" id="row'+ id+'" onclick="ask(' + id + ')">'+
                    ' <i class="fa fa-trash-o" ></i></button>'
                ] ).draw( false );
                sortBatchArray();
                applyMiner(platform);
                resetCoinSelect();
                only_reset();

                // resetTableBatchData(globalBatch, id, coin, software, des, platform, bat);
            }else {
                only_reset();
            }

        });
    }


}

function applyMiner(platform) {
    var id = globalData.id;
    var coin = document.getElementById('coin').value;
    var des = document.getElementById('des').value;
    var bat = document.getElementById('bat').value;
    var e = document.getElementById("software-select");
    var softwareID = e.options[e.selectedIndex].value;

    var name = document.getElementById('name-batch').value;
    var temp = coin+" | "+name;
    if (coin.length == 0 || name.length == 0) {
        alert("còn trống dữ liệu");
        return;
    }
    if (checkIfExistInBatch(globalBatch, coin, des, bat, softwareID, platform, name)) {

                resetCoinSelect();
                only_reset();

    }
}


function resetCoinSelect() {

    var select = document.getElementById("select-coin");

    $("#select-coin").empty();
    var hold = -1;
    for (var index = 0; index < globalBatch.length; index++) {
        var coinTemp = globalBatch[index].coins_related+" | "+globalBatch[index].name;

        var option = document.createElement("option");
        option.text = coinTemp;
        if (coinTemp == globalData.coins_related) {
            option.selected = true;
            var select2 = document.getElementById("select2-chosen-3");
            select2.innerHTML = globalData.coins_related;
        }
        select.add(option);
    }

}
function updateRunBatchToDB(id, platform, software, coin, des, bat, name, is_global, callback) {


    var data = {
        coin: coin,
        platform: platform,
        software: software,
        des: des,
        bat: bat,
        id: id,
        name: name,
        is_global: is_global
    };

    $.ajax({
        url: "/rigEditConfig",
        type: "post", //send it through get method
        data: {
            action: "update",
            data: JSON.stringify(data)
        },
        success: function (response) {
            //Do Something
            callback("ok");
        },
        error: function (xhr) {
            //Do Something to handle error
            callback("error");
        }
    });
}


function resetTableBatchData(data) {

    var elmtTable = document.getElementById('table-batch');
    var tableRows = elmtTable.getElementsByTagName('tr');
    var rowCount = tableRows.length;

    for (var x = rowCount - 1; x >= 0; x--) {
        elmtTable.removeChild(tableRows[x]);
    }
    for (var index = 0; index < data.length; index++) {
        var item = data[index];
        var softwareID = item.software;
        var coin = item.coins_related;
        var des = item.description;
        var bat = item.bat_script;
        var platform = item.platform;
        var id = item.id;
        var name = item.name;
        softwareItemText = getSoftwareFromId(softwareID);

        var table = document.getElementById("table-batch");
        var row = table.insertRow(table.rows.length);
        row.id = "row"+id;
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        cell1.innerHTML = name;
        cell2.innerHTML = coin;
        cell3.innerHTML = softwareItemText;
        cell4.innerHTML = des;
        cell5.innerHTML = platform;
        var cell6 = row.insertCell(5);
        var a = document.createElement('a');
        a.className = "modal-with-form modal-action btn btn-default";
        a.id = "row-"+id;
        var i = document.createElement('i');
        i.className = "fa fa-pencil";
        a.append(i);

        cell6.appendChild(a);
        a.onclick = function (component) {
            $("#openModal").click();

            var temp = component.currentTarget.id;
            var arr = temp.split("-");
            var id = arr[1];
            for (var index = 0; index < globalBatch.length; index++) {
                var item = globalBatch[index];
                if (item.id == id) {
                    edit(id, component.currentTarget);
                    break;
                }
            }
        };
        var button = document.createElement('button');
        button.id = "button-" + id;
        button.className = "btn btn-default";
        button.onclick = function (component) {
            var temp = component.currentTarget.id;
            var arr = temp.split("-");
            var id = arr[1];
            ask(id);
        };
        var i1 = document.createElement('i');
        i1.className = "fa fa-trash-o";
        button.append(i1);
        cell6.appendChild(button);

    }


}

function edit(id, component, needOpen) {
    for (var index = 0; index < globalBatch.length; index++) {
        var item = globalBatch[index];
        if (item.id == id) {
            var coin = item.coins_related;
            var softwareID = item.software;
            var des = item.description;
            var bat = item.bat_script;
            var name = item.name;
            var is_global = item.is_global;
            globalChoice = id;

            if (is_global == 1){
                $('#is_global_check').prop('checked', true);

            }else {
                $('#is_global_check').prop('checked', false);

            }

            // $(".batch-action").not(this).prop('checked', false);
            // component.checked = true;
            document.getElementById("name-batch").value = name;
            document.getElementById("coin").value = coin;
            document.getElementById("des").value = des;
            document.getElementById("bat").value = bat;
            //
            for (var index = 0; index < globalDownloadLink.length; index++) {
                var id = globalDownloadLink[index].id;
                if (id == softwareID) {
                    document.getElementById("software-select").selectedIndex = index;
                    break;
                }
            }
            document.getElementById("btn-add").innerHTML = "Lưu thay đổi";
            if(needOpen){
                $("#openModal").click();
            }
            break;
        }
    }

}

function only_reset() {
    document.getElementById("coin").value = "";
    document.getElementById("des").value = "";
    document.getElementById("bat").value = "";
    document.getElementById("name-batch").value = "";
    document.getElementById("btn-add").innerHTML = "Thêm đơn vị đào"
}

function reset() {
    var text = document.getElementById("btn-add").innerHTML;
    if (text == "Thêm đơn vị đào") {
        document.getElementById("coin").value = "";
        document.getElementById("des").value = "";
        document.getElementById("bat").value = "";
        document.getElementById("name-batch").value = "";
        document.getElementById("btn-add").innerHTML = "Thêm đơn vị đào"
    }else {
        edit(globalChoice);
    }


}
