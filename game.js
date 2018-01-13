'use strict';

class Vector {
  constructor (x=0, y=0) {
    this.x = x;
    this.y = y;
}
plus(vector) {
  if(!(vector instanceof Vector)) {
    throw new Error ('Можно прибавлять к вектору только вектор типа Vector');
  }
  return new Vector (this.x + vector.x, this.y + vector.y);
}
times(q) {
  return new Vector (this.x * q, this.y * q);
}
}
//Проверила, работет

class Actor {
  constructor (pos = new Vector(0,0), size = new Vector(1,1), speed = new Vector(0,0)) {
    if ((!(pos instanceof Vector)) || (!(size instanceof Vector)) || (!(speed instanceof Vector))){
      throw new Error('Параметр должен быть объектом типа Vector');
    } 
    this.pos = pos;
    this.size = size;
    this.speed = speed;
    Object.defineProperty(this, 'type', {
      writable: false,
      value: 'actor'
      });
}

act () {
}

get left() {
  return this.pos.x;
}
get top() {
  return this.pos.y;
}
get right() {
  return this.pos.x + this.size.x;
}
get bottom() {
  return this.pos.y + this.size.y;
}

isIntersect(moveObj) {
  if (!(moveObj instanceof Actor)) {
    throw new Error('Объект должен быть объектом типа Actor');
} 
  if (moveObj === undefined) return false;
  if (moveObj === this) return false;
  if ((moveObj.left >= this.right) || (moveObj.top >= this.bottom) || (moveObj.right <= this.left) || (moveObj.bottom <= this.top)) {return false;
  } else {return true;
  }
}
}
//Проверила, работает

class Level {
  constructor (grid = [], actors= []) {
    this.grid = grid;
    this.actors = actors;
    Object.defineProperty(this, 'type', {
      value: 'player'
      });
    this.height = this.grid.length;
    this.width = Math.max(...this.grid.map(function (el) {
return el.length;
}));
    this.status = null;
    this.finishDelay = 1;
  }

isFinished() {
  if((this.status !== null) && (this.finishDelay < 0)) {
    return true;
  } return false;
}

actorAt(moveObj) {
  if (!(moveObj instanceof Actor)) {
    throw new Error('Объект должен быть объектом типа Actor');
} 
  if (moveObj === undefined) {
    throw new Error('Отсутствуют аргументы');
} 
  if (moveObj.isIntersect()===true) return Actor;
  return undefined;
}

obstacleAt(newPos, size) {
  //Не поняла, что надо передать первым аргументом
  if((!(newPos instanceof Vector)) || (!(size instanceof Vector))) {
    throw new Error('Аргументы не являются объектом типа Vector');
  }
  //здесь надо думать, как обозначить границы объекта. И что-то здесь не работает. А, надо же все препятствия на поле возвращать
  
  var leftSide = Math.floor(newPos.x);
  var rightSide = Math.ceil(newPos.x + size.x);
  var topSide = Math.floor(newPos.y);
  var bottomSide = Math.ceil(newPos.y + size.y);
  if((leftSide < 0) || (rightSide > this.width) || (topSide > this.height)) {
    return 'wall';
  } else if(bottomSide < 0) {
    return 'lava';
  } else return undefined;
}

removeActor(moveObj) {
  if(this.actors.includes(moveObj)) {
    let actorIndex = this.actors.indexOf(moveObj);
    this.actors.splice(actorIndex, 1);
  }
}

noMoreActors(moveObj) {
  if(moveObj.type !== 'actor') {
    return true;
  } return false;
}

playerTouched(type, moveObj) {
  if (this.status !== null) {
    if((type === 'lava') || (type === 'fireball')) {
      this.status = 'lost';
      return this.status;
    }
    else if((type === 'coin') && (moveObj instanceof Coin)) // второе условие ?
  {
      this.removeActor(moveObj);
      if(this.noMoreActors(moveObj)) {
        this.status = 'won';
      }
    }
  }
}
}
