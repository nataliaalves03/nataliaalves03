$(document).ready(function(){

	nav();
	showMenu();
	configMask();
	submitForm();

	$('#slider').owlCarousel({
		loop:false,
        margin:20,
        nav:true,
        navText: ["",""],
        dots: false,
        responsiveClass:true,
        responsive:{
            0:{ items:1 },
            480:{ items:2 },
            800:{ items:3 },
            1400:{ items:4 },
        },
        slideBy:'page'
	});
	
});


function nav(){
	$('a[href^="#"]').click(function(e){
		e.preventDefault();
		var target = $( $(this).attr('href') );

		if(target.length){
			$('html, body').animate({ scrollTop: target.offset().top }, '1000');
		}
	});
}

function showMenu(){
	$(window).scroll(function() {
		var pos = $(this).scrollTop();
		var home = $('#inicio').offset().top;
		if (pos > home) {
			$('#menu-container').addClass('show');
		} else {
			$('#menu-container').removeClass('show');
		}
	}).trigger('scroll');
}

function configMask(){
	//mask by igor escobar

	var maskPhone = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    };
    
    $('.mask-phone').mask(maskPhone, {
        onKeyPress: function(val, e, el, options) {
            el.mask(maskPhone.apply({}, arguments), options);
        }
    });
}

function submitForm(){
	$('form').submit(function(e){
		e.preventDefault();

		var form = $(this);
        var btn = form.find('input[type="submit"], button[type="submit"]');
        var msg = form.find('.msg');

        msg.text('Enviando... Aguarde um instante por favor.');

        var erro = [];
        var elErro = false;
        var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        
        form.find('*:required').each(function(){

            if($(this).val() == "" ){
                msg.text('Preencha os campos obrigatórios.');
                if(!elErro) elErro = $(this);

            }else if( $(this).attr('type') == 'email' && !reg.test($(this).val()) ){
                msg.text('Email inválido.');
                if(!elErro) elErro = $(this);
            }
        });
        
        if(elErro){
            elErro.focus();
                
        }else{

            //submit
            $.ajax({
                cache: false,
                url: form.attr('action'),
                type: 'post',
                data: form.serialize(),
                success: function(data){
                	try{
				        dataJson = JSON.parse(data);

						if(dataJson.status == true){
							msg.html(dataJson.msg).addClass('success');
							form.find('input:not([type=submit]), textarea').val("");
							form.find('select').find('option:eq(0)').attr('selected','selected');
						}else{
							msg.html('Desculpe, ocorreu um erro.');
							console.log(dataJson.msg);
						}

				    }catch(e){
				        console.log(e);
				    }
                },
                error: function(data){
                    console.log(data);
                    msg.text('Desculpe, ocorreu um erro.');
                }
            });
        }
	});
}
