'use strict'

$(document).ready(function () {
    // START: Floating form
    $(document).on('click', '.placeholder', function () {
        $(this).siblings('input').focus()
    })

    if ($('.form-group input').val()) {
        $(this).closest('.form-group').addClass('hasValue')
    }

    if ($(document).find('.form-group input').val()) {
        $(this).closest('.form-group').addClass('hasValue')
    } else {
        $(this).closest('.form-group').removeClass('hasValue')
    }

    $(document).on('keyup, change', '.form-group input', function () {
        let value = $(this).val()
        if (value) {
            $(this).closest('.form-group').addClass('hasValue')
        } else {
            $(this).closest('.form-group').removeClass('hasValue')
        }
    })
    // END: Floating form


    // START: Login
    async function login(username = null, password = null) {
        return $.ajax({
            url: '/api/staff/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password })
        })
    }

    function validate(message = null) {
        if (message) {
            $('#validation').text(message).show()
        } else {
            $('#validation').text('').hide()
        }
    }

    $(document).on('click', '#back-to-username', function () {
        $('input#password').closest('.form-group').removeClass('hasValue').hide()
        $('input#password').val('')
        $('input#password').css('border-color', '#091a50')

        $('input#username').closest('.form-group').fadeIn(400, function () {
            $('input#username').focus();
        })
        $('input#username').css('border-color', '#091a50')

        validate()

        $('#signin-form').removeClass('check-password').addClass('check-username')
        $('#signin-form').find('button[type=submit]').attr('id', 'check-username')

        $('#back-to-username').hide()
    })

    $(document).on('submit', '#signin-form.check-username', function (e) {
        e.preventDefault()
        const btn = $(this).find('button[type=submit]')
        const username = $('input#username').val().trim().toLowerCase()
        btn.addClass('processing')
        if (username.length) {
            login(username)
                .then(res => {
                    $('input#username').closest('.form-group').hide()
                    $('input#username').css('border-color', '#091a50')
                    $('input#password').closest('.form-group').fadeIn(400, function () {
                        $('input#password').focus();
                    })
                    validate()
                    $('#signin-form.check-username').removeClass('check-username').addClass('check-password')
                    btn.attr('id', 'check-password')
                    $('#back-to-username').show()
                    btn.removeClass('processing').blur()
                })
                .catch(error => {
                    validate(error.responseText || 'Terjadi kesalahan proses login')
                    btn.removeClass('processing').blur()
                })
        } else {
            validate('Masukkan username terlebih dahulu!')
            btn.removeClass('processing').blur()
        }
    })

    $(document).on('submit', '#signin-form.check-password', function (e) {
        e.preventDefault()
        const btn = $(this).find('button[type=submit]')
        const username = $('input#username').val().trim().toLowerCase()
        const password = $('input#password').val()
        btn.addClass('processing')
        if (password.length) {
            login(username, password)
                .then(res => {
                    validate()
                    $('input#password').css('border-color', '#091a50')
                    if ($(window).width() <= 767) $('.mobile-loader').show()

                    window.location.replace('/staff')
                })
                .catch(error => {
                    validate(error.responseText || 'Terjadi kesalahan proses login')
                    btn.removeClass('processing').blur()
                })
        } else {
            validate('Masukkan password terlebih dahulu!')
            btn.removeClass('processing').blur()
        }
    })
    // START: Login
})