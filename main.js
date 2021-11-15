gsap.from('nav', {opacity:0, delay:1.6, duration:2.5, ease: "elastic.out(1,0.3)", y:-100});

gsap.from('.search', {opacity:0, delay:1.8, duration:2.8, ease: "elastic.out(1,0.3)", y:-100});

gsap.from('.brand_type', {opacity:0, delay:2.2, duration:3, ease: "elastic.out(1,0.3)", y:-100});

gsap.from('.discount', {opacity:0, delay:1, scale:.1, duration:2.4, rotation:180,
 ease: "expo.inOut", x:100});

gsap.from('.bottom_shoes_card', {opacity:0, delay:2.6, duration:3.5, ease: "elastic.out(1,0.3)", x:100});

gsap.from('.selected_product_img', {opacity:0, delay:3, duration:4, ease:"elastic.out(1,0.3)", y:100});

gsap.from('.size_product', {opacity:0, delay:3.5, duration:0.5, ease:"Expo.In", y:100});

gsap.from('.circle1', {opacity:0, delay:4.5, scale:.1, duration:.7, ease:"expo.In"});

gsap.from('.circle2', {opacity:0, delay:4.8, scale:.1, duration:.7, ease:"expo.In"});

gsap.from('.panier', {opacity:0, delay:4.8, scale:.1, duration:.7, ease:"expo.In"});



/Filter list/ 
function myFunction() {
    var input, filter, main,a, i, txtValue;
    input = document.getElementsByClassName("search_input");
    filter = input.value.toUpperCase();
    main = document.getElementsByClassName("right_container");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByClassName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

// comportement du panier au survol pour affichage de son contenu
var timeout;

$('#cart').on({
    mouseenter: function() {
        $('#cart-dropdown').show();
    },
    mouseleave: function() {
        timeout = setTimeout(function() {
            $('#cart-dropdown').hide();
        }, 200);
    }
});

// laisse le contenu ouvert à son survol
// le cache quand la souris sort
$('#cart-dropdown').on({
    mouseenter: function() {
        clearTimeout(timeout);
    },
    mouseleave: function() {
        $('#cart-dropdown').hide();
    }
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();

    // règle le pb des caractères interdits
    if ('btoa' in window) {
        cvalue = btoa(cvalue);
    }

    document.cookie = cname + "=" + cvalue + "; " + expires+';path=/';
}

function saveCart(inCartItemsNum, cartArticles) {
    setCookie('inCartItemsNum', inCartItemsNum, 5);
    setCookie('cartArticles', JSON.stringify(cartArticles), 5);
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');

    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c[0] == ' ') {
            c = c.substring(1);
        }

        if (c.indexOf(name) != -1) {
            if ('btoa' in window) return atob(c.substring(name.length,c.length));}
            else return c.substring(name.length,c.length);
        }
    }

    return false;
}

// variables pour stocker le nombre d'articles et leurs noms
var inCartItemsNum;
var cartArticles;

// affiche/cache les éléments du panier selon s'il contient des produits
function cartEmptyToggle() {
    if (inCartItemsNum > 0) {
        $('#cart-dropdown .hidden').removeClass('hidden');
        $('#empty-cart-msg').hide();
    }

    else {
        $('#cart-dropdown .go-to-cart').addClass('hidden');
        $('#empty-cart-msg').show();
    }
}

// récupère les informations stockées dans les cookies
inCartItemsNum = parseInt(getCookie('inCartItemsNum') ? getCookie('inCartItemsNum') : 0);
cartArticles = getCookie('cartArticles') ? JSON.parse(getCookie('cartArticles')) : [];

cartEmptyToggle();

// affiche le nombre d'article du panier dans le widget
$('#in-cart-items-num').html(inCartItemsNum);

// hydrate le panier
var items = '';
cartArticles.forEach(function(v) {
   items += '<li id="'+ v.id +'"><a href="'+ v.url +'">'+ v.name +'<br><small>Quantité : <span class="qt">'+ v.qt +'</span></small></a></li>';
});

$('#cart-dropdown').prepend(items);

/ click bouton ajout panier
$('.add-to-cart').click(function() {

    // récupération des infos du produit
    var $this = $(this);
    var id = $this.attr('data-id');
    var name = $this.attr('data-name');
    var price = $this.attr('data-price');
    var weight = $this.attr('data-weight');
    var url = $this.attr('data-url');
    var qt = parseInt($('#qt').val());
    inCartItemsNum += qt;

    // mise à jour du nombre de produit dans le widget
    $('#in-cart-items-num').html(inCartItemsNum);

    var newArticle = true;

    // vérifie si l'article est pas déjà dans le panier
    cartArticles.forEach(function(v) {
        // si l'article est déjà présent, on incrémente la quantité
        if (v.id == id) {
            newArticle = false;
            v.qt += qt;
            $('#'+ id).html('<a href="'+ url +'">'+ name +'<br><small>Quantité : <span class="qt">'+ v.qt +'</span></small></a>');
        }
    });

    // s'il est nouveau, on l'ajoute
    if (newArticle) {
        $('#cart-dropdown').prepend('<li id="'+ id +'"><a href="'+ url +'">'+ name +'<br><small>Quantité : <span class="qt">'+ qt +'</span></small></a></li>');

        cartArticles.push({
            id: id,
            name: name,
            price: price,
            weight: weight,
            qt: qt,
            url: url
        });
    }

    // sauvegarde le panier
    saveCart(inCartItemsNum, cartArticles);

    // affiche le contenu du panier si c'est le premier article
    cartEmptyToggle();
});
//  le plus imprtant

if (window.location.pathname == '/panier/') {
    var items = '';
    var subTotal = 0;
    var total;
    var weight = 0;

    /* on parcourt notre array et on créé les lignes du tableau pour nos articles :
    * - Le nom de l'article (lien cliquable qui mène à la fiche produit)
    * - son prix
    * - la dernière colonne permet de modifier la quantité et de supprimer l'article
    *
    * On met aussi à jour le sous total et le poids total de la commande
    */
    cartArticles.forEach(function(v) {
        // opération sur un entier pour éviter les problèmes d'arrondis
        var itemPrice = v.price.replace(',', '.') * 1000;
        items += '<tr data-id="'+ v.id +'">\
             <td><a href="'+ v.url +'">'+ v.name +'</a></td>\
             <td>'+ v.price +'€</td>\
             <td><span class="qt">'+ v.qt +'</span> <span class="qt-minus">–</span> <span class="qt-plus">+</span> \
             <a class="delete-item">Supprimer</a></td></tr>';
        subTotal += v.price.replace(',', '.') * v.qt;
        weight += v.weight * v.qt;
    });

    // on reconverti notre résultat en décimal
    subTotal = subTotal / 1000;

    // On insère le contenu du tableau et le sous total
    $('#cart-tablebody').empty().html(items);
    $('.subtotal').html(subTotal.toFixed(2).replace('.', ','));

    // lorsqu'on clique sur le "+" du panier
    $('.qt-plus').on('click', function() {
        var $this = $(this);

        // récupère la quantité actuelle et l'id de l'article
        var qt = parseInt($this.prevAll('.qt').html());
        var id = $this.parent().parent().attr('data-id');
        var artWeight = parseInt($this.parent().parent().attr('data-weight'));

        // met à jour la quantité et le poids
        inCartItemsNum += 1;
        weight += artWeight;
        $this.prevAll('.qt').html(qt + 1);
        $('#in-cart-items-num').html(inCartItemsNum);
        $('#'+ id + ' .qt').html(qt + 1);

        // met à jour cartArticles
        cartArticles.forEach(function(v) {
            // on incrémente la qt
            if (v.id == id) {
                v.qt += 1;

                // récupération du prix
                // on effectue tous les calculs sur des entiers
                subTotal = ((subTotal * 1000) + (parseFloat(v.price.replace(',', '.')) * 1000)) / 1000;
            }
        });

        // met à jour la quantité du widget et sauvegarde le panier
        $('.subtotal').html(subTotal.toFixed(2).replace('.', ','));
        saveCart(inCartItemsNum, cartArticles);
    });

    // quantité -
    $('.qt-minus').click(function() {
        var $this = $(this);
        var qt = parseInt($this.prevAll('.qt').html());
        var id = $this.parent().parent().attr('data-id');
        var artWeight = parseInt($this.parent().parent().attr('data-weight'));

        if (qt > 1) {
            // maj qt
            inCartItemsNum -= 1;
            weight -= artWeight;
            $this.prevAll('.qt').html(qt - 1);
            $('#in-cart-items-num').html(inCartItemsNum);
            $('#'+ id + ' .qt').html(qt - 1);

            cartArticles.forEach(function(v) {
                // on décrémente la qt
                if (v.id == id) {
                    v.qt -= 1;

                    // récupération du prix
                    // on effectue tous les calculs sur des entiers
                    subTotal = ((subTotal * 1000) - (parseFloat(v.price.replace(',', '.')) * 1000)) / 1000;
                }
            });

            $('.subtotal').html(subTotal.toFixed(2).replace('.', ','));
            saveCart(inCartItemsNum, cartArticles);
        }
    });

    // suppression d'un article
    $('.delete-item').click(function() {
        var $this = $(this);
        var qt = parseInt($this.prevAll('.qt').html());
        var id = $this.parent().parent().attr('data-id');
        var artWeight = parseInt($this.parent().parent().attr('data-weight'));
        var arrayId = 0;
        var price;

        // maj qt
        inCartItemsNum -= qt;
        $('#in-cart-items-num').html(inCartItemsNum);

        // supprime l'item du DOM
        $this.parent().parent().hide(600);
        $('#'+ id).remove();

        cartArticles.forEach(function(v) {
            // on récupère l'id de l'article dans l'array
            if (v.id == id) {
                // on met à jour le sous total et retire l'article de l'array
                // as usual, calcul sur des entiers
                var itemPrice = v.price.replace(',', '.') * 1000;
                subTotal -= (itemPrice * qt) / 1000;
                weight -= artWeight * qt;
                cartArticles.splice(arrayId, 1);

                return false;
            }

            arrayId++;
        });

        $('.subtotal').html(subTotal.toFixed(2).replace('.', ','));
        saveCart(inCartItemsNum, cartArticles);
        cartEmptyToggle();
    });
}












* Compute price from weight and destination zone
 * @param {number} weight Total weight in gram
 * @param {number} region Postal region based on La Poste regions
 * @return {number} shipping price in Euros
 **/
function computeShipping(weight, region) {
  var shipping;
      // Zone 6 
if (region == 6) {
  if (weight <= 1000) {
      shipping= 20;
  }
  else if (weight > 1000 && weight <= 2000) {
      shipping = 24;
  }
  else if (weight > 2000 && weight <= 3000) {
      shipping = 28;
  }
  else if (weight > 3000 && weight <= 4000) {
      shipping = 31;
  }
  else if (weight > 4000 && weight <= 5000) {
      shipping = 35;
  }
  else if (weight > 5000 && weight <= 6000) {
      shipping = 38;
  }
  else if (weight > 6000 && weight <= 7000) {
      shipping = 42;
  }
  else if (weight > 7000 && weight <= 8000) {
      shipping = 46;
  }
  else if (weight > 8000 && weight <= 9000) {
      shipping = 50;
  }
  else if (weight > 9000 && weight <= 10000) {
      shipping = 53;
  }
  else if (weight > 10000 && weight <= 15000) {
      shipping = 71;
  }
  else if (weight > 15000 && weight <= 20000) {
      shipping = 89;
  }
  else if (weight > 20000 && weight <= 25000) {
      shipping = 106;
  }
  else if (weight > 25000) {
      shipping = 124;
  }
  }
  
  // Zone 7 USA
  else if (region == 7) {
    if (weight <= 1000) {
      shipping= 25;
    }
    else if (weight > 1000 && weight <= 2000) {
      shipping = 33;
    }
    else if (weight > 2000 && weight <= 3000) {
      shipping = 41;
    }
    else if (weight > 3000 && weight <= 4000) {
      shipping = 49;
    }
    else if (weight > 4000 && weight <= 5000) {
      shipping = 56;
    }
    else if (weight > 5000 && weight <= 6000) {
      shipping = 63;
    }
    else if (weight > 6000 && weight <= 7000) {
      shipping = 71;
    }
    else if (weight > 7000 && weight <= 8000) {
      shipping = 79;
    }
    else if (weight > 8000 && weight <= 9000) {
      shipping = 86;
    }
    else if (weight > 9000 && weight <= 10000) {
      shipping = 94;
    }
    else if (weight > 10000 && weight <= 15000) {
      shipping = 128;
    }
    else if (weight > 15000 && weight <= 20000) {
      shipping = 163;
    }
    else if (weight > 20000 && weight <= 25000) {
      shipping = 198;
    }
    else if (weight > 25000) {
      shipping = 231;
    }
  }
  
  }
  
  return shipping;
}