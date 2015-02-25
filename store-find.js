var _stores = {
    labels: ['Estado:', 'Cidade:', 'Loja:'],
    icons: ['pointer.png', 'pointer_icon_shadow.png'],
    sort: false,
    url: "/front/js/xml/lojas.xml",
    ufs: [],
    cities: [],
    stores: [],
    city: {
        "AC": "Acre",
        "AL": "Alagoas",
        "AP": "Amapá",
        "AM": "Amazonas",
        "BA": "Bahia",
        "CE": "Ceará",
        "DF": "Distrito Federal",
        "ES": "Espírito Santo",
        "GO": "Goiás",
        "MA": "Maranhão",
        "MT": "Mato Grosso",
        "MS": "Mato Grosso do Sul",
        "MG": "Minas Gerais",
        "PA": "Pará",
        "PB": "Paraíba",
        "PR": "Paraná",
        "PE": "Pernambuco",
        "PI": "Piauí",
        "RJ": "Rio de Janeiro",
        "RN": "Rio Grande do Norte",
        "RS": "Rio Grande do Sul",
        "RO": "Rondônia",
        "RR": "Roraima",
        "SC": "Santa Catarina",
        "SP": "São Paulo",
        "SE": "Sergipe",
        "TO": "Tocantins"
    },
    xml: null,
    init: function() {
        //_stores.set.browser();
        _stores.get.stores();
    },
    set: {
        environment: function() {
            _stores.set.select.state();
            _stores.set.select.city();
            _stores.set.select.store();
            _stores.place.brasil();
            _stores.place.characters();

            _stores.set.ufs();
        },

        select: {
            state: function() {
                var stores_div = $(".filtro");
                var state_div = $("<div/>").addClass("state_select_wrapper");
                var label = $("<label/>").addClass("state_label").text(_stores.labels[0]);
                var select = $("<select/>").attr("name", "uf").addClass("select_uf");

                $(stores_div).empty();
                $(state_div).append(label).append(select);
                $(stores_div).append(state_div);
            },

            city: function() {
                var stores_div = $(".filtro");
                var city_div = $("<div/>").addClass("city_select_wrapper");
                var label = $("<label/>").addClass("city_label").text(_stores.labels[1]);
                var select = $("<select/>").attr("name", "city").addClass("select_city");
                var option = $("<option/>").text("--");

                $(select).append(option);
                $(city_div).append(label).append(select);
                $(stores_div).append(city_div);
            },

            store: function() {
                var stores_div = $(".filtro");
                var store_div = $("<div/>").addClass("store_select_wrapper").addClass("clearfix");
                var label = $("<label/>").addClass("store_label").text(_stores.labels[2]);
                var select = $("<select/>").attr("name", "store").addClass("select_store");
                var option = $("<option/>").text("--");

                $(select).append(option);
                $(store_div).append(label).append(select);
                $(stores_div).append(store_div);
            }
        },

        ufs: function() {
            if (!_stores.get.ufs()) return false;
            var ufs_list = _stores.ufs.slice();
            ufs_list.sort();

            var options = "<option>Estado</option>";
            $(ufs_list).each(function(ndx, item) {
                options = options + "<option value=\"" + item + "\">" + item + "</option>";
            });
            $(".state_select_wrapper select").html(options);

        },

        cities: function(uf) {
            if (!_stores.get.cities(uf)) return false;

            var options = "<option>Cidade</option>";
            $(_stores.cities).each(function(ndx, item) {
                options = options + "<option value=\"" + item + "\">" + item + "</option>";
            });
            $(".city_select_wrapper select").html(options);

        },

        stores: function(city) {
            if (!_stores.get.names(city)) return false;

            var options = "<option>Selecione a Loja</option>";
            $(_stores.stores).each(function(ndx, item) {
                options = options + "<option value=\"" + item + "\">" + item + "</option>";
            });
            $(".store_select_wrapper select").html(options);

        },

        events: function() {
            $(".state_select_wrapper select").bind("change", function() {
                var uf = this.value;
                if (uf == "--" || uf.length == 0) {
                    $(".state-wrapper").addClass("collapsed");
                    _stores.show.all_info();
                    _stores.show.all();
                    _stores.clear.cities();
                    _stores.clear.stores();
                } else {
                    // $(".state-wrapper-"+uf).removeClass("collapsed");
                    _stores.show.all_info();
                    _stores.show.state(uf);
                    _stores.set.cities(uf);
                    _stores.clear.stores();
                }
            });

            $(".city_select_wrapper select").bind("change", function() {
                var city = this.value;
                if (city == "--" || city.length == 0) {
                    _stores.clear.stores();
                    _stores.show.all_info();
                } else {
                    _stores.show.info(city);
                    _stores.set.stores(city);
                }
            });

            $(".store_select_wrapper select").bind("change", function() {
                var store = this.value;
                if (store == "--" || store.length == 0) {
                    $(".info-wrapper").removeClass("open").addClass("collapsed");
                    // return;
                } else {
                    $(".info-wrapper").removeClass("open").addClass("collapsed");
                    _stores.show.store(store);
                }
            });

            $(".state-title").parent().addClass("collapsed");
            $(".state-title").bind("click", function() {
                if ($(this).parent().hasClass("collapsed"))
                    $(this).parent().removeClass("collapsed");
                else
                    $(this).parent().addClass("collapsed");
            });

            $(".store-title").parents(".info-wrapper").addClass("collapsed").addClass("clearfix");
            $(".store-title").bind("click", function() {
                if ($(this).parents(".info-wrapper").hasClass("collapsed")) {
                    $(this).parents(".info-wrapper").removeClass("collapsed").addClass("open");
                    rel = $(this).attr('rel');
                    if ($('.map-container-' + rel).find("div").length <= 0) {
                        store_address = $(this).attr('address');
                        map_container = $('.map-container-' + rel);
                        $('.map-container').removeClass('active');
                        $('.map-container-' + rel).addClass('active');
                        _stores.show.map(store_address, map_container);
                    }
                }
                // else
                // $(this).parents(".info-wrapper").removeClass("open").addClass("collapsed");
            });
            //abrir uma loja no carregamento da página
            load_store.init_store();
        },

        browser: function() // adiciona "class" ie, fx, chrome ou other no body
            {
                var browser = $.browser.msie ? 'ie' : /(chrome)/.test(navigator.userAgent.toLowerCase()) ? 'chrome' : $.browser.mozilla ? 'fx' : 'other';
                var version = $.browser.version.split('.').shift();
                $("body").addClass(browser + " " + browser + version);
            }
    },

    get: {
        stores: function() {
            $.ajax({
                url: _stores.url,
                success: function(data) {
                    xmlString = (new XMLSerializer()).serializeToString(data)
                    var result = xmlString.match(/<dados([\S\s]*?)(.+)dados>/g);

                    if (result != null) {
                        _stores.xml = _stores.convert.StringtoXML(result[0]);
                        _stores.set.environment();
                        _stores.place.stores();
                    } else
                        alert("Não foi encontrado os dados para Nossas Lojas.\nVerifique a url e se o xml está inserido.");
                }
            });
        },

        ufs: function() {
            var all_ufs = $(_stores.xml).find("uf");
            _stores.ufs = [];
            $(all_ufs).each(function(ndx, item) {
                if (!_stores.ufs.inArray($(item).text()))
                    _stores.ufs.push($(item).text());
            });
            if (_stores.ufs.length > 0) {
                if (_stores.sort) _stores.ufs.sort();
                return true;
            } else return false;
        },

        cities: function(selected_uf) {
            if (typeof(selected_uf) == "undefined" || selected_uf == "") return false;

            var cities = $(_stores.xml).find('uf:contains("' + selected_uf + '")').siblings("cidade");
            _stores.cities = [];
            $(cities).each(function(ndx, item) {
                if (!_stores.cities.inArray($(item).text()))
                    _stores.cities.push($(item).text());
            });
            if (_stores.cities.length > 0) {
                _stores.cities.sort();
                return true;
            } else return false;
        },

        names: function(selected_city) {
            if (typeof(selected_city) == "undefined" || selected_city == "") return false;

            var stores = $(_stores.xml).find('cidade:contains("' + selected_city + '")').siblings("info").find("nome");
            _stores.stores = [];
            $(stores).each(function(ndx, item) {
                if (!_stores.stores.inArray($(item).text()))
                    _stores.stores.push($(item).text());
            });
            if (_stores.stores.length > 0) {
                // _stores.stores.sort();
                return true;
            } else return false;
        }
    },

    place: {
        stores: function() {

            var states_divs = $(".result");
            var state_div, state_title, store_container, text;
            $(_stores.ufs).each(function(ndx, item) {
                class_name = item;
                state_div = $('<div/>').addClass('state-wrapper').addClass('state-wrapper-' + class_name);
                text = _stores.city[class_name];
                state_title = $('<h4/>').addClass('state-title').addClass('state-title-' + class_name).text(text);
                store_container = $('<div/>').addClass('store-wrapper').addClass('store-wrapper-' + class_name);
                $(state_div).append(state_title).append(store_container);
                $(states_divs).append(state_div);
            });

            var store_div, store_title, classname, info_wrapper_div, address;
            $(_stores.xml).find("loja").each(function(ndx, item) {
                if ($(item).find("cidade").length <= 0) return false;

                text = $(item).find("nome").text();
                text_link = text.replace(/ /g, "");
                div_classname = $(item).find("cidade").text().replace(/ /g, "");
                store_classname = $(item).find("nome").text().replace(/ /g, "");

                info_wrapper_div = $('<div/>').addClass('info-wrapper').addClass('info-wrapper-' + text_link);
                info_div = $('<div/>').addClass('info-container');

                address = $('<p/>').addClass('address');
                address_text = $(item).find("endereco").text();
                address_google_text = $(item).find("google").text();
                address_text_br = address_text.replace(/\n/g, "<br/>");
                address_ref = address_google_text.replace(/\n/g, " ");
                $(address).html(address_text_br);

                store_title = $("<h5/>").addClass('store-title').addClass('store-title-' + text_link).attr('rel', ndx).attr('address', address_ref).text(text);

                tel = $('<p/>').addClass('tel');
                $(tel).html($(item).find("telefone").text().replace(/\n/g, "<br/>"));

                funcionamento = $('<p/>').addClass('hours');
                $(funcionamento).html($(item).find("funcionamento").text().replace(/\n/g, "<br/>"));

                img = $('<img/>').attr('src', $(item).find("img").text());
                div_img = $('<div/>').addClass('img-container');

                div_map = $('<div/>').addClass('map-container').addClass('map-container-' + ndx);
                div_info_text = $('<div/>').addClass('info-text-container');
                clear = $('<div/>').addClass('clear');

                $(div_img).append(img);
                $(div_info_text).append(address).append(tel).append(funcionamento).append(div_img);
                $(info_div).append(store_title).append(div_info_text);
                $(info_wrapper_div).append(info_div); //.append(clear);
                $('.map').append(div_map); //.append(clear);

                if ($('.store-container-' + div_classname).length <= 0) {
                    store_div = $('<div/>').addClass('store-container').addClass('store-container-' + div_classname);
                    $(store_div).append(info_wrapper_div);
                    $('.store-wrapper-' + $(item).find("uf").text()).append(store_div);
                } else {
                    $('.store-container-' + div_classname).append(info_wrapper_div);
                }
            });

            _stores.set.events();
        },

        characters: function() {
            var characters_div = $("<div/>").addClass("characters");
            $(".content_wrapper").append(characters_div);
        },

        brasil: function() {
            var brasil_div = $("<div/>").addClass("brasil_map");
            $(".content_wrapper").append(brasil_div);
        }
    },

    clear: {
        cities: function() {
            $(".city_select_wrapper select").html("<option>--</option>");
        },
        stores: function() {
            $(".store_select_wrapper select").html("<option>--</option>");
        }
    },

    show: {
        state: function(selected_uf) {
            $(".state-wrapper").removeClass("open");
            $(".state-wrapper-" + selected_uf).addClass("open");
            $(".result").addClass("collapsed");
        },

        store: function(selected_store) {
            $(".store-title-" + selected_store.replace(/ /g, "")).click();
            // $(".info-wrapper").removeClass("open");
            // $(".info-wrapper-"+selected_store.replace(/ /g,"")).addClass("open").removeClass("collapsed");
        },

        info: function(selected_city) {
            $(".store-container").removeClass("open");
            $(".store-container-" + selected_city.replace(/ /g, "")).addClass("open");
            $(".store-wrapper").addClass("collapsed");
        },

        all_info: function() {
            $(".store-container").removeClass("open");
            $(".store-wrapper").removeClass("collapsed");
        },

        all: function() {
            $(".state-wrapper").removeClass("open");
            $(".result").removeClass("collapsed");
        },

        map: function(address, container) {
            var geocoder, results;
            var map;
            var url = document.location.protocol + "//" + document.location.host;
            geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': address
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var lat = results[0].geometry.location.lat();
                    var lng = results[0].geometry.location.lng();
                    var myLatlng = new google.maps.LatLng(lat, lng);
                    var myOptions = {
                        zoom: 15,
                        center: myLatlng,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map_container = $(container)[0];
                    map = new google.maps.Map(map_container, myOptions);
                    var image = url + '/wp-content/uploads/2014/10/' + _stores.icons[0];
                    var shadow = url + '/wp-content/uploads/2014/10/' + _stores.icons[1];
                    var marker = new google.maps.Marker({
                        position: myLatlng,
                        map: map,
                        icon: image,
                        shadow: shadow
                    });
                }
            });
        }
    },
    
    convert: {
        StringtoXML: function(text) {
            if (window.ActiveXObject) {
                var doc = new ActiveXObject('Microsoft.XMLDOM');
                doc.async = 'false';
                doc.loadXML(text);
            } else {
                var parser = new DOMParser();
                var doc = parser.parseFromString(text, 'text/xml');
            }
            return doc;
        }
    }
}

var load_store = {
    init_store: function() {
        $('.select_uf').find('option:contains("SP")').attr('selected', 'selected').change();
        $('.select_city').find('option:contains("São Bernardo do Campo")').attr('selected', 'selected').change();
        $('.select_store').find('option:contains("CHRONIC 420 SBC")').attr('selected', 'selected').change();
    }
}


$(function() {
    _stores.init();

});

Array.prototype.inArray = function(value) {
    // Returns true if the passed value is found in the array. Returns false if it is not.
    var i;
    for (i = 0; i < this.length; i++)
        if (this[i] == value)
            return true;
    return false;
};