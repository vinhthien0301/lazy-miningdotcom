function log_out() {
    $.ajax({
        url: "/logout",
        type: "post", //send it through get method

        success: function (response) {
            //Do Something
            if (response.response_code == "ERRO_TOKEN_NOT_EXIST") {
                new PNotify({
                    title: 'Thất bại!',
                    text: "Token không tồn tại",
                    type: 'error'
                });
            }else if(response.response_code == "SUCC_LOG_OUT"){
            }else {
                new PNotify({
                    title: 'Thất bại!',
                    text: "Server bảo trì",
                    type: 'error'
                });
            }
            window.location.href = "/login";

        },
        error: function (xhr) {
            new PNotify({
                title: 'Thất bại!',
                text: "Server bảo trì",
                type: 'error'
            });
            window.location.href = "/login";

        }
    });
}

function count_machine() {
    $.ajax({
        url: "/utility/count_machine",
        type: "post", //send it through get method
        success: function (response) {
            //Do Something
            if (response.response_code == "SUCC_COUNT_MACHINE") {
                var number = response.data;
                if(number > 0){
                    document.getElementById("count_number_span").textContent = number +" máy hoạt động";
                }else {
                    document.getElementById("count_number_span").classList.add("hide");

                }

            }else if(response.response_code == "ERRO_TOKEN_NOT_EXIST"){
                window.location.href =  "/login";
            }

        },
        error: function (xhr) {
        }
    });

  

}
function handle_ui_left_menu() {

    var ul = document.getElementById("left-menu");
    for(var index=0;index<ul.children.length;index++){
        var li = ul.children[index];
        var id = li.id;
        if(page_name == id){
            if(page_name == "dashboard_page") {
                li.classList.add("nav-active");
                break;
            }else if(page_name == "desktop_update_page") {
                li.classList.add("nav-active");
                break;
            }else if(page_name == "config_page") {
                li.classList.add("nav-active");
                for (var alpha = 0; alpha < li.children.length; alpha++) {
                    var ul = li.children[alpha];
                    var name = ul.localName;
                    if (name == "ul") {
                        ul.className = "nav nav-children";
                        for (var beta = 0; beta < ul.children.length; beta++) {
                            var liChild = ul.children[beta];
                            var numberDetail = page_number_child_left_menu;
                            if (numberDetail == beta) {
                                liChild.classList.add("nav-active");
                                li.className = ("nav-parent nav-expanded nav-active");
                            } else {
                                liChild.classList.remove("nav-active");
                            }
                        }
                    }
                }
                break;
            }else if(page_name == "profit_page") {
                li.classList.add("nav-active");
                break;
            }else if(page_name == "eventManagement_page") {
                li.classList.add("nav-active");
                break;
            }else if(page_name == "backend_page"){
                li.className = "nav-parent nav-expanded nav-active";
                if(page_child_name == "desktop_update_page"){
                    document.getElementById("desktop_update_page").className = "nav-active";
                }else if(page_child_name == "user_mange_desktop_page"){
                    var a = document.getElementById("user_management");
                    a.classList.add("nav-expanded");
                    var b = document.getElementById("user_management_desktop");
                    b.classList.add("nav-active");

                }else if(page_child_name == "order_management_page"){
                    var a = document.getElementById("user_management");
                    a.classList.add("nav-expanded");
                    var b = document.getElementById("order_management_page");
                    b.classList.add("nav-active");

                }else if(page_child_name == "user_mange_web_page"){
                    var a = document.getElementById("user_management");
                    a.classList.add("nav-expanded");
                    var b = document.getElementById("user_management_web");
                    b.classList.add("nav-active");
                }else if(page_child_name == "user_mange_mobile_page"){
                    var a = document.getElementById("user_management");
                    a.classList.add("nav-expanded");
                    var b = document.getElementById("user_management_mobile");
                    b.classList.add("nav-active");
                }
            }
        }

    }
}

count_machine();
handle_ui_left_menu();