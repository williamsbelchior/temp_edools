var $ = require('jquery');
require('jquery-validation');

var addLoading = function(input) {
  if (!$(input).closest('.form-item').hasClass('form-item-loading')) {
    $(input).closest('.form-item').addClass('form-item-loading').append('<svg width="24" height="24" class="icon-loading" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="4" stroke-miterlimit="10"/></svg>');
  }
};

var removeLoading = function(input) {
  $(input).closest('.form-item').removeClass('form-item-loading').find('.icon-loading').remove();
};

var validDate = function(dateString) {
  var dateArr = dateString.split('/');
  var birthDate = new Date(dateArr[1] + '/' + dateArr[0] + '/' + dateArr[2]);
  var day = birthDate.getDate().toString().length == 2 ? birthDate.getDate() : '0'+birthDate.getDate();
  var month = (birthDate.getMonth()+1).toString().length == 2 ? birthDate.getMonth()+1 : '0'+(birthDate.getMonth()+1);
  var year = birthDate.getFullYear();

  return day == dateArr[0] && month == dateArr[1] && year == dateArr[2];
};

var getAge = function (dateString) {
  var today = new Date();
  var dateArr = dateString.split('/');
  var birthDate = new Date(dateArr[1] + '/' + dateArr[0] + '/' + dateArr[2]);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }

  return age;
};

module.exports = {
  config: function() {
    $.validator.addMethod('CEP', function(cep_value, element) {
      return this.optional(element) || /^\d{2}.\d{3}-\d{3}?$|^\d{5}-?\d{3}?$/.test( cep_value );
    }, 'CEP inválido.');

    $.validator.addMethod('CPF', function(value, element) {
      cpf = value.replace('.','');
      cpf = cpf.replace('.','');
      cpf = cpf.replace('-','');
      if(cpf.length < 11) return false;
      var expReg = /^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/;
      var a = [];
      var b = 0;
      var c = 11;
      for (i=0; i<11; i++){
        a[i] = cpf.charAt(i);
        if (i < 9) b += (a[i] * --c);
      }
      if ((x = b % 11) < 2) { a[9] = 0; } else { a[9] = 11-x; }
      b = 0;
      c = 11;
      for (y=0; y<10; y++) b += (a[y] * c--);
      if ((x = b % 11) < 2) { a[10] = 0; } else { a[10] = 11-x; }
      if ((cpf.charAt(9) != a[9]) || (cpf.charAt(10) != a[10]) || cpf.match(expReg)) return false;
      return this.optional(element) || true;
    }, 'CPF inválido.');

    $.validator.addMethod('dateBR', function(value, element) {
      if (value.length!=10) return false;
      if (!validDate(value)) return false;

      return this.optional(element) || true;
    }, 'Data inválida.');

    $.validator.addMethod('olderThan14', function(value, element) {
      if (getAge(value) < 14) return false;

      return this.optional(element) || true;
    }, 'Data inválida.');

    $.validator.addMethod("customEmail", function(value, element) {
      return this.optional( element ) || /^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/i.test( value );
    }, 'Email inválido.');

    $.validator.addMethod('phoneBR', function (value, element) {
      value = value.replace('(', '');
      value = value.replace(')', '');
      value = value.replace('-', '');
      value = value.replace('_', '');
      value = value.replace(' ', '');
      return this.optional(element) || /[0-9]{10}/.test(value) || /[0-9]{11}/.test(value);
    }, 'Telefone inválido.');

    $.validator.addMethod('dateFundacao', function (value, element) {
      return this.optional(element) || /^((0[1-9])|(1[0-2]))\/(?:(?:19|20)[0-9]{2})$/.test(value);
    }, 'Data de fundação inválida, informe o MM/YYYY.');

    $.extend($.validator.messages, {
      required: 'Este campo é obrigatório.',
      remote: 'Por favor, corrija este campo.',
      email: 'Por favor, forneça um endereço de e-mail válido.',
      url: 'Por favor, forneça uma URL válida.',
      dateBR: 'Por favor, forneça uma data válida.',
      olderThan14: 'Idade mínima de 14 anos.',
      CEP: 'Por favor, forneça um CEP válido.',
      CPF: 'Por favor, forneça um CPF válido.',
      phoneBR: 'Por favor, forneça um telefone válido.',
      maxlength: $.validator.format('Por favor, forneça não mais que {0} caracteres.'),
      minlength: $.validator.format('Por favor, forneça ao menos {0} caracteres.'),
      digits: 'Por favor, forneça um número inteiro.',
    });

    $.validator.setDefaults({
      ignore: ':hidden:not(select), .chosen-search input, .form-item:hidden select, .ignore-view-passwd',
      onfocusout: function(element) {
        $(element).valid();
      },
      onchange: function(element) {
        $(element).valid();
      },
      highlight: function(element, errorClass, validClass) {
        $(element).attr('aria-invalid', true);
        var $formItem = $(element).closest('.form-item');
        $formItem.removeClass('form-item-' + validClass).addClass('form-item-' + errorClass);
        $formItem.find('.form-success-icon').hide();
      },
      unhighlight: function(element, errorClass, validClass) {
        $(element).attr('aria-invalid', false);
        var $formItem = $(element).closest('.form-item');
        if ( !$formItem.find('.form-success-icon').length ){
          var $label = $('<label/>', {
            'for': $(element).prop('id'),
            'class': 'form-success-icon'
          });
          $label.append('<svg width="14" height="11" class="icon"><use xlink:href="/wp-content/themes/sebrae/assets/images/ico/symbol-defs.svg#icon-check"/></svg>');
          $label.appendTo($formItem);
        } else {
          $formItem.find('.form-success-icon').show();
        }
        $formItem.removeClass('form-item-' + errorClass).addClass('form-item-' + validClass);
      },
      errorPlacement: function(error, element) {
        error.addClass('form-error-msg').appendTo($(element).closest('.form-item'));
      }
    });

    $('.form-select').on('change', function() {
      $(this).valid();
    });
  },

  updatePassword: function(){
    var $updatePasswordValidador = $('.form-recover-password form').validate({
      invalidHandler: function(event, validator) {

      },
      submitHandler: function(form) {
        var dataForm = $(form).serialize();

        addLoading('#recover-password');

        //gaSend('ESQ_SENHA', 'ESQ_SENHA_CLICOU_BTN_OK');

        var promise = $.ajax({
          method: 'POST',
          url: '/wp-content/themes/sebrae/do_update_password.php',
          data: dataForm
        });

        promise.done(function(response) {
          removeLoading('#recover-password');
          if (response.status === true) {
            document.location.href = "/recuperacao-senha/?alterada=1";
          } else {
            $updatePasswordValidador.showErrors(response.messages);
            $updatePasswordValidador.focusInvalid();
          }
        });
      }
    });
  },

  recoverPassword: function(){
    var $passwordValidator = $('.header-password form').validate({
      invalidHandler: function(event, validator) {
        var errors = validator.numberOfInvalids();
        if (errors) {
          // gaSend('ESQ_SENHA', 'ESQ_SENHA_CLICOU_BTN_OK');
          if ( $(validator.currentForm).find('.form-text').val() === '') {
            // gaSend('ESQ_SENHA', 'ESQ_SENHA_FORM_VAZIO');
          }
        }
      },
      submitHandler: function(form) {
        var dataForm = $(form).serialize();

        addLoading('#password-cpf');

        //gaSend('ESQ_SENHA', 'ESQ_SENHA_CLICOU_BTN_OK');

        var promise = $.ajax({
          method: 'POST',
          url: '/wp-content/themes/sebrae/do_recover_password.php',
          data: dataForm
        });

        promise.done(function(response) {
          removeLoading('#password-cpf');
          if (response.status) {
            $('.header-password-email').text(response.email);
            $('.header-password').hide();
            $('.header-password-confirm').show();
            $('#password-cpf').val('');
          } else {
            $passwordValidator.showErrors(response.messages);
            $passwordValidator.focusInvalid();
          }
        });

        return false;
      }
    });
  },

  login: function(){
    var $loginValidator = $('.header-login form').validate({
      invalidHandler: function(event, validator) {

      },
      submitHandler: function(form) {
        addLoading('#login-user');
        var dataForm = $(form).serialize();
        var promise = $.ajax({
          method: 'POST',
          url: '/wp-content/themes/sebrae/do_login.php',
          data: dataForm,
          dataType: 'json'
        });

        promise.done(function(response) {
          removeLoading('#login-user');
          if (response.status) {
            window.location = window.location.href;
          } else {
            $loginValidator.showErrors(response.messages);
            $loginValidator.focusInvalid();
          }
        });

        promise.fail(function(response) {
          messages = $.parseJSON(response.responseText);
          $loginValidator.showErrors(messages);
          $loginValidator.focusInvalid();
        });

        return false;
      }
    });

  },

  loginCurso: function(){
    function _validate(formID)
    {
      var $loginValidator = $(formID).validate({
        invalidHandler: function(event, validator) {

        },
        submitHandler: function(form) {

          var dataForm = {};
          dataForm.username = $(form).find("input[data-name=username]").val();
          dataForm.password = $(form).find("input[data-name=password]").val();

          //passado por parametro os nomes das tags para validacao posterior
          dataForm.elementName = {};
          dataForm.elementName.username = $(form).find("input[data-name=username]").attr("name");
          dataForm.elementName.password = $(form).find("input[data-name=password]").attr("name");


          var redir = $(form).data("redirect_to");
          if (redir.indexOf("tipo-curso") != -1 &&
              redir.indexOf("presencial") != -1 &&
              $("input[name=cidade]:checked").val() === undefined
          ) {
            alert("Escolha a cidade que deseja fazer o curso.");
            return;
          }

          addLoading($(form).find('input[data-name=username]'));

          var promise = $.ajax({
            method: 'POST',
            url: '/wp-content/themes/sebrae/do_login.php',
            data: dataForm,
            dataType: 'json'
          });

          promise.done(function(response) {
            removeLoading($(form).find('input[data-name=username]'));
            if (response.status) {
              var redir = $(form).data("redirect_to");
              if (redir.indexOf("tipo-curso") != -1 &&
                  redir.indexOf("presencial") != -1
              ) {
                window.location = redir+"&cidade="+$("input[name=cidade]:checked").val();
              } else {
                window.location = $(form).data("redirect_to");
              }
            } else {
              $loginValidator.showErrors(response.messages);
              $loginValidator.focusInvalid();
            }
          });

          promise.fail(function(response) {
            messages = $.parseJSON(response.responseText);
            $loginValidator.showErrors(messages);
            $loginValidator.focusInvalid();
          });

          return false;
        }
      });
    }

    $('.login-register form[data-name=loginform]').each(function(){
      _validate("#"+$(this).attr("id"));
    });
  },

  register: function(){
    var $form = $('.form-register form');

    var $registerValidator = $form.validate({
      onfocusout: function(element) {
        $(element).valid();
        if ( $form.hasClass('last-step') && $form.find('.form-item:visible').length == $form.find('.form-item-valid:visible').length ){
          $form.find('.status').text('Pronto :)');
          $form.find('.form-submit-wrapper .btn').prop('disabled', false);
        }
      },
      invalidHandler: function(event, validator) {

      },
      submitHandler: function(form) {
        var promise = $.ajax({
          method: 'POST',
          url: $form.attr('action'),
          data: $form.serialize(),
          dataType: 'json'
        });

        promise.done(function(response) {
          if (response.status) {
            document.location.href = response.url;
          } else {
            $registerValidator.showErrors(response.messages);
            $registerValidator.focusInvalid();
          }
        });

        promise.fail(function(response) {
          messages = $.parseJSON(response.responseText);
          $registerValidator.showErrors(messages);
          $registerValidator.focusInvalid();
        });
      }
    });

    var openStep = function(number){
      $form.find('.step-' + number).addClass('step-open');
      if ( number === 1 ) {
        $('.step-open').removeClass('step-open');
      } else if ( number === 2 ){
        $form.find('.status').text('Agora falta pouco! :)');
      } else if ( number === 3 ){
        $form.addClass('last-step');
        $form.find('.status').text('Quase lá :)');
      }
    };

    var limpaEndereco = function() {
      ['logradouro','numero','complemento','bairro','cidade','uf'].forEach(function(i) {
        var $tmpField = $('#register-' + i);
        if ($tmpField.length) {
          $tmpField.val('');
          if (i === 'uf') {
            $tmpField.trigger('chosen:updated');
          }
          $tmpField.closest('.form-item').removeClass('form-item-has-value');
          $tmpField.valid();
        }
      });
    };

    $('.btn-edit-cpf').on('click', function(e){
      e.preventDefault();
      var $btn = $(this);
      var $formItem = $btn.closest('.form-item');
      var $input = $formItem.find('.form-text');
      $input.prop('readonly', false).val('');
      $btn.hide();
      $formItem.find('.btn-check-cpf').show();
      $form.find('.form-item').removeClass('form-item-valid').removeClass('form-item-has-value');
      $form.find('.form-success-icon').remove();
      $form.find('.form-submit-wrapper').hide();
      $form[0].reset();
      openStep(1);
    });

    $('.radio-situacao').on('change', function(e){
      openStep(3);
      var value = $(this).val();
      $('.step-3').removeClass (function (index, css) {
        return (css.match (/(^|\s)situacao-\S+/g) || []).join(' ');
      }).addClass(value);
    });

    var situacaoValue = $('.radio-situacao:checked').val();
    $('.step-3').removeClass(function (index, css) {
      return (css.match (/(^|\s)situacao-\S+/g) || []).join(' ');
    }).addClass(situacaoValue);

    $('.btn-check-cpf').on('click', function(e){
      e.preventDefault();
      var $btn = $(this);
      var $formItem = $btn.closest('.form-item');
      var $input = $formItem.find('.form-text');
      $input.valid();
    });

    $('.cnpj').each(function(){
      var $input = $(this);
      var cnpj_ini_val = $input.val();
      $input.rules('add', {
        remote: {
          url: '/wp-content/themes/sebrae/do_find_cnpj.php',
          method: 'post',
          dataType: 'json',
          cache: false,
          beforeSend: function(xhr, obj) {
            obj.data = obj.data.replace('register-cnpj', 'cnpj');
            addLoading($input);
          },
          dataFilter: function(response) {
            removeLoading($input);
            response = $.parseJSON(response);

            if ($input.val() == cnpj_ini_val) {
              return true;
            }

            if ( response.status ){
              if (response.data) {
                if (response.data.data_fundacao) {
                  $('#register-data-fundacao').val(response.data.data_fundacao).closest('.form-item').addClass('form-item-has-value');
                }
                if (response.data.nome_fantasia) {
                  $('#register-nome-fantasia').val(response.data.nome_fantasia).closest('.form-item').addClass('form-item-has-value');
                }
                if (response.data.razao_social) {
                  $('#register-razao-social').val(response.data.razao_social).closest('.form-item').addClass('form-item-has-value');
                }
                $.each(response.data.endereco, function(index, value){
                  if (index === 'cep') index = 'cep-empresa';
                  var $tmpField = $('#register-'+index);
                  if ($tmpField.length) {
                    $tmpField.val(value).closest('.form-item').addClass('form-item-has-value');
                    if (index.toLowerCase() === 'uf') {
                      $tmpField.val(value).trigger('chosen:updated');
                    }
                    $tmpField.valid();
                  }
                });
              }
              return true;
            }
            return "\"" + response.message + "\"";
          }
        }
      });
    });

    $('.cpf').each(function(){
      var $input = $(this);
      var cpf_ini_val = $input.val();
      $input.rules('add', {
        remote: {
          url: '/wp-content/themes/sebrae/do_find_cpf.php',
          method: 'post',
          dataType: 'json',
          cache: false,
          beforeSend: function(xhr, obj) {
            obj.data = obj.data.replace('register-cpf', 'cpf');
            addLoading($input);
          },
          dataFilter: function(response) {
            removeLoading($input);
            response = $.parseJSON(response);

            if ($input.val() == cpf_ini_val) {
              return true;
            }

            if ( response.status ){
              if ( $input.prop('id') === 'register-cpf' ){
                $input.prop('readonly', true);
                if (response.data !== undefined) {
                  $registerLogin = $('#register-usuario');
                  if (response.data.login !== "") {
                    //$registerLogin.prop('readonly', true);
                    $registerLogin.val(response.data.login).closest('.form-item').addClass('form-item-has-value');
                  } else {
                    //$registerLogin.prop('readonly', false);
                    $registerLogin.val('').closest('.form-item').removeClass('form-item-has-value');
                  }
                  if (response.data.nome !== "") {
                    $('#register-nome').val(response.data.nome).closest('.form-item').addClass('form-item-has-value');
                  }
                  if (response.data.nascimento !== "") {
                    $('#register-data-nascimento').val(response.data.nascimento).closest('.form-item').addClass('form-item-has-value');
                  }
                  if (response.data.email !== "") {
                    $('#register-email').val(response.data.email).closest('.form-item').addClass('form-item-has-value');
                  }
                  if (response.data.email !== "") {
                    $('#register-celular').val(response.data.telefone_celular).closest('.form-item').addClass('form-item-has-value');
                  }
                  if (response.data.sexo !== "") {
                    $('#register-genero-'+response.data.sexo.toLowerCase()).prop('checked', true);
                  }
                }
                $input.closest('.form-item').find('.btn-check-cpf').hide();
                openStep(2);
                $form.find('.form-submit-wrapper').show();
                $('#register-nome').focus();
              }
              return true;
            }
            $('#register-usuario').focus();
            return "\"" + response.message + "\"";
          }
        }
      });
    });

    $('.cep').each(function(){
      var $input = $(this);
      var cep_ini_val = $input.val();
      $input.rules('add', {
        remote: {
          url: '/wp-content/themes/sebrae/do_find_cep.php',
          method: 'post',
          dataType: 'json',
          cache: false,
          beforeSend: function(xhr, obj) {
            obj.data = obj.data.replace('register-cep-residencial', 'cep');
            obj.data = obj.data.replace('register-cep-empresa', 'cep');
            addLoading($input);
          },
          dataFilter: function(response) {
            removeLoading($input);
            response = $.parseJSON(response);

            if ($input.val() == cep_ini_val) {
              return true;
            }

            if ( response.status ){
              if (typeof response.data === 'object') {
                $.each(response.data, function(index, value){
                  var $tmpField = $('#register-'+index);
                  if ($tmpField.length) {
                    $tmpField.val(value).closest('.form-item').addClass('form-item-has-value');
                    if (index.toLowerCase() === 'uf') {
                      $tmpField.val(value).trigger('chosen:updated');
                    }
                    $tmpField.valid();
                  }
                });
              }
              return true;
            }
            limpaEndereco();
            return "\"" + response.message + "\"";
          }
        }
      });
    });

    $('.login').each(function(){
      var $input = $(this);
      $input.rules('add', {
        remote: {
          url: '/wp-content/themes/sebrae/do_find_login.php',
          method: 'post',
          dataType: 'json',
          cache: false,
          beforeSend: function(xhr, obj) {
            addLoading($input);
          },
          dataFilter: function(response) {
            removeLoading($input);
            response = $.parseJSON(response);
            if ( response.status ){
              return true;
            }
            return "\"" + response.message + "\"";
          }
        }
      });
    });
  },

  newsletter: function(){
    var $newsletterValidator = $('.newsletter form').validate({
      invalidHandler: function(event, validator) {

      },
      submitHandler: function(form) {
        addLoading('#newsletter-email');
        var promise = $.ajax({
          method: 'POST',
          url: $(form).prop('action'),
          data: $(form).serialize() + '&_wpcf7_is_ajax_call=1',
          dataType: 'json'
        });

        promise.done(function(response) {
          removeLoading('#newsletter-email');
          if (response.mailSent) {
            $($newsletterValidator.currentForm).removeClass('not-sent').addClass('sent-ok');
            $('.wpcf7-response-output').addClass('form-response').text(response.message);
          } else {
            $($newsletterValidator.currentForm).removeClass('sent-ok').addClass('not-sent');
          }
        });
      }
    });
  },

  contact: function(){
    var $contactValidator = $('.contact form').validate({
      invalidHandler: function(event, validator) {

      },
      submitHandler: function(form) {
        addLoading('#contact-email');
        var promise = $.ajax({
          method: 'POST',
          url: $(form).prop('action'),
          data: $(form).serialize() + '&_wpcf7_is_ajax_call=1',
          dataType: 'json'
        });

        promise.done(function(response) {
          removeLoading('#contact-email');
          if (response.mailSent) {
            $($contactValidator.currentForm).removeClass('not-sent').addClass('sent-ok');
            $('.wpcf7-response-output').addClass('form-response').text(response.message);
          } else {
            $($contactValidator.currentForm).removeClass('sent-ok').addClass('not-sent');
          }
        });
      }
    });
  },

  interest: function(){
    // $('.interest-form form').validate({
    //   invalidHandler: function(event, validator) {

    //   },
    //   submitHandler: function(form) {
    //     //form.submit();
    //     var $parent = $(form).parent();
    //     $(form).remove();
    //     $parent.append('<p>Obrigado por registrar seu interesse no curso <strong>Transformando sua ideia em um modelo de negócio</strong>. Entraremos em contato com você assim que abrirem vagas <span>:)</span></p>');
    //   }
    // });
  },

  enroll: function(){
    $('.enroll form').validate({
      invalidHandler: function(event, validator) {

      },
      submitHandler: function(form) {
        form.submit();
      }
    });

    $('.btn-enroll-data').on('click', function(e){
      e.preventDefault();
      $('.enroll-data').show();
      $(this).hide();
    });
  },

  payment: function(){
    $('.payment form').validate({
      invalidHandler: function(event, validator) {

      },
      submitHandler: function(form) {

      }
    });
  },

  recommend: function(){
    var $recommendForm = $('.recommend form');
    $recommendForm.validate({
      invalidHandler: function(event, validator) {
      },
      submitHandler: function(form) {
        var promise = $.ajax({
          method: 'POST',
          url: $(form).prop('action'),
          data: $(form).serialize(),
          dataType: 'json'
        });

        promise.done(function(response) {

          if ( response.status ) {

            $(form).find('.form-item, .form-submit-wrapper').hide();
            $(form).append('<div class="response-msg"><p>Recomendação Enviada! </p><a href="#" class="btn btn-type-1 new-recommend">Enviar outro comentário!</a></div>');
            newRecommend(form);
          }

        });

      }
    });

    var newRecommend = function(form){
      $('.recommend .new-recommend').on('click', function(e){
        e.preventDefault();
        form.reset();
        $(form).find('.response-msg').remove();
        $(form).find('.form-item, .form-submit-wrapper').show();
      });
    };

  },

  rating: function(){
    var $ratingForm = $('.rating-form form');
    $ratingForm.validate({
      invalidHandler: function(event, validator) {

      },
      submitHandler: function(form) {

        var promise = $.ajax({
          method: 'POST',
          url: $(form).prop('action'),
          data: $(form).serialize(),
          dataType: 'json'
        });

        promise.done(function(response) {

          if ( response.status ) {

            $ratingForm.find('.form-submit').remove();
            $ratingForm.append('<div class="response-msg"><p>Obrigado por avaliar! <span>:)</span></p></div>');
          }

        });
      }
    });
  },

  comment: function(){
    var $commentForm = $('.comment-form form');
    $commentForm.validate({
      invalidHandler: function(event, validator) {

      },
      submitHandler: function(form) {

        var promise = $.ajax({
          method: 'POST',
          url: $(form).prop('action'),
          data: $(form).serialize(),
          dataType: 'json'
        });

        promise.done(function(response) {

          if ( response.status ) {

            $commentForm.find('.form-item, .form-submit-wrapper').hide();
            $commentForm.append('<div class="response-msg"><p>Todos os comentários passam por avaliação para evitar spam. Em no máximo 00h seu comentário será avaliado.</p><a href="#" class="btn btn-type-1 new-comment">Enviar outro comentário!</a></div>');
            newComment();
          }

        });
      }

    });

    var newComment = function(){
      $('.comment-form .new-comment').on('click', function(e){
        e.preventDefault();
        $commentForm[0].reset();
        $commentForm.find('.response-msg').remove();
        $commentForm.find('.form-item, .form-submit-wrapper').show();
      });
    };
  },

  videoSaveHistoric: function(){
  var video = $('video');
  var videoAttr = $('.video-wrapper');
    video.on('play', function(){
      var promise = $.ajax({
        method: 'GET',
        url: videoAttr.data('src'),
        dataType: 'json'
      });
    });
},

downloadSaveHistoric: function(){
  var download = $('.down-link');
  var idAttr = $('.down-generic');
    download.on('click', function(event){
      event.preventDefault();
      var promise = $.ajax({
        method: 'GET',
        url: idAttr.data('src'),
        dataType: 'json'
      });
      window.open(download.attr('href'),'_blank');
    });

},

};
