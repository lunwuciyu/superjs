/**
 * Created by user on 2016/12/12.
 */
$(function(){
    //表格初始化
    BlockUI.showDefBlockUI();
    //全选
    checkAllFun("#checkboxAll");
    initLoad();
    //查询时间
    var adSheetStartTimes = {
        elem: '#adSheetStartTime',
        format: 'YYYY-MM-DD',
        istime: true,
        istoday: true,
        isclear: true,
        issure: true,
        choose: function (datas) {
            adSheetEndTimes.min = datas;
            adSheetEndTimes.start = datas;
        }
    };
    $("#adSheetStartTime").click(function () {
        laydate(adSheetStartTimes);
    });

    var adSheetEndTimes = {
        elem: '#adSheetEndTime',
        format: 'YYYY-MM-DD',
        istime: true,
        istoday: true,
        isclear: true,
        issure: true,
        choose: function (datas) {
            adSheetStartTimes.max = datas;
        }
    };
    $("#adSheetEndTime").click(function () {
        laydate(adSheetEndTimes);
    });

    //导入时间
    var modalImportStartTimes = {
        elem: '#modalImportStartTime',
        format: 'YYYY-MM-DD',
        istime: true,
        istoday: true,
        isclear: true,
        issure: true,
        choose: function (datas) {
            modalImportEndTimes.min = datas;
            modalImportEndTimes.start = datas;
        }
    };
    $("#modalImportStartTime").click(function () {
        laydate(modalImportStartTimes);
    });

    var modalImportEndTimes = {
        elem: '#modalImportEndTime',
        format: 'YYYY-MM-DD',
        istime: true,
        istoday: true,
        isclear: true,
        issure: true,
        choose: function (datas) {
            modalImportStartTimes.max = datas;
        }
    };
    $("#modalImportEndTime").click(function () {
        laydate(modalImportEndTimes);
    });

    //数据导入弹框
    $(".jq-loaded-part #dataSheetImport").on("click",function(){
        // var data = {
        //     pageSize:0,
        //     pageNo:0
        // };
        /*$.ajax({
            url : '/file/source',
            type : 'get',
            // data: JSON.stringify(data),
            // contentType: "application/json;charset=utf-8",
            // dataType: "json",
            ifModified : false,
            success : function(response) {
                var $selectOpt = $("#dataSourcesn");
                $selectOpt.empty();
                $selectOpt.append('<option value="">请选择</option>');
                var data = response.list;
                for(var i=0;i<data.length;i++){
                    $selectOpt.append("<option value='" + data[i].code + "'>" + data[i].name + "</option>")
                }
                $("#DataImportModal").modal("show");
                resetCondition("#adDataSheetImport")
            }
        });*/
        $("#DataImportModal").modal("show");
        $("#add_file").empty();

    });

    //导入表单校验
    $("#adDataSheetImport").validate({
        rules:{
            importStartTime:"required",
            importEndTime:"required"
        },
        messages:{

        }
    });

    $("#submitImport").on("click",function () {
        if($("#adDataSheetImport").valid()){
                var options = {
                    success: function (response) {
                        if(response){
                            alert(response.msg);
                            $("#DataImportModal").modal("hide");
                            return;
                        }
                        //var $file = $('<div class="imgHoverBox"> <a href="' + responseText.data + '">' + filename + '</a> <i class="glyphicon glyphicon-remove-circle gly-removeImg"></i></div>');
                        //$("#add_file").append($file);
                    }, //处理完成
                    resetForm: true,
                    dataType: 'json'
                };
            $("#adDataSheetImport").ajaxSubmit(options);
        }
    });

    //表格导入
    $("#uploadFileBtn").each(function () {
        var $select = $(this);
        var i = 0;
        $select.click(function () {
            i++;
            var $form = $("<input id='uploadFile"+i+"' type='file' style='display:none' name='file'/>");
            $("#add_file").append($form);
            $("#uploadFile"+i).click();
            if(i>1){
                if($("#uploadFile"+(i-1)).val() == null || $("#uploadFile"+(i-1)).val() == ''){
                    console.log($("#uploadFile"+(i-1)).val());
                    $("#uploadFile"+(i-1)).remove();
                }

            }
            $("#uploadFile"+i).change(function () {
                var filename = $(this).val();
                if(filename.indexOf("|") > 0 || filename.indexOf(",") > 0 || filename.indexOf(";") > 0
                    || filename.indexOf("，") > 0 || filename.indexOf("；") > 0){
                    alert("文件名称不能包含敏感字符(| 或 , 或 ;)");
                    return;
                }
                var ua = window.navigator.userAgent;
                var isFirefox = ua.indexOf("Firefox") != -1; //火狐
                var isChrome = ua.indexOf("Chrome") && window.chrome; //谷歌
                if (isChrome) {
                    filename = filename.split("\\")[2];
                }
                if (filename.indexOf(".xls") > -1 ||filename.indexOf(".xlsx") > -1) {

                    var  $file = $('<div class="imgHoverBox"> <a href="#">' + filename + '</a> <i class="glyphicon glyphicon-remove-circle gly-removeImg"></i></div>');

                    $("#add_file").append($file);
                } else {
                    alert("只能上传excel表格！");
                }

            });


        })
    });
    //查询
    $("#searchBtn").on("click",function(){
        BlockUI.showDefBlockUI();
        initLoad();
    });
//导入
    $("body").on("mouseover", ".imgHoverBox", function () {
        $(this).find(".gly-removeImg").css("display", "block");
    });
    $("body").on("mouseout", ".imgHoverBox", function () {
        $(this).find(".gly-removeImg").css("display", "none");
    });
    $("body").on("click", ".gly-removeImg", function (e) {
        $(this).parent(".imgHoverBox").remove();
        e.stopPropagation();
    });

    //删除
    $("#dataSheetDelete").on("click",function(){
        if($("#adplanMapTbody input[type='checkbox']:checked").length < 1){
            alert("请选择所要删除的行！");
        }else{
            var  moveRow = [];
            $("#adplanMapTbody input[type='checkbox']:checked").each(function(){
                var  adMappingId =$(this).val();
                moveRow.push(adMappingId)
            });
            var moveRowId = {
                id:moveRow
            };
            layer.confirm('确定删除所选项吗？', {
                btn: ['确定','取消'],
                title:"提示"
            }, function(){
                $.ajax({
                    url : '/file/data/delete',
                    type : 'post',
                    data:JSON.stringify(moveRowId),
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    ifModified : false,
                    success : function(responseTex) {
                        layer.alert(responseTex.msg);
                        BlockUI.showDefBlockUI();
                        initLoad();
                    }
                });
            }, function(){

            });
        }

    });

});






//表格分页
function initLoad() {
    $("#page").empty();
    $("#page").hide();
    var data ={};
    data['page'] = $.trim($(".adMappingFormPage").val());
    data['limit'] = $.trim($(".adMappingFormLimit").val());
    data['startTime'] = $.trim($("#adSheetStartTime").val());
    data['endTime'] = $.trim($("#adSheetEndTime").val());
    data['content'] = $.trim($("#adSheetContent").val());

    $.ajax({
        url:'/file/data/show',
        type: 'POST',
        contentType: 'application/json;charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(data),
        success: function (response) {
            var $data = $("#adplanMapTbody");
            $data.empty();
            var page = response.list, total = response.total;
            if (total == 0|| typeof(total) == "undefined") {
                $(".shuju").show();
                $.unblockUI();
            } else {
                $("input.action").show();
                $("div.shuju").hide();
                for (var i = 0; i < page.length; i++) {
                    var $tr = $("<tr></tr>");
                    if($('#checkboxAll').length >0){
                        $tr.append("<td width='3%'><input class='checkboxs' type='checkbox' name='dataCheckbox' value='"+page[i].id+"'/></td>");
                    }
                    $tr.append("<td class='dataTime'>" + format_ymd(page[i].dataTime) + "</td>");
                    $tr.append("<td class='num'>" + ifUndefined(page[i].num) + "</td>");
                    $tr.append("<td class='name'>" + ifUndefined(page[i].name)+ "</td>");
                    $tr.append("<td class='adPlatform'>" + ifUndefined(page[i].adPlatform) + "</td>");
                    $tr.append("<td class='adType'>" + ifUndefined(page[i].adType) + "</td>");
                    $tr.append("<td class='showNum'>" + ifUndefined(page[i].showNum) + "</td>");
                    $tr.append("<td class='clickNum'>" + ifUndefined(page[i].clickNum) + "</td>");
                    $tr.append("<td class='consume'>" + ifUndefined(page[i].consume) + "</td>");
                    $tr.append("<td class='rebate'>" + ifUndefined(page[i].rebate) + "</td>");
                    $tr.append("<td class='download'>" + ifUndefined(page[i].download) + "</td>");
                    $tr.append("<td class='adBiz'>" + ifUndefined(page[i].adBiz) + "</td>");
                    $tr.append("<td class='adSubbiz'>" + ifUndefined(page[i].adSubbiz) + "</td>");
                    $tr.append("<td class='adKeywords'>" + ifUndefined(page[i].adKeywords) + "</td>");
                    $tr.append("<td class='adDpt'>" + ifUndefined(page[i].adDpt) + "</td>");
                    $tr.append("<td class='adAction'>" + ifUndefined(page[i].adAction) + "</td>");
                    $tr.append("<td class='beginTime'>" + format_ymd(page[i].beginTime) + "</td>");
                    $tr.append("<td class='endTime'>" + format_ymd(page[i].endTime) + "</td>");
                    $data.append($tr);
                }
                $("input[name='page']").val(response.page);
                $("input[name='limit']").val(response.limit);

                $('#page').Paging({
                    pagesize: response.limit,
                    count: response.total,
                    current: response.page,
                    toolbar: true,
                    hash: true,
                    callback: function (page, size) {
                        $("input[name='page']").val(page);
                        $("input[name='limit']").val(size);
                        initLoad();
                    }
                });
                $("#page").append("<span class='records'>总页数为："+response.totalPage+"页，共" + response.total + "条数据</span>");
                $("#page").show();
                $.unblockUI();
            }
        }
    })
}

//全选
function checkAllFun(ele){
    $(ele).click(function(){
        if (this.checked) {
            $(".checkboxs").prop("checked", true);
        } else {
            $(".checkboxs").prop("checked", false);
        }
    });

}
