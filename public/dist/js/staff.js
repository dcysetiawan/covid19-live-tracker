'use strict'

$(document).ready(function () {
    // START: Toggle sidebar
    let mini = false
    if ($(window).width() <= 767) {
        $('#sidebar').removeClass('expand').addClass('mini')
        $("#main-content").removeClass('mini').addClass('expand')
        mini = true
        $('#drop-shadow').on('click', function () {
            $('#sidebar').removeClass('expand').addClass('mini')
            $("#main-content").removeClass('mini').addClass('expand')
            $('#drop-shadow').hide()
            mini = true
        })
    }

    $('.toggle-sidebar').on('click', function () {
        if (mini === true) {
            // sidebar expanded
            $('#sidebar').removeClass('mini').addClass('expand')
            if ($(window).width() <= 767) {
                $("#main-content").removeClass('mini').addClass('expand')
                $('#drop-shadow').show()
            } else {
                $("#main-content").removeClass('expand').addClass('mini')
            }

            mini = false
        } else {
            // sidebar minified
            $('#sidebar').removeClass('expand').addClass('mini')
            if ($(window).width() <= 767) {
                $("#main-content").removeClass('mini').addClass('expand')
                $('#footer').css('left', '0')
                $('#drop-shadow').hide()
            } else {
                $("#main-content").removeClass('mini').addClass('expand')
            }

            mini = true
        }
    })
    // END: Toggle sidebar


    // START: Render data
    async function getData() {
        return $.ajax({
            type: 'GET',
            url: '/api/registration',
            contentType: 'application/json',
        })
    }

    async function renderData() {
        const loader = $('.registration-wrapper .spinner-border')
        loader.show()

        try {
            const data = await getData()
            loader.hide()

            $('#registration-table').DataTable({
                order: [],
                // scrollX: true,
                scrollY: '300px',
                data,
                columns: [
                    { data: 'name', title: 'Nama Pendaftar' },
                    { data: 'nik', title: 'NIK' },
                    { data: 'email', title: 'Email' },
                    { data: 'phone', title: 'No. Telepon' },
                    { data: 'address', title: 'Alamat' }
                ]
            })
        } catch (error) {
            loader.hide()
            console.error(error);
        }
    }
    // END: Render Data

    renderData()
})