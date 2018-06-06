/*
Name: 			Tables / Advanced - Examples
Written by: 	Okler Themes - (http://www.okler.net)
Theme Version: 	1.4.0
*/
/*
Name: 			UI Elements / Modals - Examples
Written by: 	Okler Themes - (http://www.okler.net)
Theme Version: 	1.4.0
*/
(function( $ ) {

    'use strict';

    var datatableInit = function() {
        var $table = $('#datatable-tabletools');

        $table.dataTable({
            sDom: "<'text-right mb-md'T>" + $.fn.dataTable.defaults.sDom,
            oTableTools: {
                sSwfPath: $table.data('swf-path'),
                aButtons: [
                    {
                        sExtends: 'pdf',
                        sButtonText: 'PDF'
                    },
                    {
                        sExtends: 'csv',
                        sButtonText: 'CSV'
                    },
                    {
                        sExtends: 'xls',
                        sButtonText: 'Excel'
                    },
                    {
                        sExtends: 'print',
                        sButtonText: 'Print',
                        sInfo: 'Please press CTR+P to print or ESC to quit'
                    }
                ]
            }
        });

    };

    $(function() {
        datatableInit();
    });

}).apply( this, [ jQuery ]);

(function( $ ) {

    'use strict';

    /*
    Basic
    */
    $('.modal-basic').magnificPopup({
        type: 'inline',
        preloader: false,
        modal: true
    });

    /*
    Sizes
    */
    $('.modal-sizes').magnificPopup({
        type: 'inline',
        preloader: false,
        modal: true
    });

    /*
    Modal with CSS animation
    */
    $('.modal-with-zoom-anim').magnificPopup({
        type: 'inline',

        fixedContentPos: false,
        fixedBgPos: true,

        overflowY: 'auto',

        closeBtnInside: true,
        preloader: false,

        midClick: true,
        removalDelay: 300,
        mainClass: 'my-mfp-zoom-in',
        modal: true
    });

    $('.modal-with-move-anim').magnificPopup({
        type: 'inline',

        fixedContentPos: false,
        fixedBgPos: true,

        overflowY: 'auto',

        closeBtnInside: true,
        preloader: false,

        midClick: true,
        removalDelay: 300,
        mainClass: 'my-mfp-slide-bottom',
        modal: true
    });

    /*
    Modal Dismiss
    */
    $(document).on('click', '.modal-dismiss', function (e) {
        e.preventDefault();
        $.magnificPopup.close();
    });

    /*
    Modal Confirm
    */


    /*
    Form
    */
    $('.modal-with-form').magnificPopup({
        type: 'inline',
        preloader: false,
        focus: '#name',
        modal: true,

        // When elemened is focused, some mobile browsers in some cases zoom in
        // It looks not nice, so we disable it:
        callbacks: {
            beforeOpen: function() {
                if($(window).width() < 700) {
                    this.st.focus = false;
                } else {
                    this.st.focus = '#name';
                }
            }
        }
    });

    /*
    Ajax
    */
    $('.simple-ajax-modal').magnificPopup({
        type: 'ajax',
        modal: true
    });

}).apply( this, [ jQuery ]);




(function( $ ) {

	'use strict';

	var datatableInit = function() {
		var $table = $('#datatable-details');

		// format function for row details
		var fnFormatDetails = function( datatable, tr ) {
			var data = datatable.fnGetData( tr );
			var id = tr.id;
            var dataSrc = JSON.parse($table.attr("data-src"));
            var index = id.substring(3, id.length);
            var obj = dataSrc[index];
            return [
				'<table class="table mb-none">',
					'<tr class="b-top-none">',
						'<td><label class="mb-none">device_platform:</label></td>',
						'<td>' + obj.device_platform +'</td>',
					'</tr>',
                '<tr >',
						'<td><label class="mb-none">updated_at:</label></td>',
						'<td>' + obj.updated_at +'</td>',
					'</tr>',
					'<tr>',
						'<td><label class="mb-none">created_at:</label></td>',
						'<td>' + obj.created_at +'</td>',
					'</tr>',
					'<tr>',
						'<td><label class="mb-none">app_version:</label></td>',
						'<td>' + obj.app_version +'</td>',
					'</tr>',
                '<tr>',
                '<td><label class="mb-none">device_version:</label></td>',
                '<td>'+ obj.device_version +'</td>',
                '</tr>',
                '<tr>',
                '<td><label class="mb-none">ip_address:</label></td>',
                '<td>'+ obj.ip_address +'</td>',
                '</tr>',
                '<tr>',
                '<td><label class="mb-none">push_token:</label></td>',
                '<td>'+ obj.push_token +'</td>',
                '</tr>',
				'</div>'
			].join('');
		};

		// insert the expand/collapse column
		var th = document.createElement( 'th' );
		var td = document.createElement( 'td' );
		td.innerHTML = '<i data-toggle class="fa fa-plus-square-o text-primary h5 m-none" style="cursor: pointer;"></i>';
		td.className = "text-center";

		$table
			.find( 'thead tr' ).each(function() {
				this.insertBefore( th, this.childNodes[0] );
			});

		$table
			.find( 'tbody tr' ).each(function() {
				this.insertBefore(  td.cloneNode( true ), this.childNodes[0] );
			});

		// initialize
		var datatable = $table.dataTable({
			aoColumnDefs: [{
				bSortable: false,
				aTargets: [ 0 ]
			}],
			aaSorting: [
				[1, 'asc']
			]
		});

		// add a listener
		$table.on('click', 'i[data-toggle]', function() {
			var $this = $(this),
				tr = $(this).closest( 'tr' ).get(0);

			if ( datatable.fnIsOpen(tr) ) {
				$this.removeClass( 'fa-minus-square-o' ).addClass( 'fa-plus-square-o' );
				datatable.fnClose( tr );
			} else {
				$this.removeClass( 'fa-plus-square-o' ).addClass( 'fa-minus-square-o' );
				datatable.fnOpen( tr, fnFormatDetails( datatable, tr), 'details' );
			}
		});
	};

	$(function() {
		datatableInit();
	});

}).apply( this, [ jQuery ]);