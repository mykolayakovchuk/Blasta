'use strict';
//console.log(Object.keys(x).length)
//скрипт Пола Ириша для кроссбраузерности
// setTimeout в качестве запасного варианта
window.requestAnimFrame = (function(){ 
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){ 
              window.setTimeout(callback, 1000 / 60); 
            }; 
  })();

// Создаем объект изображения
var assets = new Image();
//Создание глобальной переменной, впоследствии хранящей информацию о модели
var globalModel;
//ОСНОВНОЙ ЦИКЛ ИГРЫ
function mainCycle(elementCoordinate){
    var x = elementCoordinate[0];
    var y = elementCoordinate[1];
    console.log(x+";"+y+"type"+globalModel.getElementType(elementCoordinate));
    var elementCoordinateArray = globalModel.elementCoordinateToArray(elementCoordinate);
    var SameTypeElementArray = globalModel.findSameTypeElementArray(elementCoordinateArray);
    if (SameTypeElementArray === false){
        return;
    }
    var MainView = new View(assets);
    for (var elementCoordinate of SameTypeElementArray){
        MainView.hideTiles(globalModel, elementCoordinate);
        globalModel.setElementType(elementCoordinate, 0);
    }
    
    var ZeroTypeElements = globalModel.findZeroTypeElements();
    var elementsAboveZero = globalModel.findElementAboveZero(globalModel, ZeroTypeElements);
    while (Object.keys(elementsAboveZero).length > 0){
        //пока есть элементы над пустыми клетками, они будут двигаться по одной клетке вниз
        //пока не останеться элементов над пустыми тайлами(клетками)
        //тут есть "баг" с анимацией
        MainView.moveTilesDown(globalModel, elementsAboveZero);
        globalModel.moveElementsDown(elementsAboveZero);
        elementsAboveZero = globalModel.findElementAboveZero(globalModel, globalModel.findZeroTypeElements());
    }
    
    var ZeroTypeElementsToFill = globalModel.findZeroTypeElementsArray();
    console.log(ZeroTypeElementsToFill);
    for (var elementCoordinate of ZeroTypeElementsToFill){
        globalModel.setElementType(elementCoordinate, globalModel.getRandomColor());
        MainView.appearTile(globalModel, elementCoordinate);
    }
    MainView.createView(globalModel);
}
// Привязываем функцию генерации стартовой доски к событию onload (чтобы загрузилась графика игры)
// 
assets.onload = function() {
	//c.drawImage(assets, 180, 510, 170, 170, 0, 0, 50, 50);//голубой 1
    //c.drawImage(assets, 350, 510, 170, 170, 50, 0, 50, 50);//фиолетовый 2
    //c.drawImage(assets, 520, 510, 170, 170, 100, 0, 50, 50);//красный 3
    //c.drawImage(assets, 690, 510, 170, 170, 150, 0, 50, 50);//жёлтый 4
    //c.drawImage(assets, 860, 510, 170, 170, 200, 0, 50, 50);//зелёный 5

    var Mod = new Model();
    globalModel = Mod;
    console.log (Mod);
    var InitialView = new View(assets);
    InitialView.createView(Mod);
    var GameController = new Controller ();
};

// Загружаем файл изображения (графика для игры)
assets.src = "tilesource.jpg";
/**
 * 
 */
class Model {
    //при старте модель (игровая доска) случайным образом заполняется элементами
    //также в модель добавляются оставшиеся ходы и ноль очков
    constructor (){
        this.Board = new Object ();
        for (var y = 1; y < 12; y++){
            for (var x = 1; x < 10; x++){
                this.Board['element('+x+'_'+y+')']={x : x , y : y, type : this.getRandomColor() }
            }
        }
        this.remainingMoves = 20;
        this.score = 0;
    }

    
    //функция получения случайного числа от 1 до 5
    getRandomColor(){
        var min = Math.ceil(1);
        var max = Math.floor(5);
        return Math.floor(Math.random() * (max - min + 1)) + min; 
    }

    consoleLogModel(){
        //console.log (this);
    }

    setElementType(elementCoordinate, value){
        this.Board['element('+elementCoordinate[0]+'_'+elementCoordinate[1]+')'].type = value;
    }

    getElementType(elementCoordinate){
        if(elementCoordinate[0]>= 1 && elementCoordinate[0] <= 9 && elementCoordinate[1]>= 1 && elementCoordinate[1] <= 11){
            return this.Board['element('+elementCoordinate[0]+'_'+elementCoordinate[1]+')'].type;
        }else{
            return "undefined";
        }
    }

    getElement(elementCoordinate){
        if(elementCoordinate[0]>= 1 && elementCoordinate[0] <= 9 && elementCoordinate[1]>= 1 && elementCoordinate[1] <= 11){
            return this.Board['element('+elementCoordinate[0]+'_'+elementCoordinate[1]+')'];
        }else{
            return "undefined";
        }
        
    }

    elementCoordinateToArray(elementCoordinate){
        var elementCoordinateArray = [];
        elementCoordinateArray.push(elementCoordinate);
        return elementCoordinateArray;
    }

    //функция находит в модели пустые тайлы
    //возвращает объект  с параметрами этих тайлов
    findZeroTypeElements(){
        var Result = Object();
        for (let elementName in this.Board){
            if (this.Board[elementName].type === 0){
                Result[elementName] = this.Board[elementName];
            }
        }
    return Result;    
    }

    //input Object
    //функция находит в модели пустые тайлы
    //возвращает массив массивов с параметрами этих тайлов((х, у), (х, у),(х, у)...)
    //return Array
    findZeroTypeElementsArray(){
        var input = this.findZeroTypeElements();
        var result = [];
        for (let elementName in input){
            result.push([input[elementName].x, input[elementName].y]);
        }
    return result;    
    }

    //input Array (массив с одним элементом -- массивом с координатами тайла на котором щёлкнул пользователь)
    //функция находит рядом с тайлом на котором щёлкнул пользователь
    //тайлы того же цвета
    //return Array| false (массив с координатами тайлов одинакового (выбранного) цвета) ИЛИ "ЛОЖЬ"
    findSameTypeElementArray(elementCoordinateArray){
        var primaryLength = elementCoordinateArray.length;
        var searchedType = this.getElementType(elementCoordinateArray[0]);
            for (var element of elementCoordinateArray){
                var searchArea = [[element[0]-1, element[1]], [element[0]+1, element[1]],
                                [element[0], element[1]-1], [element[0], element[1]+1]];

                for (var neighboringElement of searchArea){
                    if (this.getElementType(neighboringElement) == searchedType
                        && this.checkEntry (elementCoordinateArray, neighboringElement) == false){
                        elementCoordinateArray.push (neighboringElement);
                    }
                }
            }
   
        if (elementCoordinateArray.length < 2){
            return false;
        }else if(primaryLength < elementCoordinateArray.length){
            return this.findSameTypeElementArray(elementCoordinateArray);
        }else if (primaryLength == elementCoordinateArray.length){
            return elementCoordinateArray;
        }
    }

    //проверка вхождения элемента массива (вида [number, number]) в общий массив
    // вида [[number, number], [number, number], [number, number] ....]
    //@return true | false
    checkEntry (array, element){
        for (var value of array){
            if(element[0] === value[0] && element[1] === value[1]){
                return true;
            } 
        }
    return false;    
    }

    //функция находит все тайлы НАД пустыми тайлами (кроме пустых тайлов и undefined)
    //input Object (объект состоящий из выборки из модели элементов с типом 0 (т.е. пустых))
    //return 
    //@return Array (массив с координатами вида [[number, number], [number, number], [number, number] ....])
    findElementAboveZero(ModelFull, ZeroTypeElements){
        var elementsAboveZeroArray = [];
        var Board = ModelFull.Board;
        for (var element in ZeroTypeElements){
            var currentX = ZeroTypeElements[element].x;
            var currentY = ZeroTypeElements[element].y;
            var aboveElementCoordinate = [ currentX, (currentY-1)];
            if (this.getElementType(aboveElementCoordinate) === 0 || this.getElementType(aboveElementCoordinate) === "undefined"){
                continue;
            }
            for ( var y = currentY; y > 0; y=y-1){
                var elementName ='element('+currentX+'_'+y+')';
                if (Board[elementName].type != 0 && Board[elementName].type !== "undefined"){
                    elementsAboveZeroArray.push([Board[elementName].x, Board[elementName].y])
                }
            }
        }
        return elementsAboveZeroArray;
    }

    //функция перемещения значения(type) тайла на одну клетку вниз
    //input Array (х, у) (массив с координатами перемещаемого элемента)
    moveElementDown (elementCoordinate){
        var elementType = this.getElementType(elementCoordinate);
        var elementCoordinateUnder = [elementCoordinate[0], (elementCoordinate[1]+1)]
        this.setElementType(elementCoordinateUnder, elementType);
        this.setElementType(elementCoordinate, 0);
    }

    //функция перемещения значения группы тайлов на одну клетку вниз
    //!перемещаются только те тайлы, у которых внизу пустая клетка (тип тайла === 0)
    //input Array ((х, у), (х, у),(х, у)...) (массив массивов с координатами перемещаемого элемента)
    moveElementsDown (elementCoordinateArray){

        for (var elementCoordinate of elementCoordinateArray){
            let elementCoordinateUnder = [elementCoordinate[0], (elementCoordinate[1]+1)]
            if (this.getElementType(elementCoordinateUnder) === 0){
                this.moveElementDown (elementCoordinate);
            }else{
                continue;
            }    
        }
        //рекусивный повтор, если есть пустые клетки
        if (this.functionCheckZeroUnnderElements(elementCoordinateArray) === true){
            this.moveElementsDown (elementCoordinateArray);
        }else{
            return;
        }
    }

    //функция проверяет массив тайлов на наличие хотя бы одного пустого тайла под ними
    functionCheckZeroUnnderElements(elementCoordinateArray){
        for (var elementCoordinate of elementCoordinateArray){
            let elementCoordinateUnder = [elementCoordinate[0], (elementCoordinate[1]+1)];
            if (this.getElementType(elementCoordinateUnder) === 0){
                return true;
            }
        } 
        return false;
    }
}
/**
 * 
 */
class View{

    constructor (assets){
        //константа.Указыает координаты х из исходного изображения
        this.tileTypesFromAsset = [0, 180, 350, 520, 690, 860];
        //константа.Указыает исходное изображение с графикой для игры
        this.assets = assets;
        this.ctx = document.getElementById('gamewindow').getContext('2d');
    }

    getCanvas(){
        return document.getElementById('gamewindow').getContext('2d');
    }

    convertCoordinatesPixel(elementCoordinate){
        let pixelCoordinate = (elementCoordinate * 50)-50;
        return pixelCoordinate;
    }

    createView(Model){
        this.ctx.clearRect(0, 0, 800, 1000); 
        for (let elementName in Model.Board){
            let element = Model.Board[elementName];
            if (element.type === 0){
                this.ctx.fillStyle = "black";
                this.ctx.fillRect(this.convertCoordinatesPixel(element.x), this.convertCoordinatesPixel(element.y), 50, 50);
            }else{
                this.ctx.drawImage(this.assets, this.tileTypesFromAsset[element.type], 510, 170, 170, this.convertCoordinatesPixel(element.x), this.convertCoordinatesPixel(element.y), 50, 50);
            }
        }
    }

    //функция создаёт анимацию исчезновения тайлов с доски
    hideTiles(Model, elementCoordinate){
        var x = this.convertCoordinatesPixel(elementCoordinate[0]);
        var y = this.convertCoordinatesPixel(elementCoordinate[1]);
        var Element = Model.Board["element("+elementCoordinate[0]+"_"+elementCoordinate[1]+")"];
        if (Element.type == 0){
            return;
        };
        this.ctx.fillStyle = "black";
        let ctx = this.ctx;
        let assets = this.assets;
        let tileType = this.tileTypesFromAsset[Element.type];
        let counter = 0;
        
        function draw(){
            if (counter > 23){
                ctx.fillRect(x, y, 50, 50);
                return;
            }
        window.requestAnimFrame(draw); 
        ctx.fillRect(x, y, 50, 50);
        ctx.drawImage(assets, tileType, 510, 170, 170, x+counter, y+counter, 50-(counter*2), 50-(counter*2));
        counter = counter + 1;
        }
        window.requestAnimFrame(draw);
        return;
    }

    //функция анимации перемещения одного тайла на одну клетку вниз и верхнего тайла на его место
    //input Model, Array (х, у) (массив с координатами перемещаемого элемента)
    moveTileDown (Model, elementCoordinate){
        var x = this.convertCoordinatesPixel(elementCoordinate[0]);
        var y = this.convertCoordinatesPixel(elementCoordinate[1]);
        var Element = Model.Board["element("+elementCoordinate[0]+"_"+elementCoordinate[1]+")"];
        if (elementCoordinate[1] != 1){
            var ElementAbove = Model.Board["element("+elementCoordinate[0]+"_"+(elementCoordinate[1]-1)+")"];
        }else{
            var ElementAbove = Object();
            ElementAbove.type = 0;
        }
        this.ctx.fillStyle = "black";
        let ctx = this.ctx;
        let assets = this.assets;
        let tileType = this.tileTypesFromAsset[Element.type];
        let tileTypeAbove = this.tileTypesFromAsset[ElementAbove.type];
        let counter = 0;
        function draw(){
            if (counter > 50){
                return;
            }
        window.requestAnimFrame(draw); 
        //ctx.fillRect(x, y, 50, 50);
        if (tileTypeAbove === 0){
            ctx.fillRect(x, y-50+counter, 50, 50);
        }else{
            ctx.drawImage(assets, tileTypeAbove, 510, 170, 170, x, y-50+counter, 50, 50);    
        }
        ctx.drawImage(assets, tileType, 510, 170, 170, x, y+counter, 50, 50);
        counter = counter + 2;
        }
        window.requestAnimFrame(draw);
        return;
    }

    //функция анимации перемещения группы тайлов на одну клетку вниз (см. также функцию moveTileDown)
    //input Model, Array ((х, у), (х, у),(х, у)...) (массив массивов с координатами перемещаемого элемента)
    moveTilesDown (Model, elementCoordinateArray){
        for (var elementCoordinate of elementCoordinateArray){
            this.moveTileDown (Model, elementCoordinate);
        }
    }

    //функция создаёт анимацию появления тайлов на доске
    appearTile(Model, elementCoordinate){
        var x = this.convertCoordinatesPixel(elementCoordinate[0]);
        var y = this.convertCoordinatesPixel(elementCoordinate[1]);
        var Element = Model.Board["element("+elementCoordinate[0]+"_"+elementCoordinate[1]+")"];
        //if (Element.type == 0){
        //    return;
        //};
        this.ctx.fillStyle = "black";
        let ctx = this.ctx;
        let assets = this.assets;
        let tileType = this.tileTypesFromAsset[Element.type];
        let counter = 23;
        window.requestAnimFrame(draw);
        function draw(){
            if (counter < 2){
                ctx.drawImage(assets, tileType, 510, 170, 170, x, y, 50, 50);
                return;
            }
        window.requestAnimFrame(draw); 
        ctx.fillRect(x, y, 50, 50);
        ctx.drawImage(assets, tileType, 510, 170, 170, x+counter, y+counter, 50-(counter*2), 50-(counter*2));
        counter = counter - 1;
        }
        
        return;
    }

}
/**
 * 
 * 
 */
class Controller{

    constructor (){
        this.canvas = document.getElementById('gamewindow');
        this.canvas.addEventListener('mouseup', this.runGameIteration.bind(this));
    }
    //Функция возвращает массив [x, y], где x и y координаты щелчка на игровом поле в пикселах
    controllerClickPixelCoordinates(e){
        return this.getCursorPosition(this.canvas, e);
    }
    //функция вносит поправку на смещение элемента с игровым окном
    //относительно верхнего левого угла браузера
    getCursorPosition(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return [x, y];
    }
    //функция определяет по координатам щелчка элемент игровой доски, на котором произошёл щелчок
    //и запускает основной игровой цикл
    runGameIteration(e){
        var CursorPosition = this.controllerClickPixelCoordinates(e);
        if (CursorPosition[0] < 450 && CursorPosition[1] < 550){
            var elementCoordinate = [Math.floor(CursorPosition[0]/50)+1, Math.floor(CursorPosition[1]/50)+1];
            mainCycle(elementCoordinate, Model);
        }else{
            return;
        }
    }
}


