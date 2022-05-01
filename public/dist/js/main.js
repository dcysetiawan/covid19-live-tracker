'use strict'

$(document).ready(function () {
    var stats = {}
    var sections = {}
    var header = $(document).find('.navbar').height() || 0

    // START: Smooth scroll
    $(document).on('click', '[data-scroll]', function (e) {
        const element = $(document).find($(this).data('scroll'))

        if (element.length) {
            const target = element.get(0)
            window.scrollTo({
                top: target.offsetTop - header,
                behavior: 'smooth'
            })
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
    })

    $('section').each((index, e) => {
        sections[e.id] = e.offsetTop
    })

    $(window).scroll(function () {
        for (let key in sections) {
            if ($(window).scrollTop() >= sections[key] - header) {
                $('.navbar-nav .nav-link').removeClass('active')
                $(`.navbar-nav .nav-link[data-scroll="#${key}"]`).addClass('active')
            }
        }

        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            $('.navbar-nav .nav-link').removeClass('active')
            $(`.navbar-nav .nav-link[data-scroll="#donation"]`).addClass('active')
        }
    })
    // END: Smooth scroll


    // START: Scroll to Top
    $(document).on('click', '.scroll-to-top', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    })

    $(window).scroll(function () {
        // Show scroll top button when window scroll position > 750
        if ($(window).scrollTop() > 750) {
            $(document).find('.scroll-to-top').css({ 'display': 'flex' })
        } else {
            $(document).find('.scroll-to-top').fadeOut(500)
        }
    })
    // END: Scroll to Top


    // START: Floating Form
    $(document).on('click', '.floating-form .placeholder', function () {
        $(this).siblings('input, textarea').focus()
    })

    if ($('.floating-form .form-group input, .floating-form .form-group textarea').val()) {
        $(this).closest('.form-group').addClass('hasValue')
    }

    if ($(document).find('.floating-form .form-group input, .floating-form .form-group textarea').val()) {
        $(this).closest('.form-group').addClass('hasValue')
    } else {
        $(this).closest('.form-group').removeClass('hasValue')
    }

    $(document).on('keyup, change', '.floating-form .form-group input, .floating-form .form-group textarea', function () {
        let value = $(this).val()
        if (value) {
            $(this).closest('.form-group').addClass('hasValue').removeClass('error')
        } else {
            $(this).closest('.form-group').removeClass('hasValue').addClass('error')
        }
    })
    // END: Floating Form


    // START: Statistics
    async function getData() {
        return Promise.all([
            $.ajax({
                type: 'GET',
                url: '/api/data/update',
                contentType: 'application/json',
            }),
            $.ajax({
                type: 'GET',
                url: '/api/data/prov',
                contentType: 'application/json',
            }),
            $.ajax({
                type: 'GET',
                url: '/api/data/vaksin',
                contentType: 'application/json',
            }),
        ])
    }

    async function renderCase() {
        try {
            const select = $('#stats-select')

            const data = await getData()
            const { update } = data[0]
            const { list_data } = data[1]
            const { vaksinasi1, vaksinasi2 } = data[2]

            if (vaksinasi1 && vaksinasi2) {
                $(document).find('#registration .total-vaccination').html(`<span>${vaksinasi1.toLocaleString().replace(/\,/g, '.')}</span> telah melakukan vaksin tahap pertama dan <span>${vaksinasi2.toLocaleString().replace(/\,/g, '.')}</span> telah melakukan vaksin tahap kedua.`)
            }

            stats['Nasional'] = {
                case: update.total.jumlah_positif || NaN,
                recovered: update.total.jumlah_sembuh || NaN,
                death: update.total.jumlah_meninggal || NaN,
            }

            list_data.map(({ key, jumlah_kasus, jumlah_sembuh, jumlah_meninggal }) => {
                stats[key] = {
                    case: jumlah_kasus || NaN,
                    recovered: jumlah_sembuh || NaN,
                    death: jumlah_meninggal || NaN,
                }
            })

            Object.keys(stats).map((key) => {
                select.append(`<option value="${key}">${key}</option>`)
            })

            select.find('option').eq(0).prop('selected', true)
            select.change()
        } catch (error) {
            console.error(error);
        }
    }

    $(document).on('change', '#stats-select', function () {
        const val = $(this).val()
        const stat = stats[val]
        if (val) {
            if (stat) {
                $('.stats-item.case .content').text(stat.case.toLocaleString().replace(/\,/g, '.'))
                $('.stats-item.recovered .content').text(stat.recovered.toLocaleString().replace(/\,/g, '.'))
                $('.stats-item.death .content').text(stat.death.toLocaleString().replace(/\,/g, '.'))
            }
        }
    })
    // END: Statistics


    // START: Hospitals
    async function getHospitals() {
        return $.ajax({
            type: 'GET',
            url: '/api/hospitals',
            contentType: 'application/json',
        })
    }

    async function renderHospitals() {
        const loader = $('.hospitals-wrapper .spinner-border')
        loader.show()

        try {
            const hospitals = await getHospitals()
            loader.hide()

            $('#hospitals-table').DataTable({
                order: [],
                // scrollX: true,
                scrollY: '400px',
                data: hospitals,
                columns: [
                    { data: 'name', title: 'Rumah Sakit' },
                    { data: 'phone', title: 'No. Telepon' },
                    { data: 'address', title: 'Alamat' },
                    { data: 'region', title: 'Lokasi' },
                    { data: 'province', title: 'Provinsi' },
                ]
            })
        } catch (error) {
            loader.hide()
            console.error(error);
        }

        // Re-init section offsetTop
        $('section').each((index, e) => {
            sections[e.id] = e.offsetTop
        })
    }
    // END: Hospitals


    // START: Registration
    $.fn.inputFilter = function (inputFilter) {
        // Restricts input for the set of matched elements to the given inputFilter function.
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value
                this.oldSelectionStart = this.selectionStart
                this.oldSelectionEnd = this.selectionEnd
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd)
            } else {
                this.value = ""
            }
        })
    }

    $('#registration-form').find('input[name="nik"], input[name="phone"]').inputFilter(function (value) {
        return /^\d*$/.test(value)
    })

    $(document).on('submit', '#registration-form', async function (e) {
        e.preventDefault()

        let data = {}
        let isError = false
        const form = $(this)
        const validationBox = $(this).find('.validation')
        const submitButton = $(this).find('[type="submit"]')

        $(this).find('input, textarea').each(function (i, el) {
            $(el).closest('.form-group').removeClass('error')

            const name = $(el).attr('name')
            const value = $(el).val().trim()

            if (!value) {
                isError = true
                $(el).closest('.form-group').addClass('error')
                return
            }

            data[name] = value
        })

        if (isError) {
            validationBox.text('Mohon lengkapi form dengan benar!').addClass('bg-danger').removeClass('bg-success').show()
            return
        } else {
            validationBox.text('').removeClass('bg-success bg-danger').hide()
        }

        // Add loader
        submitButton.text('Sending...')

        // Fire off the request to /api/registration
        $.ajax({
            type: 'POST',
            url: '/api/registration',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                validationBox.text('Terimakasih telah mendaftar :)').addClass('bg-success').removeClass('bg-danger').show()

                // Reset form
                form.trigger('reset')
                form.find('.form-group').removeClass('hasValue')
            },
            error: function (error) {
                validationBox.text('Telah terjadi kesalahan!').addClass('bg-danger').removeClass('bg-success').show()
                console.error(error)
            },
            complete: function () {
                submitButton.text('Send Message')

                setTimeout(() => {
                    validationBox.fadeOut(500, () => { validationBox.text('').removeClass('bg-success bg-danger') })
                }, 5000)
            }
        })
    })
    // END: Registration


    renderCase()
    renderHospitals()
})