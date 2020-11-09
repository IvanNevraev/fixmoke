document.addEventListener("DOMContentLoaded", main);
function main(){
	$("#tableFromGoogle").load("https://docs.google.com/spreadsheets/d/e/2PACX-1vRmP30349cShyWF3HJO1eDZglE7Rs8N4l6m3k4ANpCyudHyoQK9FTBaya3AxpKmkTHT9wLy0sR-nryQ/pubhtml?gid=0&single=true table",setCatalog);
	$("#newOrder").click(onClickNewOrder);
	basket_update();
	basket_init();
	basket_max_init();
}
function setCatalog(){
	let catalog = {};
	let key1 = "";
	let key2 = "";
	for(let i=0; i<$("#tableFromGoogle table")[0].rows.length; i++){
		let row = $("#tableFromGoogle table")[0].rows;
		if(i==0){
			continue;
		}
		if($(row[i].childNodes[1]).text().length!=0){
				catalog[$(row[i].childNodes[1]).text()] = {};
				key1 = $(row[i].childNodes[1]).text();
		}
		if($(row[i].childNodes[2]).text().length!=0){
				catalog[key1][$(row[i].childNodes[2]).text()] = {};
				key2 = $(row[i].childNodes[2]).text();
		}
		catalog[key1][key2][$(row[i].childNodes[3]).text()] = $(row[i].childNodes[4]).text();
		
	}
	let i = 1;
	for(let level1 in catalog){
		let amountProducts = 0;
		for(let level2 in catalog[level1]){
			for(let product in catalog[level1][level2]){
				amountProducts++;
			}
		}
		let sectionLevel1 = $("#exempleSectionLevel1Wrap").clone();
		sectionLevel1.attr("id",i+"sectionLevel1")
		sectionLevel1.children("p").children(".nameSectionLevel1").text(level1);
		sectionLevel1.children("p").children(".amountPosition").text(getTitleProduct(amountProducts));
		$("#catalog").append(sectionLevel1);
		sectionLevel1.children("svg").click(onClickSectionLevel1);
		i++;
		let k = 1;
		for(let level2 in catalog[level1]){
			let sectionLevel2 = $("#exempleSectionLevel2Wrap").clone();
			sectionLevel2.attr("id",i+"_"+k+"sectionLevel2");
			sectionLevel2.attr("parent_div",sectionLevel1.attr("id"));
			sectionLevel2.children(".nameSectionLevel2").text(level2);
			sectionLevel1.after(sectionLevel2);
			sectionLevel2.css("display","none");
			sectionLevel2.children("svg").click(onClickSectionLevel2);
			k++;
			let j = 1;
			for(let nameProduct in catalog[level1][level2]){
				let product = $("#exempleSectionProductUnselect").clone();
				product.attr("id",i+"_"+k+"_"+j+"product");
				product.attr("parent_div",sectionLevel2.attr("id"));
				product.children(".nameProduct").text(nameProduct);
				product.children(".controlProduct").children(".priceProduct").text(catalog[level1][level2][nameProduct]);
				sectionLevel2.after(product);
				product.children(".controlProduct").children("svg").click(onClickAddProduct);
				product.css("display","none");
				j++;
			}
		}
	}
	console.log(catalog);
}
function onClickSectionLevel1(){
	let id = $(this).parent().attr("id");
	let arrayChildren = document.getElementById("catalog").childNodes;
	if($(this).parent().hasClass("wrapLevel1")){
		//We should unwrap content
		$(this).parent().removeClass("wrapLevel1");
		$(this).parent().addClass("unwrapLevel1");
		$(this).html($("#exempleSectionLevel1Unwrap").children("svg").html());
		for(let item of arrayChildren){
			if($(item).attr("parent_div")==id){
				$(item).css("display","flex");
			}
		}
	}else{
		$(this).parent().removeClass("unwrapLevel1");
		$(this).parent().addClass("wrapLevel1");
		$(this).html($("#exempleSectionLevel1Wrap").children("svg").html());
		for(let item of arrayChildren){
			if($(item).attr("parent_div")==id){  
				$(item).removeClass("unwrapLevel2");
				$(item).addClass("wrapLevel2");
				$(item).children("svg").html($("#exempleSectionLevel2Wrap").children("svg").html());
				$(item).css("display","none");
				for(let i of arrayChildren){
					if($(i).attr("parent_div")==$(item).attr("id")){
						$(i).css("display","none");
					}
				}
			}
		}
	}
}
function onClickSectionLevel2(){
	let id = $(this).parent().attr("id");
	let arrayChildren = document.getElementById("catalog").childNodes;
	if($(this).parent().hasClass("wrapLevel2")){
		//We should unwrap content
		$(this).parent().removeClass("wrapLevel2");
		$(this).parent().addClass("unwrapLevel2");
		$(this).html($("#exempleSectionLevel2Unwrap").children("svg").html());
		for(let item of arrayChildren){
			if($(item).attr("parent_div")==id){
				$(item).css("display","flex");
			}
		}
	}else{
		$(this).parent().removeClass("unwrapLevel2");
		$(this).parent().addClass("wrapLevel2");
		$(this).html($("#exempleSectionLevel2Wrap").children("svg").html());
		for(let item of arrayChildren){
			if($(item).attr("parent_div")==id){
				$(item).css("display","none");
			}
		}
	}
}
function onClickAddProduct(){
	let product = $(this).parent().parent();
	$(this).remove();
	product.children(".controlProduct").append("<div class='selectAmountProduct'><p>1</p></div>");
	basket_addProduct(product.children(".nameProduct").text(), parseInt(product.children(".controlProduct").children(".priceProduct").text(),10));
}
function getTitleProduct(amountPropucts){
	if(amountPropucts>=5&&amountPropucts<=20){
		return amountPropucts+" товаров";
	}else if(amountPropucts%10==1){
		return amountPropucts+" товар";
	}else if(amountPropucts%10==2||amountPropucts%10==3||amountPropucts%10==4){
		return amountPropucts+" товара";
	}else{
		return amountPropucts+" товаров";
	}
}
function onClickNewOrder(){
	basket_clear();
	let arrayChildrenCatalog = document.getElementById("catalog").childNodes;
	for(let item of arrayChildrenCatalog){
		if($(item).hasClass("product")){
			$(item).children(".controlProduct").children(".selectAmountProduct").remove();
			$(item).children(".controlProduct").children("svg").remove();
			$(item).children(".controlProduct").append("<svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'>");
			$(item).children(".controlProduct").children("svg").html($("#exempleSectionProductUnselect").children(".controlProduct").children("svg").html());
			$(item).children(".controlProduct").children("svg").click(onClickAddProduct);
		}
	}
}
//-----This is basket block-----
function basket_init(){
	$(".basket").children(".basket__button_viewContent").click(basket_viewListProducts);
	$(".basket").children(".basket__button_hideContent").click(basket_hideListProducts);
}
function basket_max_init(){
	$(".basket-max__listProducts_removeProduct").click(basket_max_removeItemList);
}
function basket_viewListProducts(){
	$(".basket-max").removeClass("basket-max_hidden");
	$(".basket-max").addClass("basket-max_viewContent");
	$(".basket__button_hideContent").removeClass("basket__button_hidden");
	$(".basket__button_viewContent").addClass("basket__button_hidden");
	basket_max_updateList();
}
function basket_hideListProducts(){
	$(".basket-max").removeClass("basket-max_viewContent");
	$(".basket-max").addClass("basket-max_hidden");
	$(".basket__button_viewContent").removeClass("basket__button_hidden");
	$(".basket__button_hideContent").addClass("basket__button_hidden");
}
function basket_addProduct(nameProduct="unkown",priceProduct=0){
	let basketSize = 0;
	if($.cookie("basket_basketSize")==null){
		$.cookie("basket_basketSize","1");
		basketSize = 1;
	}else{
		basketSize = +$.cookie("basket_basketSize");
		basketSize++;
		$.cookie("basket_basketSize", basketSize+"");
	}
	basket_addTotal(priceProduct);
	basket_addAmountPosition();
	$.cookie("basket_nameProduct"+basketSize,nameProduct);
	$.cookie("basket_priceProduct"+basketSize,priceProduct);
	$.cookie("basket_amountProduct"+basketSize,"1");
	
}
function basket_addTotal(numb=0){ 
	let total = +$(".basket").children(".basket__text").children(".basket__text_total").text();
	total += numb;
	$(".basket").children(".basket__text").children(".basket__text_total").text(total);
}
function basket_addAmountPosition(numb=1){
	let amountPosition = +$(".basket").children(".basket__text").children(".basket__text_amountPosition").text();
	amountPosition += numb;
	$(".basket").children(".basket__text").children(".basket__text_amountPosition").text(amountPosition);
	basket_setTitleAmountPosition(amountPosition);
}
function basket_setTotal(total=0){
	$(".basket").children(".basket__text").children(".basket__text_total").text(total);
}
function basket_setAmountPosition(amountPosition=0){
	$(".basket").children(".basket__text").children(".basket__text_amountPosition").text(amountPosition);
}
function basket_setTitleAmountPosition(amountPosition){
	let title = ""
	if(amountPosition>=5&&amountPosition<=20){
		title = "товаров";
	}else if(amountPosition%10==1){
		title = "товар";
	}else if(amountPosition%10==2||amountPosition%10==3||amountPosition%10==4){
		title = "товара";
	}else{
		title = "товаров";
	}
	$(".basket").children(".basket__text").children(".basket__text_titleAmountPosition").text(title);
}
function basket_update(){
	let basketSize = 0;
	if($.cookie("basket_basketSize")!=null){
		basketSize = +$.cookie("basket_basketSize");
	}
	basket_setAmountPosition(basketSize);
	basket_setTitleAmountPosition(basketSize);
	let total = 0;
	for(let i=1; i<=basketSize; i++){
		total += +$.cookie("basket_priceProduct"+i);
	}
	basket_setTotal(total);
}
function basket_removeProduct(numberPosition){
	let basketArray = new Array();
	let basketSize = 0;
	if($.cookie("basket_basketSize")!=null){
		basketSize = +$.cookie("basket_basketSize");
	}
	for(let i=1; i<=basketSize; i++){
		let item = {};
		item.nameProduct = $.cookie("basket_nameProduct"+i);
		item.priceProduct = $.cookie("basket_priceProduct"+i);
		item.amountProduct = $.cookie("basket_amountProduct"+i);
		basketArray.push(item);
	}
	basketArray.splice(numberPosition-1,1);
	console.log(basketArray);
	basketSize--;
	$.cookie("basket_basketSize",basketSize);
	for(let i=0; i<basketArray.length; i++){
		$.cookie("basket_nameProduct"+i+1,basketArray[i].nameProduct);
		$.cookie("basket_priceProduct"+i+1,basketArray[i].priceProduct);
		$.cookie("basket_amountProduct"+i+1,basketArray[i].amountProduct);
	}
}
function basket_max_updateList(){
	$(".basket-max__listProducts_noExemple").remove();
	let basketSize = 0;
	if($.cookie("basket_basketSize")!=null){
		basketSize = +$.cookie("basket_basketSize");
	}
	for(let i=1; i<=basketSize; i++){
		let nameProduct = $.cookie("basket_nameProduct"+i);
		let priceProduct = $.cookie("basket_priceProduct"+i);
		let amountProduct = $.cookie("basket_amountProduct"+i);
		let clone  = $(".basket-max__listProducts").clone(true);
		$(clone[0]).attr("id","item"+i);
		$(clone[0]).attr("data-numberPosition",i);
		$(clone[0]).addClass("basket-max__listProducts_noExemple");
		$(clone[0]).removeClass("basket-max__listProducts_hidden");
		$(clone[0]).children(".basket-max__listProducts_nameProduct").text(nameProduct);
		$(clone[0]).children(".basket-max__listProducts_priceProduct").children("span").text(priceProduct);
		$(clone[0]).children(".basket-max__listProducts_amountProduct").text(amountProduct);
		$(clone[0]).appendTo(".basket-max");
	}
}
function basket_max_removeItemList(){
	let item = $(this).parent();
	basket_removeProduct(item.attr("data-numberPosition"));
	basket_max_updateList();
	basket_update();
}
function basket_clear(){
	$.cookie("basket_basketSize",null);
	basket_setTotal(0);
	basket_setAmountPosition(0);
	basket_setTitleAmountPosition(0);
}
//------------------------------