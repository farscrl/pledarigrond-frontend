var retina = false;
var locale;
var u_name;

$(document).ready(function() {

	/*Get the current locale value*/
	locale = $('html').attr('lang');

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
		}
	}

	function startMobile() {
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
