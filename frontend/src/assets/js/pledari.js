var retina = false;
var locale;
var u_name;

$(document).ready(function() {

	/*Get the current locale value*/
	locale = $('html').attr('lang');

	/*Get the user name*/
	u_name = $('#u_name').text();

	checkMobile();

	if (window.devicePixelRatio) {
		retina = window.devicePixelRatio > 1;
	}

	/* PAGINATION */
	$(window).resize(function() {
		resizePagination();
	});
	function resizePagination() {
		if($(window).width() < 767) {
			$('div.pagination').addClass('pagination-mini');
		} else {
			$('div.pagination').removeClass('pagination-mini');
		}
	} /* PAGINATION */


	$('#content.content').on('click', '.row-fluid .span4 .well form #searchoptions + a.btn', function(event) {

		$('#searchoptions').toggleClass('open');
		$('#searchoptions').parents('.span4').toggleClass('open');

		if (!$('html').hasClass('lt-ie9')) {
			initCustomElements();
		}

	});

	$(document).keyup(function(event) {

		if (event.which == '27' && $('.modal').length) {
			console.log($('.modal.in .modal-footer a:first'));
			$('.modal.in .modal-footer a:first').trigger('click');
		}

	});

	$(window).resize(function() {
		checkMobile();
	});

	function checkMobile() {

		if ($(window).width() < 768) {
			startMobile();
		} else if ($(window).width() >= 768) {
			stopMobile();
		}

	}

	function startMobile() {

		/*Rename dictionary names*/
		$('#sm_brand_title').html('<a href="/surmiran">SM</a>');
		$('#st_brand_title').html('<a href="/sutsilvan">ST</a>');
		$('#rm_brand_title').html('<a href="/rumantschgrischun">RG</a>');
		$('#pt_brand_title').html('<a href="/puter">PT</a>');
		$('#vl_brand_title').html('<a href="/vallader">VL</a>');
		$('#sr_brand_title').html('<a href="/sursilvan">SR</a>');

		/*Remove link to grammar PDF*/
		$('#grammatica').hide();


		var short_u_name = u_name.replace('/[^\w+]/g');
		short_u_name = short_u_name.substring(0, 2);
		$('#u_name').text(short_u_name);

		var paths = window.location.pathname.split('/');
		var selected = paths[paths.length-1];
		$('#dict_descript').remove();

		if(locale == "rm") {
			if (selected == '') {
				$('#dic_navi_head').after("<div id='dict_descript'>rumantsch grischun</div>");
			} else if (selected == 'sutsilvan') {
				$('#dic_navi_head').after("<div id='dict_descript'>sutsilvan</div>");
			} else if (selected == 'vallader') {
				$('#dic_navi_head').after("<div id='dict_descript'>vallader</div>");
			} else if (selected == 'surmiran') {
				$('#dic_navi_head').after("<div id='dict_descript'>surmiran</div>");
			} else if (selected == 'sursilvan') {
				$('#dic_navi_head').after("<div id='dict_descript'>sursilvan</div>");
			} else if (selected == 'puter') {
				$('#dic_navi_head').after("<div id='dict_descript'>puter</div>");
			}
		} else {
			if (selected == '') {
				$('#dic_navi_head').after("<div id='dict_descript'>Rumantsch Grischun</div>");
			} else if (selected == 'sutsilvan') {
				$('#dic_navi_head').after("<div id='dict_descript'>Sutsilvan</div>");
			} else if (selected == 'vallader') {
				$('#dic_navi_head').after("<div id='dict_descript'>Vallader</div>");
			} else if (selected == 'surmiran') {
				$('#dic_navi_head').after("<div id='dict_descript'>Surmiran</div>");
			} else if (selected == 'sursilvan') {
				$('#dic_navi_head').after("<div id='dict_descript'>Sursilvan</div>");
			} else if (selected == 'puter') {
				$('#dic_navi_head').after("<div id='dict_descript'>Puter</div>");
			}
		}

	}

	function stopMobile() {
		/*Reverse settings from startMobile function*/

		if(locale == "rm") {
			$('#sm_brand_title').html('<a href="/surmiran">surmiran</a>');
			$('#st_brand_title').html('<a href="/sutsilvan">sutsilvan</a>');
			$('#rm_brand_title').html('<a href="/rumantschgrischun">rumantsch grischun</a>');
			$('#pt_brand_title').html('<a href="/puter">puter</a>');
			$('#vl_brand_title').html('<a href="/vallader">vallader</a>');
			$('#sr_brand_title').html('<a href="/sursilvan">sursilvan</a>');
		} else {
			$('#sm_brand_title').html('<a href="/surmiran">Surmiran</a>');
			$('#st_brand_title').html('<a href="/sutsilvan">Sutsilvan</a>');
			$('#rm_brand_title').html('<a href="/rumantschgrischun">Rumantsch Grischun</a>');
			$('#pt_brand_title').html('<a href="/puter">Puter</a>');
			$('#vl_brand_title').html('<a href="/vallader">Vallader</a>');
			$('#sr_brand_title').html('<a href="/sursilvan">Sursilvan</a>');
		}

		$('#u_name').text(u_name);


		$('#grammatica').show();
	}

	function initCustomElements() {

		$('#searchoptions input[type="radio"]').each(function() {

			var checked = $(this).is(':checked');
			var checkedAttr = '';

			if (checked) {
				checkedAttr = 'checked';
			}

			var element = $('<div class="styledControl styledRadio"></div>').addClass(checkedAttr);

			element.insertBefore($(this));

		});

		$('#searchoptions input[type="checkbox"]').each(function() {

			var checked = $(this).is(':checked');
			var checkedAttr = '';

			if (checked) {
				checkedAttr = 'checked';
			}

			var element = $('<div class="styledControl styledCheckbox"></div>').addClass(checkedAttr);

			element.insertBefore($(this));

		});

		$('#searchoptions input[type="radio"]').hide();
		$('#searchoptions input[type="checkbox"]').hide();

		$('#searchoptions label.radio .styledRadio, #searchoptions label.radio span, #searchoptions label.radio').click(function(event) {
			var el = $(this);
			if ($(this).is('span')) {
				el = $(this).prev().prev();
			} else if ($(this).is('label')) {
				el = $('.styledRadio', this);
			}
			el.closest('table').find('.styledRadio').removeClass('checked');
			el.addClass('checked');
		});

		$('#searchoptions label.gwt-checkbox-maalr .styledCheckbox, #searchoptions label.gwt-checkbox-maalr span, #searchoptions label.gwt-checkbox-maalr').click(function(event) {
			var el = $(this);
			if ($(this).is('span')) {
				el = $(this).prev().prev();
			} else if ($(this).is('label')) {
				el = $('.styledCheckbox', this);
			}
			el.toggleClass('checked');
		});

		if (retina) {
			$('.styledRadio').css({
				'background-image': 'url(/rumantschgrischun/assets/img/radiobutton_sprite2x.png)'
			});
			$('.styledCheckbox').css({
				'background-image': 'url(/rumantschgrischun/assets/img/checkbox_sprite2x.png)'
			});
		}

	}

});
