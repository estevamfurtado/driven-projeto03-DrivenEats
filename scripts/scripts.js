
let cardapio = [
    [["Big Méqui", 18.50], ["Cheddar MéqMelt", 17.50], ["Quarteirinho", 15.50], ["BigTeisti", 20.0]],
    [["Coca", 5.0], ["Guaraná", 5.0], ["Suco de Uva", 4.50]],
    [["Casquete", 3.0], ["SunDay", 8.0], ["MéquiFlury", 12.0]]
]

let carrinho = [-1, -1, -1];
let numDeSelecoes = 0;
let nomeDoCliente = "";
let valorDoCarrinho = 0.0;
let podeFinalizar = false;

let wppLink = "";


function adicionarItemAoCarrinho (section, item) {

    const previousItem = carrinho[section];

    if (item === previousItem) {
        carrinho[section] = -1;
        numDeSelecoes += -1;
        //console.log("* Você retirou o " + cardapio[section][previousItem][0] + " do carrinho.")
        toggleClass("card-"+ section + "-"+ previousItem,"selected");
    }
    else {
        if (previousItem > -1) {
            //console.log("* Você retirou o " + cardapio[section][previousItem][0] + " do carrinho.")
            toggleClass("card-"+ section + "-"+ previousItem,"selected");
            numDeSelecoes += -1;
        }
        carrinho[section] = item;
        numDeSelecoes += 1;
        //console.log("* Você adicionou o " + cardapio[section][item][0] + " ao carrinho.")
        toggleClass("card-"+ section + "-"+ item,"selected");
    }

    //descreverCarrinho();

    calcularValorDoCarrinho();

    liberarBotaoDeFinalizacao();
}


function calcularValorDoCarrinho () {


    //console.log("Calculando valor total . . .")

    let total = 0.0;

    for (const section in carrinho) {

        let item = carrinho[section];

        if (item > -1) {
            total += cardapio[section][item][1];
        }
    } 

    valorDoCarrinho = total;

    //console.log("> Valor total do carrinho é: R$ " + valorDoCarrinho)
}


function descreverCarrinho() {

    //console.log("Verificando o carrinho . . .")

    let isEmpty = true;

    for (const section in carrinho) {

        let item = carrinho[section];
        //console.log(item);

        if (item > -1) {
            console.log("> " + cardapio[section][item][0]);
            isEmpty = false;
        }
    }

    if (isEmpty) {
        console.log("> Carrinho está vazio.")
    }
}


function toggleClass (elementID, className) {
    document.getElementById(elementID).classList.toggle(className);
}


function liberarBotaoDeFinalizacao() {

    const button = document.getElementById("checkOut-button");
    let disabled = button.disabled; 

    if (disabled == true & numDeSelecoes == 3) {
        button.disabled = false;
        button.innerHTML = "Feche o pedido!";
    }
    else if (disabled == false & numDeSelecoes < 3) {
        button.disabled = true;
        button.innerHTML = "Selecione os 3 itens para fechar o pedido";
        
    }
}

function openCarrinhoScreen() {
    atualizarTextosDoCarrinho();
    wppLink = gerarLinkDeWpp();
    toggleClass("confirmation-screen", "hide-screen");
}

function sendOrder() {
    toggleClass("confirmation-screen", "hide-screen");
    window.open(wppLink, "_blank");
}

function dismissOrder() {
    toggleClass("confirmation-screen", "hide-screen");
}

function atualizarTextosDoCarrinho() {
    
    let order1 = document.getElementById("order-1");
    let order2 = document.getElementById("order-2");
    let order3 = document.getElementById("order-3");
    let total = document.getElementById("order-total");

    let orders = [order1, order2, order3];

    for (let section in orders) {
        //console.log(section)
        orders[section].children[0].innerHTML = cardapio[section][carrinho[section]][0];
        orders[section].children[1].innerHTML = precoEmBRL(cardapio[section][carrinho[section]][1]);
        
    }

    total.children[1].innerHTML = precoEmBRL(valorDoCarrinho);

}

function precoEmBRL (valor) {
    return (valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })
}

function gerarLinkDeWpp () {
    /*
    Olá, gostaria de fazer o pedido:
    - Prato: Frango Yin Yang
    - Bebida: Coquinha Gelada
    - Sobremesa: Pudim
    Total: R$ 27.70

    Nome: Fulano
    Endereço: Rua...
    */

    let nome = "-"
    let endereco = "-"

    nome = prompt("Qual é o seu nome?");
    endereco = prompt("Qual é o seu endereço?");

    let texto = "Olá, gostaria de fazer o pedido:\n"
    texto += "- Prato: " + cardapio[0][carrinho[0]][0] + "\n";
    texto += "- Bebida: " + cardapio[1][carrinho[1]][0] + "\n";
    texto += "- Sobremesa: " + cardapio[2][carrinho[2]][0] + "\n";
    texto += "Total: R$ " + valorDoCarrinho.toFixed(2) + "\n\n";
    texto += "Nome: " + nome + "\n";
    texto += "Endereço: " + endereco;

    
    let encodedText = encodeURIComponent(texto);
    const number = "5521984554820";
    let link = "https://wa.me/" + number + "?text=" + encodedText

    console.log(link);

    return link;
}