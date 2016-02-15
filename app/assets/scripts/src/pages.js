var $ = require('jquery');

module.exports = {
    pesquisaCurso: function()
    {
        function _pesquisaCurso()
        {
            $(".loadMoreResults").off('click').on('click', function(e){
                e.preventDefault();
                var $linkMoreResults = $(".loadMoreResults");
                var promise = $.ajax({
                    method: "GET",
                    url: $linkMoreResults.data("nextlink"),
                });

                promise.done(function( html ) {
                    var $div = $("<div></div>");
                    $div.html(html);

                    html = '';
                    if ($div.find(".linkContent").length > 0) {
                        html = $div.find(".linkContent").html();
                    }
                    $(".linkContent").html(html);

                    var $grid = $('.masonry');
                    var $elems = $div.find('.itemsContent .card');
                    $grid.isotope('insert', $elems);
                    $elems.find('img').on('load', function(){
                        $grid.isotope('layout');
                    });
                    _pesquisaCurso();
                });

                promise.fail(function( msg ) {
                    console.log("error");
                    console.log(msg);
                });
            });
        }
        _pesquisaCurso();
    },

    filtroCurso: function()
    {
      $(".filter-list-item, .filter-select").off('change').on('change', function(e){
          e.preventDefault();
          var form_data = $('.filter-form').serializeArray();
          form_data.push({name: 'search_order', value: $('[name="search_order"]').val()});

          var promise = $.ajax({
              method: "GET",
              url: '/?',
              data: form_data
          });

          promise.done(function(html) {
              var $div = $("<div></div>");
              $div.html(html);

              var btn = $div.find(".searchContent .btn-center").wrap('<div/>').parent().html();

              $(".searchContent .btn-center").remove();
              $(".searchContent .card-list").html('').after(btn);

              var $grid = $('.masonry');
              var $elems = $div.find('.itemsContent .card');
              $grid.isotope('insert', $elems);
              $elems.find('img').on('load', function(){
                  $grid.isotope('layout');
              });
          });

          promise.fail(function( msg ) {
              console.log("error");
              console.log(msg);
          });
      });
    },

    matriculaSemLogin: function()
    {
        $(".btn-matricula-sem-login").on("click", function(){
            $(this).parent().parent().find(".login-register").slideDown();
        });
    },

    aviseSemLogin: function()
    {
        $(".btn-avise-sem-login").on("click", function(){
            $(this).parent().parent().find(".login-register").slideDown();
        });
    },

    matriculaCadastroCompletoCNPJouCPFVinculado: function()
    {
        $(".btn-matricula-confirmacao").on("click", function(){
            var $lnkConfimracaoMatricula = $(this);
            if ($lnkConfimracaoMatricula.data("formato") == 4) {
                var cidade = $("input[type=radio][name=cidade]:checked").val();
                if (cidade === "" || typeof cidade == "undefined") {
                    alert("Escolha a cidade que deseja fazer o curso.");
                    return true;
                }
                var reditTo = $lnkConfimracaoMatricula.data("redirect_to");
                reditTo += "&cidade="+cidade;
                window.location = reditTo;
            } else {
                window.location = $lnkConfimracaoMatricula.data("redirect_to");
            }
        });
    },

    loginsExterno: function()
    {
        $(".btn-login-trilhas").on("click", function(){
            var $lnkLoginTrilhas = $(this);
            var promise = $.ajax({
                method: "GET",
                url: $lnkLoginTrilhas.data("do_login")
            });

            promise.done(function(obj) {
                if (obj.logado === true) {
                    $.each(obj.trilhas, function(nome, value){
                        window.localStorage.setItem(nome, value);
                    });
                    window.location = $lnkLoginTrilhas.data("redirect_to");
                }
            });
            promise.fail(function( msg ) {
                console.log("error");
                console.log(msg);
            });
        });

        $(".btn-login-consultoria").on("click", function(){
            var $lnkLoginConsultoria = $(this);
            window.open($lnkLoginConsultoria.data("do_login"));
        });

        $(".btn-matricula-edools").on("click", function(){
            var $lnkMatriculaEdools = $(this);

            var promise = $.ajax({
                method: "GET",
                url: '/wp-content/themes/sebrae/enroll.php',
                dataType: "json",
                data: {
                    "pkCurso" : $lnkMatriculaEdools.data("pk_curso"),
                    "pkUsuario" : $lnkMatriculaEdools.data("pk_usuario"),
                    "formato" : $lnkMatriculaEdools.data("formato"),
                    "cidade" : '',
                    "nomeCurso" : $lnkMatriculaEdools.data("post_name"),
                    "tipoCurso":  $lnkMatriculaEdools.data("tipo_curso")
                }
            });

            promise.done(function(obj) {
                if (obj.status === true) {
                    window.open(obj.redirect_to);
                }
            });

            promise.fail(function( msg ) {
                console.log("error");
                console.log(msg);
            });
        });

        $(".btn-avise-disponivel").on("click", function(){
            var $btnAviseDisponivel = $(this);

            var promise = $.ajax({
                method: "GET",
                url: '/wp-content/themes/sebrae/do_avise_disponivel.php',
                dataType: "json",
                data: {
                    postId: $btnAviseDisponivel.data("post_id")
                }
            });

            promise.done(function(obj) {
                
                $(".mensagem-presencial-text").html(obj.message);
                $(".mensagem-presencial").slideDown();

                setTimeout(function(){
                    $(".mensagem-presencial").slideUp();
                }, 12000);
            });

            promise.fail(function( msg ) {
                console.log("error");
                console.log(msg);
            });

        });

        $(".btn-presencialgratis-ri").on("click", function(){
            var $lnkPresencialGratis = $(this);

            if ($(".interest-form-wrapper").is(":visible")) {
                $(".interest-form-wrapper").slideUp();
            } else {
                $(".interest-form-wrapper").slideDown();
            }

            if ($("#frmRegistrarInteresse").data("is-validated") === true) {
                return;
            }

            $("#frmRegistrarInteresse").data("is-validated", true);

            $("#frmRegistrarInteresse").validate({
                invalidHandler: function(event, validator) {

                },
                submitHandler: function(form) {
                    var promise = $.ajax({
                        method: "POST",
                        url: '/wp-content/themes/sebrae/do_registrar_interesse.php',
                        dataType: "json",
                        data: $("#frmRegistrarInteresse").serialize()
                    });

                    promise.done(function(obj) {
                        if (obj.status === true) {
                            $(form).remove();
                            $parent.append(obj.message);
                        }
                    });

                    promise.fail(function( msg ) {
                        console.log("error");
                        console.log(msg);
                    });

                    return false;
                }
            });

        });

        $(".btn-presencialgratis").on("click", function(){
            var $lnkPresencialGratis = $(this);
            var cidade = $("form[name=frmCursoPresencial] input[name=cidade]:checked").val();
            if (cidade === "" ||
                cidade === undefined
            ) {
                alert("Escolha a cidade que deseja fazer o curso.");
                return;
            }

            var promise = $.ajax({
                method: "POST",
                url: '/wp-content/themes/sebrae/do_registrar_presencial_gratis.php',
                dataType: "json",
                data: {
                    cursoId: $lnkPresencialGratis.data("curso_id"),
                    postId: $lnkPresencialGratis.data("post_id"),
                    cidade: cidade
                }
            });

            promise.done(function(obj) {
                if (obj.status === true) {
                    $(".mensagem-presencial-text").html(obj.message);
                    $(".mensagem-presencial").slideDown();
                } else {
                    $(".mensagem-presencial-text").html(obj.message);
                    $(".mensagem-presencial").slideDown();
                }

                setTimeout(function(){
                    $(".mensagem-presencial").slideUp();
                }, 12000);
            });

            promise.fail(function( msg ) {
                console.log("error");
                console.log(msg);
            });
        });

        $(".btn-presencial").on("click", function(){
            var $lnkPresencial = $(this);
            var redir = $.trim($lnkPresencial.data("redirect_to"));
            var cidade = $("form[name=frmCursoPresencial] input[name=cidade]:checked").val();

            if (cidade === "" ||
                cidade === undefined
            ) {
                alert("Escolha a cidade que deseja fazer o curso.");
                return;
            }

            redir += "&" + $.param({
                'cidade' : cidade
            });
            window.location = redir;
        });
    },

    confirmarMatricula: function()
    {
        $(".confirmarMatricula").on("click", function(e){
            var $linkMatricular = $(this);
            var formato = $linkMatricular.data("formato"), cidade = "", nomeCurso = "";
            if (formato === "" ||
                typeof formato == "undefined"
            ) {
                formato = 0;
            }
            if (formato == 4) {
                cidade = $linkMatricular.data("cidade");
                nomeCurso = $linkMatricular.data("post_title");
            }
            var promise = $.ajax({
                method: "POST",
                url: '/wp-content/themes/sebrae/enroll.php',
                data: {
                    "pkCurso" : $linkMatricular.data("pk_curso"),
                    "pkUsuario" : $linkMatricular.data("pk_usuario"),
                    "formato" : formato,
                    "cidade" : cidade,
                    "nomeCurso" : cidade,
                }
            });

            promise.done(function(obj) {
                if (obj.status === true) {
                    var l = window.location;
                    window.location = $linkMatricular.data("redirect_to");
                } else {
                    $(".mensagem-matricula-text").html(obj.messages.matricula);
                    $(".mensagem-matricula").slideDown();
                    setTimeout(function(){
                        $(".mensagem-matricula").slideUp();
                    }, 12000);
                }
            });

            promise.fail(function( msg ) {
                console.log("error");
                console.log(msg);
            });
        });
    },

    confirmaPagamento: function()
    {
        $("#frmPagamento").on("submit", function(){
            var promise = $.ajax({
                method: "POST",
                url: '/wp-content/themes/sebrae/do_pagamento.php',
                dataType: "json",
                data: $("#frmPagamento").serialize()
            });

            promise.done(function(obj) {
                if (obj.status === true) {
                    window.location = $("#frmPagamento").attr("action"); //redireciona para a tela de feedback positivo.
                } else {
                    $(".mensagem-pagamento-text").html(obj.messages.pagamento);
                    $(".mensagem-pagamento").slideDown();
                    setTimeout(function(){
                        $(".mensagem-pagamento").slideUp();
                    }, 12000);
                }
            });

            promise.fail(function( msg ) {
                console.log("error");
                console.log(msg);
            });
            return;
        });
    }
};
