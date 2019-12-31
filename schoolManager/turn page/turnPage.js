(function($){

	function TurnPage(options) {
		this.wrap = options.wrap;
		this.allPageSize = options.allPageSize;
		this.nowPage = options.nowPage;
		this.pageSize = options.pageSize;
		this.allPage = Math.ceil(this.allPageSize / this.pageSize);
		this.changePageCb = options.changePageCb;
		if(this.nowPage > this.allPage) {
			alert('页码错误');
			return false;
		}
		this.init = function () {
			this.createDom();
			this.bindEvent();
		}
	}
	TurnPage.prototype.createDom = function () {
		// 清空wrap
		$(this.wrap).empty();
		// 每页条数
		var oDiv = $('<div class="page-size"><span>每页</span></div>');
		var oInp = $('<input type="number" class="size" min=1 max=50 value="' + this.pageSize + '">');

		var oUl = $('<ul class="my-turn-page"></ul>');
		oDiv.append(oInp).appendTo(oUl);
		// 展示三页
		// if(this.nowPage > 1) {
		// 	$('<li class="prev-page">上一页</li>').appendTo(oUl);
		// 	$('<li class="num">1</li>').appendTo(oUl);
		// }
		// if(this.nowPage > 2) {
		// 	$('<span>...</span>').appendTo(oUl);
		// }
		// $('<li class="num active">' + this.nowPage + '</li>').appendTo(oUl);
		// if(this.nowPage < this.allPage - 1) {
		// 	$('<span>...</span>').appendTo(oUl);
		// }
		// if(this.nowPage != this.allPage) {
		// 	$('<li class="num">' + this.allPage +'</li>').appendTo(oUl);
		// 	$('<li class="next-page">下一页</li>').appendTo(oUl);
		// }

		// 展示多页，中间5页
		if(this.nowPage > 1) {
			$('<li class="prev-page">上一页</li>').appendTo(oUl);
		}
		if(this.nowPage >3) {
			$('<li class="num">1</li>').appendTo(oUl);
		}
		if(this.nowPage > 4) {
			$('<span>...</span>').appendTo(oUl);
		}
		// 中间五页
		for(var i = this.nowPage -2; i<=this.nowPage +2; i++) {
			if(i == this.nowPage) {
				$('<li class="num active">'+ i +'</li>').appendTo(oUl);
			}else if(i >0 && i <=this.allPage) {
				$('<li class="num">'+ i +'</li>').appendTo(oUl);
			}
		}

		if(this.nowPage +2 < this.allPage-1){
			$('<span>...</span>').appendTo(oUl);
		}

		if(this.nowPage +2 < this.allPage) {
			$('<li class="num">' + this.allPage +'</li>').appendTo(oUl);
		}


		if(this.nowPage != this.allPage) {
			$('<li class="next-page">下一页</li>').appendTo(oUl);
		}

		this.wrap.append(oUl);
	}
	TurnPage.prototype.bindEvent = function () {
		// 封装插件时最好把作用域写上，this.wrap
		var self = this;
		// 首先是页码的点击事件
		$('.num', this.wrap).click(function () {
			var page = parseInt($(this).text());
			self.changePage(page);
		});
		// 然后是上下页的点击事件
		$('.prev-page', this.wrap).click(function () {
			if(self.nowPage > 1) {
				self.changePage(self.nowPage-1);
			}
		})
		$('.next-page', this.wrap).click(function () {
			if(self.nowPage < self.allPage) {
				self.changePage(self.nowPage+1);
			}
		})
		// 给input框添加change事件，change会在失去焦点时触发
		$('.size', this.wrap).change(function () {
			self.pageSize = parseInt(this.value);
			self.allPage = Math.ceil(self.allPageSize /self.pageSize);
			self.changePage(1);
		})
	}
	TurnPage.prototype.changePage = function(page){
		this.nowPage = page;
		this.init();
		// 回调
		var self = this;
		this.changePageCb && this.changePageCb({
			nowPage: this.nowPage,
			pageSize: this.pageSize
		});
	}

	$.fn.extend({
		page: function(options) {
			options.wrap = this;
			var pageObj = new TurnPage(options);
			pageObj.init();
			return this;
		}
	})
})(jQuery)