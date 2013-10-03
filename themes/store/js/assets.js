//TODO: add delay before opening more details
/*
 var timer;
 var details;
 ;
 */

var opened = false, currentPage = 1, totalPages;

$(function() {
	var paging = store.asset.paging;
	paging.current = 1;

	$(document).on('click', '#assets-container .asset-add-btn', function(event) {
		var parent = $(this).parent().parent().parent();
		asset.process(parent.data('type'), parent.data('id'), location.href);
		event.stopPropagation();
	});

	$(document).on('click', '.asset > .asset-details', function(event) {
		var link = $(this).find('.asset-name > a').attr('href');
		location.href = link;
	});

	mouseStop();

	History.Adapter.bind(window, 'statechange', function() {
		var state = History.getState();
		if (state.data.id === 'assets') {
			renderAssets(state.data.context);
		}
	});

	var loadAssets = function(url) {
		caramel.data({
			title : null,
			header : ['header'],
			body : ['assets', 'pagination', 'sort-assets']
		}, {
			url : url,
			success : function(data, status, xhr) {
				//TODO: Integrate a new History.js library to fix this
				if ($.browser.msie == true && $.browser.version < 10) {
					renderAssets(data);
				} else {
					History.pushState({
						id : 'assets',
						context : data
					}, document.title, url);
				}

			},
			error : function(xhr, status, error) {
				theme.loaded($('#assets-container').parent(), '<p>Error while retrieving data.</p>');
			}
		});
		theme.loading($('.store-left'));
	};

	var loadAssetsScroll = function(url) {
		caramel.data({
			title : null,
			header : ['header'],
			body : ['assets', 'pagination', 'sort-assets']
		}, {
			url : url,
			success : function(data, status, xhr) {
				renderAssetsScroll(data);
				$('.loading-inf-scroll').hide();
			},
			error : function(xhr, status, error) {

			}
		});
		$('.loading-inf-scroll').show();
	};

	$(document).on('click', '#ul-sort-assets li a', function(e) {
		currentPage = 1;
		$('#ul-sort-assets li a').removeClass('selected-type');
		var thiz = $(this);
		thiz.addClass('selected-type');
		loadAssets(thiz.attr('href'));
		mouseStop();
		e.preventDefault();
	});

	$(document).on('click', '.pagination a', function(e) {
		e.preventDefault();
		var url = $(this).attr('href');
		if (url === '#') {
			return;
		}
		loadAssets(url);
	});

	

	var infiniteScroll = function() {
		totalPages = $('#assets-container').data('pages');
		if (currentPage < totalPages) {
			if ($(window).scrollTop() + $(window).height() >= $(document).height() * .8) {
				var selType = $('.selected-type').data('sort'),
					pathName = window.location.pathname,
					search = window.location.search;
				search += (search != "") ? '&' : '?';
					 
				var	url = pathName + search + 'page=' + (++currentPage); 
				
				loadAssetsScroll(url); 
				$(window).unbind('scroll', infiniteScroll);
				setTimeout(function() {
					$(window).bind('scroll', infiniteScroll);
				}, 500);
			}
		}

	}

	$(window).bind('scroll', infiniteScroll);

	$("a[data-toggle='tooltip']").tooltip();
	
	$('#my-assets').hide();
	$('.my-assets-link').click(function(){

		if($(this).find('.pull-right').hasClass('icon-angle-down')){
			$(this).find('.pull-right').removeClass('icon-angle-down').addClass('icon-angle-up');
		}else{
			$(this).find('.pull-right').removeClass('icon-angle-up').addClass('icon-angle-down');
		}
		$('#my-assets').slideToggle();
	});

	caramel.loaded('js', 'assets');
	caramel.loaded('js', 'sort-assets');
});
