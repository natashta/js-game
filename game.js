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
    this.player = this.actors.find(actor => actor.type == 'player');
    
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
  } else return false;
}

actorAt(moveObj) {
  if (!(moveObj instanceof Actor)) {
    throw new Error(`Объект должен быть объектом типа Actor`);
} 
  if (!moveObj) {
    throw new Error(`Отсутствуют аргументы`);
} 
  for(let object of this.actors){
			if (moveObj.isIntersect(object)){
				return object;
			}
		}
		return undefined;	
}

obstacleAt(pos, size) {
    if((!(pos instanceof Vector)) || (!(size instanceof Vector))) {
    throw new Error(`Аргументы не являются объектом типа Vector`);
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
			for(let actor of this.actors){
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
    if(type === 'coin') 
  {
      this.removeActor(moveObj);
      if(this.noMoreActors('coin')) {
         this.status = 'won';
      }
    }
   }
}
}
//работает

class LevelParser {
  constructor (list) {
    this.list = list;
  }
    
actorFromSymbol(symbol) {
  if(symbol === undefined) {
    return undefined;
  }
  return this.list[symbol];
}

obstacleFromSymbol(symbol) {
  switch (symbol) {
    case 'x':
      return 'wall';
    case '!':
      return 'lava';
    default:
      return undefined;
    }
}

createGrid(arrOfString) {
    let arr = [];
    for (let row of arrOfString) {
      const newRow = [];
      for (let cell of row) {
        newRow.push(this.obstacleFromSymbol(cell));
      }
      arr.push(newRow);
    }
    return arr;
  }

createActors(arrOfString) {
		let arrMove = [];
		arrOfString.forEach((row, y) => {
		  for (let x in row) {
		  	let Field = this.list[row[x]];
				let obj = Object(Field);
				if(obj === Actor) {
					arrMove.push(new Field(new Vector(x, y)));
				}
			}
		});
		return arrMove;
	}

parse(arrOfString) {
  const grid = this.createGrid(arrOfString);
  const objects = this.createActors(arrOfString);
  return new Level(grid, objects);
}
}
// работает, не трогай

class Fireball extends Actor{
	constructor(pos = new Vector(0,0), speed = new Vector(0,0)){
	 	super(pos, new Vector(1,1), speed);
}

get type() {
        return 'fireball';
}
   
getNextPosition(time = 1) {
  return new Vector (this.pos.x + this.speed.x * time, this.pos.y + this.speed.y * time);
}

handleObstacle() {
  this.speed = new Vector(-1*this.speed.x, -1*this.speed.y);
}

act(time, level) {
  if(level.obstacleAt(this.newPos, this.size)) {
    this.handleObstacle();
  } else {
    this.pos = this.getNextPosition(time);
  }
}	
}


class HorizontalFireball extends Fireball {
  constructor (pos) {
    super (pos, new Vector(2, 0));
  }
}

class VerticalFireball extends Fireball {
  constructor (pos) {
    super (pos, new Vector(0, 2));
  }
}

class FireRain extends Fireball {
  constructor (pos) {
    super (pos, new Vector(1,1), new Vector(0,3));
  }
}

class Coin extends Actor {
  constructor (pos = new Vector()) {
    super (pos.plus(new Vector(0.2, 0.1)), new Vector(0.6, 0.6));
    
      this.springSpeed = 8;
      this.springDist = 0.07;
      this.spring = Math.random() * 2 * Math.PI;
  }
  
get type() {
    return 'coin';
}   
  
updateSpring(time = 1) {
  this.spring += this.springSpeed * time;
}

getSpringVector() {
  return new Vector(0, Math.sin(this.spring) * this.springDist);
}

getNextPosition(time = 1) {
  this.updateSpring(time);
  return this.pos.plus(this.getSpringVector());
}

act(time) {
  this.pos = this.getNextPosition(time);
}
}

class Player extends Actor {
    constructor(pos = new Vector()) {
      super(pos.plus(new Vector(0, -0.5)), new Vector(0.8, 1.5), new Vector(0,0));
    }
    
get type() {
    return 'player';
  }    
}
