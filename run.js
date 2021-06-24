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
	c.drawImage(assets, 180, 510, 170, 160, 0, 0, 50, 50);//голубой 1
    c.drawImage(assets, 350, 510, 170, 160, 50, 0, 50, 50);//фиолетовый 2
    c.drawImage(assets, 520, 510, 170, 160, 100, 0, 50, 50);//красный 3
    c.drawImage(assets, 690, 510, 170, 160, 150, 0, 50, 50);//жёлтый 4
    c.drawImage(assets, 860, 510, 170, 160, 200, 0, 50, 50);//зелёный 5
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

var Mod = new Model();
console.log (Mod);
