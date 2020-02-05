const key = '8526b1534ed85ad06cbfeabfb208e16f';
const spinner = $('.spinner');
$(document).ready(function () {
    getCharacters(null);
    getComics(null);
    $('#filter').keyup(function () {
        let search = $(this).val();
        remove($('#comics .paginationjs'));
        remove($('#characters .paginationjs'));
        getCharacters(search);
        getComics(search);
    });
});

function getCharacters(search) {
    let path = '';
    if (search) {
        path = 'nameStartsWith=' + search + '&';
    }
    $('#characters').pagination({
        dataSource: function(done) {
            $.ajax({
                url: "https://gateway.marvel.com:443/v1/public/characters?" + path + "limit=20&apikey=" + key,
                type: "GET",
                beforeStart: () => {
                    spinner.show();
                },
                complete: () => {
                    spinner.hide();
                },
                success: function (response) {
                    done(response.data.results);
                },
                error: () => {
                    $('#characters').append('<p>Ha ocurrido un error</p>');
                }
            });
        },
        locator: 'items',
        totalNumber: 20,
        limit: 10,
        callback: function (data, pagination) {
            console.log('kk');
            remove($('#characters .paginationjs'));
            printCharacters(data);
        }
    })
}

function getComics(search) {
    let path = '';
    if (search) {
        path = 'titleStartsWith=' + search + '&';
    }
    $('#comics').pagination({
        dataSource: function(done) {
            $.ajax({
                url: "https://gateway.marvel.com:443/v1/public/comics?" + path + "apikey=" + key,
                type: "GET",
                beforeStart: () => {
                    spinner.show();
                },
                complete: () => {
                    spinner.hide();
                },
                success: function (response) {
                    done(response.data.results);
                },
                error: () => {
                    $('#comics').append('<p>Ha ocurrido un error</p>');
                }
            });
        },
        locator: 'items',
        totalNumber: 20,
        limit: 10,
        callback: function (data, pagination) {
            console.log('kk');
            remove($('#comics .paginationjs'));
            printComics(data);
        }
    })
    // $.ajax({
    //     url: "https://gateway.marvel.com:443/v1/public/comics?" + path + "apikey=" + key,
    //     type: "GET",
    //     beforeStart: () => {
    //         spinner.show();
    //     },
    //     complete: () => {
    //         spinner.hide();
    //     },
    //     success: function (response) {
    //         printComics(response);
    //     }
    // });
}

function printCharacters(response) {
    if (response) {
        var characters = [];
        response.map(char => {
            characters.push(char);
        });
        characters.map(char => {
            let id = 'char' + char.id;
            $('#characters').append('<div id="' + id + '" class="card" style="width: 200px;"></div>');
            $('#' + id).append('<img src="' + char.thumbnail.path + '.' + char.thumbnail.extension + '" class="card-img-top">');
            $('#' + id).append('<div class="card-body"><h5 class="card-title">' + char.name + '</h5></div>')
        })
    }
}

function printComics(response) {
    if (response) {
        var comics = [];
        response.map(comic => {
            comics.push(comic);
        });
        comics.map(comic => {
            let id = 'com' + comic.id;
            let desc = comic.description;
            if (!desc) {
                desc = 'Without description';
            }
            $('#comics').append('<div id="' + id + '" class="card" style="width: 200px;"></div>');
            $('#' + id).append('<img src="' + comic.thumbnail.path + '.' + comic.thumbnail.extension + '" class="card-img-top">');
            $('#' + id).append('<div class="card-body"><h5 class="card-title">' + comic.title +
                '</h5><p class="description"></p></div>');
            showMoreLess(id, desc);
        })
    }
}

function showMoreLess(id, desc) {
    const maxLength = 20;
    let descLength = desc.length;
    let parent = '#' + id + '  .description';

    if (descLength > maxLength) {
        let descMin = desc.substring(0, maxLength);
        let descMax = desc.substring(maxLength);
        $(parent).append(descMin + '<span class="dots">...</span>' + '<span class="more">' +
            descMax + '</span><a href="#" class="showDesc">Show More</a>');
        $(parent + ' a').click(function (event) {
            event.preventDefault();
            showHide(parent);
        });
    } else {
        $(parent).append(desc);
    }
}

function showHide(parent) {
    if ($(parent + ' .more').css('display') === 'none') {
        $(parent + ' .dots').css('display', 'none');
        $(parent + ' .showDesc').text('Show Less');
        $(parent + ' .more').css('display', 'inline');
    } else {
        $(parent + ' .dots').css('display', 'inline');
        $(parent + ' .showDesc').text('Show More');
        $(parent + ' .more').css('display', 'none');
    }
}

function remove($node) {
    while($node.next().is('div')){
        $node.next('div').remove();
    }
}
