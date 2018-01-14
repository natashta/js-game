'use strict';
'use strict';
class Vector {
  constructor (x=0, y=0) {
    this.x = x;
    this.y = y;
}
plus(vector) {
  if(!(vector instanceof Vector)) {
    throw Error ('Можно прибавлять к вектору только вектор типа Vector');
  }
  return new Vector (this.x + vector.x, this.y + vector.y);
}
times(q) {
  return new Vector (this.x*q, this.y*q);
}
}

/*
const start = new Vector(30, 50);
const moveTo = new Vector(5, 10);
const finish = start.plus(moveTo.times(2));

console.log(`Исходное расположение: ${start.x}:${start.y}`);
console.log(`Текущее расположение: ${finish.x}:${finish.y}`);
*/

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
  if (!(moveObj instanceof Actor) || (!moveObj)) {
    throw new Error(`Объект должен быть объектом типа Actor ${moveObj}`);
} 
  if (this === moveObj) return false;
  if (moveObj.size.x < 0 || moveObj.size.y < 0) {
			return false;
	}
  if ((moveObj.left >= this.right) || (moveObj.top >= this.bottom) || (moveObj.right <= this.left) || (moveObj.bottom <= this.top)) {
      return false;
  } else {return true;
  }
}
}

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
  if (!moveObj) {
    throw new Error('Отсутствуют аргументы');
} 
  for(let object of this.actors){
			if (typeof object !='undefined' && moveObj.isIntersect(object)){
				return object;
			}
		}
		return undefined;	
}

obstacleAt(pos, size) {
  
  if((!(pos instanceof Vector)) || (!(size instanceof Vector))) {
    throw Error('Аргументы не являются объектом типа Vector');
  }
  
  var leftSide = Math.floor(pos.x);
  var rightSide = Math.ceil(pos.x + size.x);
  var topSide = Math.floor(pos.y);
  var bottomSide = Math.ceil(pos.y + size.y);
  if((leftSide < 0) || (rightSide > this.width) || (topSide > this.height)) {
    return 'wall';
  } else if(bottomSide < 0) {
    return 'lava';
  } 
  for (let y = topSide; y < bottomSide; y++) {
          for (let x = leftSide; x < rightSide; x++) {
              var objType = this.grid[y][x];
              if (objType) {
                return objType;
            } else return undefined;
        }
    }
}

removeActor(moveObj) {
  if(this.actors.includes(moveObj)) {
    let actorIndex = this.actors.indexOf(moveObj);
    this.actors.splice(actorIndex, 1);
  }
}

noMoreActors(type) {
  if(this.actors){
			for(const actor of this.actors){
				if(actor.type === type){
					return false;
				}
			}
		}
		return true;
}

playerTouched(type, moveObj) {
   if (this.status === null) {
    if((type === 'lava') || (type === 'fireball')) {
      this.status = 'lost';
      return this.status;
    }
    else if(type === 'coin') 
  {
      this.removeActor(moveObj);
      if(this.noMoreActors(moveObj)) {
         this.status = 'won';
      }
    }
  }
}
}
