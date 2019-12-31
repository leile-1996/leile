var nowPage = 1, pageSize = 15, allPageSize = 0, tableData = [];
var flag = false;
// 绑定事件
var lock = false;
function bindEvent() {
	$('.menu-list').on('click', 'dd', function() {
		var id = $(this).data('id');
		// data会找到元素所有有data关键字的属性，所以也能找到data-id，也可以用attr.
		// 获取表单数据并渲染页面
		if(id == 'student-list') {
			getTableData();
		}
		$(this).addClass('active').siblings().removeClass('active');
		$('.content').fadeOut();
		setTimeout(function() {
			$('#' + id).fadeIn();
		}, 400)
	});
	$('#add-student-btn').click(function(e) {
		if(flag) {
			return false;
		}
		flag = true;
		// 注意，表单提交时会自动刷新，我们要阻止默认事件
		e.preventDefault();
		// jq中有两个个专门获取表单数据的方法：serialize()，serializeArray()
		var data = $('#add-student-form').serializeArray();
		// 将数据转化为对象
		data = formatObj(data);
		transformData('/api/student/addStudent',data,function(res) {
				// 清空表单
				// 注意jq没有reset方法，我们要把它转化为原生js
				$('#add-student-form')[0].reset();
				// 跳转到学生列表页，手动触发点击事件
				$('.list').trigger('click');
				flag = false;
		});
	});
	$('#edit-student-btn').click(function(e) {
		if(flag){
			return false;
		}
		flag = true;
		e.preventDefault();
		var data = $('#edit-student-form').serializeArray();
		data = formatObj(data);
		// console.log(data);
		transformData('/api/student/updateStudent',data,function(res) {
					alert('数据修改成功');
					// $('.list').trigger('click');
					$('.mask').trigger('click');
					var val = $('#search-word').val();
		    		// 如果搜索框有关键字，那就要注意，不能直接翻页渲染全部的数据
					if(val) {
						filterData();
					}else{
						getTableData();
					}
		    	
				flag = false;
		});
	});


	$('#tbody').on('click', '.edit', function(e) {
		var index = $(this).parents('tr').index();
		renderForm(tableData[index]);
		$('.dialog').slideDown();
	});
	$('#tbody').on('click', '.del', function(e) {
		var index = $(this).parents('tr').index();
		var isDel = window.confirm('确实删除吗？');
		if(isDel) {
			transformData('/api/student/delBySno',{
				sNo: tableData[index].sNo
			}, function() {
				alert('已删除');
				$('.list').trigger('click');
			})
		}
	});
	$('.mask').click(function() {
		$('.dialog').slideUp();
	});
	// 搜索
	$('#search-submit').click(function(e) {
		var val = $('#search-word').val();
		// 搜索时要重置nowPage,否则会提示“页码错误”，因为nowPage > allPage,见page插件的js
		nowPage = 1;
		if(val) {
			filterData();
		}else{
			getTableData();
		}
	})
}
function init() {
	bindEvent();
	$('.list').trigger('click');
}
init();


function formatObj(arr) {
	// console.log(arr);
	var obj = {};
	$.each(arr, function(index, ele) {
		if(!obj[ele.name]) {
			obj[ele.name] = ele.value;
		}
	});
	return obj;
}

function getTableData() {
	transformData('/api/student/findByPage',{page:nowPage, size:pageSize}, function(res) {
			// console.log(res);
			allPageSize = res.data.cont;
			tableData = res.data.findByPage;
			renderTable(tableData);
	})
}

function renderTable(data) {
	var str ='';
	data.forEach(function(item, index) {
        str += '<tr>\
        <td>' + item.sNo + '</td>\
        <td>' + item.name +'</td>\
        <td>' + ( item.sex ? '女' : '男')+ '</td>\
        <td>' + item.email + '</td>\
        <td>' + (new Date().getFullYear() - item.birth) + '</td>\
        <td>' + item.phone +'</td>\
        <td>' + item.address + '</td>\
        <td>\
            <button class="btn edit" >编辑</button>\
            <button class="btn del">删除</button>\
        </td>\
    </tr>'
    });
    $('#tbody').html(str);
    // 渲染时添加翻页插件
    $('#turn-page').page({
    	allPageSize: allPageSize,
    	nowPage: nowPage,
    	pageSize: pageSize,
    	changePageCb: function (obj) {
    		nowPage = obj.nowPage;
    		pageSize = obj.pageSize;
    		// getTableData();
    		var val = $('#search-word').val();
    		// 如果搜索框有关键字，那就要注意，不能直接翻页渲染全部的数据
			if(val) {
				filterData();
			}else{
				getTableData();
			}
	    	}
    })
}

function transformData(keyurl, data, cb) {
	$.ajax({
		type: 'get',
		url: 'http://api.duyiedu.com' + keyurl,
		data: $.extend(data,{appkey:'leile_1556617731806'}),
		dataType: 'json',
		success: function(res) {
			if(res.status == 'success'){
				cb(res)
			}else{
				alert(res.msg)
			}
		}
	})
}
// 回填数据表单
function renderForm(data) {
	var form = document.getElementById('edit-student-form');
	for(var prop in data) {
		if(form[prop]) {
			form[prop].value = data[prop];
		}
	}
	console.log(data);
}

function filterData(val) {
	transformData('/api/student/searchStudent',{
		sex:-1,
		page:nowPage,
		size: pageSize,
		search: val,
	}, function(res) {
		allPageSize = res.data.cont;
		renderTable(res.data.searchList);
	})
}