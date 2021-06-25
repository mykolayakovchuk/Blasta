'use strict';

var canvas = document.getElementById('gamewindow'); 
var c = canvas.getContext('2d'); 
//c.fillStyle = "red"; 
//c.fillRect(100,100,400,300);
//var assets = new Image();   // Создаёт новый элемент изображения
//var assets = document.getElementById("assets");
//c.drawImage(assets, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
//c.drawImage(assets, 0, 0, 100, 100, 0, 0, 100, 100);
//c.drawImage(assets,0,0);

// Создаем объект изображения
var assets = new Image();

// Привязываем функцию к событию onload
// Это указывает браузеру, что делать, когда изображение загружено
assets.onload = function() {
	c.drawImage(assets, 180, 510, 170, 170, 0, 0, 50, 50);//голубой 1
    c.drawImage(assets, 350, 510, 170, 170, 50, 0, 50, 50);//фиолетовый 2
    c.drawImage(assets, 520, 510, 170, 170, 100, 0, 50, 50);//красный 3
    c.drawImage(assets, 690, 510, 170, 170, 150, 0, 50, 50);//жёлтый 4
    c.drawImage(assets, 860, 510, 170, 170, 200, 0, 50, 50);//зелёный 5

    var Mod = new Model();
    console.log (Mod);
    var InitialView = new View(assets);
    InitialView.createView(Mod)
};

// Загружаем файл изображения
assets.src = "tilesource.jpg";

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
}

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
        for (let elementName in Model.Board){
            //var ctx = document.getElementById('gamewindow').getContext('2d');
            let element = Model.Board[elementName];
            this.ctx.drawImage(this.assets, this.tileTypesFromAsset[element.type], 510, 170, 170, this.convertCoordinatesPixel(element.x), this.convertCoordinatesPixel(element.y), 50, 50);
            console.log (element);
        }
    }

}


