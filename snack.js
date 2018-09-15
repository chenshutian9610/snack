"use strict"

//  设置活动范围
var table=document.querySelector('table');
var top_max=calculate(table.getAttribute('height'),'A');
var left_max=calculate(table.width,'A');
var snack,food;
var body=document.getElementById('new');
var button_on=document.getElementById('on');
var button_stop=document.getElementById('stop');
var speed=document.getElementById('speed');
console.log(speed.options[speed.selectedIndex].value);
reset();

//  贪婪蛇重置
function reset(){
    stop();
    var tag = document.getElementsByClassName("snack");
    snack = Array.prototype.slice.call(tag);
    for (var i = 0; i < snack.length; i++) {
        snack[i].style.left = calculate(10 * i);
        snack[i].style.top = '10px';
    }
    snack.reverse();
    snack[0].style.color='blue';
    direction=char='D';
    throw_food();
    body.remove();  
    body=document.createElement('div');
    body.id='new';
    document.querySelector('td').insertBefore(body,food);
    button_on.disabled=false;
    button_stop.disabled=false;
}

//  抛出食物
function throw_food(){
    food=document.getElementById('food');
    food.style.left=10*Math.round(40*Math.random())+'px';
    food.style.top=10*Math.round(30*Math.random())+'px';
    for(var i=0;i<snack.length;i++){
        if(snack[i].style.left==food.style.left&&snack[i].style.top==food.style.top){
            throw_food();
            break;
        }
    }
}

//  计算下一次的坐标
function calculate(position, char) {
    var num;
    if (char == 'W' || char == 'A') num = parseInt(position) - 10;
    else num = parseInt(position) + 10;
    return num + 'px';
}

//  前进
function proceed(last) {
    var temp = {left: '',top: ''};
    var left,top;
    for (var i = 0; i < snack.length; i++) {
        if (i == 0) {
            temp.left = snack[i].style.left;
            temp.top = snack[i].style.top;
            if (direction == 'W'||direction=='S')
                snack[0].style.top = calculate(snack[i].style.top, direction);
            else
                snack[0].style.left = calculate(snack[i].style.left, direction);
        } else {
            if(i==snack.length-1){
                last.left=snack[i].style.left;
                last.top=snack[i].style.top;
            }
            top = snack[i].style.top;
            left = snack[i].style.left;
            snack[i].style.top = temp.top;
            snack[i].style.left = temp.left;
            temp.left = left;
            temp.top = top;
        }
    }
}

//  键盘命令与前进方向初始化
var char = 'D';
var direction = 'D';
//  获取键盘命令
function input(event) {
    char = String.fromCharCode(event.which);
    var num=event.which;
    switch(num){
        case 37:char='A';break;
        case 38:char='W';break;
        case 39:char='D';break;
        case 40:char='S';break;
    }
    if (char != 'W' && char != 'S' && char != 'D' && char != 'A')
        char = direction;
    else if (((char == 'W' || char == 'S') && (direction != 'W' && direction != 'S')) ||
            ((char == 'A' || char == 'D') && (direction != 'A' && direction != 'D')))
        direction=char;


    // document.querySelector('#p').innerHTML = num;    //  debug 专用
}

//  开始与暂停的键
var key;
//  开始
function on() {
    var last={left: '',top: ''};
    //  前进
    proceed(last);
    //  吃食物
    if(snack[0].style.left==food.style.left&&snack[0].style.top==food.style.top){
        var element=document.createElement('snack');
        element.innerHTML='*';
        element.style.left=last.left;
        element.style.top=last.top;
        element.className='new';
        body.appendChild(element);
        snack[snack.length]=element;
        throw_food();
    }
    //  判断是否碰到了自己
    var stop=false;
    for(var i=4;i<snack.length;i++){
        if(snack[i].style.left==snack[0].style.left&&snack[i].style.top==snack[0].style.top){
            snack[0].style.color='red';
            stop=true;
            break;
        }
    }
    //  是否碰到墙壁
    if(snack[0].style.left=='-10px'||snack[0].style.left==left_max||snack[0].style.top=='-10px'||snack[0].style.top==top_max){
        snack[0].style.color='red';
        stop=true;
    }
    if(stop==false)
        key = setTimeout(on, speed.options[speed.selectedIndex].value);
    else{
        button_on.disabled=true;
        button_stop.disabled=true;
    }
}
//  暂停
function stop() {
    clearTimeout(key);
}