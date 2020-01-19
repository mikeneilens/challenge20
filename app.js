class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(otherPosition) {
        return new Position(this.x + otherPosition.x, this.y + otherPosition.y )
    } 
}

const moveNorth = new Position(0,-1);
const moveSouth = new Position(0,1);
const moveWest = new Position(-1,0);
const moveEast = new Position(1,0);

const fixture = "*";
const openspace = " ";
const newLine = "\n";

const contentAt = (mapData, position) => {
  
    if (position.x < 0 || position.y < 0) return fixture

    const rows = mapData.split(newLine);
    if (position.y >= rows.length) return fixture;

    const rowData = rows[position.y];
    if (position.x >= rowData.length) return fixture;

    return rowData.charAt(position.x);
}

class Orientation {
    constructor(value) {
      this.value = value;
    }
    get ahead() {
      switch(this.value) {
        case "E": return moveEast;
        case "W": return moveWest;
        case "N": return moveNorth;
        case "S": return moveSouth;
      }
    }
    get left() {
      switch(this.value) {
        case "E": return moveNorth;
        case "W": return moveSouth;
        case "N": return moveWest;
        case "S": return moveEast;
      }
    }
    get right() {
      switch(this.value) {
        case "E": return moveSouth;
        case "W": return moveNorth;
        case "N": return moveEast;
        case "S": return moveWest;
      }
    }
    get turnLeft() {
      switch(this.value) {
        case "E": return new Orientation("N");
        case "W": return new Orientation("S");
        case "N": return new Orientation("W");
        case "S": return new Orientation("E");
      }
    }
    get turnRight() {
      switch(this.value) {
        case "E": return new Orientation("S");
        case "W": return new Orientation("N");
        case "N": return new Orientation("E");
        case "S": return new Orientation("W");
      }
    }
}

const viewAheadAt = (mapData, position, orientation) => {
    let newPosition = position;
    let result = [];
    while ( contentAt(mapData, newPosition.plus(orientation.ahead)) != fixture ) {
        newPosition  = newPosition.plus(orientation.ahead);
        var stringForPosition = "O";
        if (contentAt(mapData, newPosition.plus(orientation.left)) == openspace) stringForPosition += "L";
        if (contentAt(mapData, newPosition.plus(orientation.right)) == openspace) stringForPosition += "R";
        result.push(stringForPosition);
    }
    return result;
}

const startingPosition = (mapData) => {
    const rows = mapData.split(newLine);
    for (let y = 0; y < rows.length; y++) {
      const row = rows[y];
      for (let x = 0; x < row.length; x++) {
        if (row.charAt(x) == openspace) return new Position(x,y);
      }  
    } 
} 

class Trolley {
    constructor(position,orientation) {
        this.position = position;
        this.orientation = orientation;
    }
    get positionAhead() {
      return this.position.plus(this.orientation.ahead);
    }
    move() {
      return new Trolley(this.positionAhead,this.orientation);
    }
    rotateLeft() {
      return new Trolley(this.position, this.orientation.turnLeft);
    }
    rotateRight() {
      return new Trolley(this.position, this.orientation.turnRight)
    }
    viewAhead(mapData) {
      return viewAheadAt(mapData, this.position, this.orientation);
    }
    moveOrRotate(command,mapData) {
      switch(command) {
        case "M": if (contentAt(mapData, this.positionAhead) != fixture) {
          return this.move();
        } else {
          return this;
        }
        case "L": return this.rotateLeft();
        case "R": return this.rotateRight();
      }
    }
    encode() {
      const string = this.position.x.toString() + "," + this.position.y.toString() + "," + this.orientation.value;
      let buff = new Buffer.from(string);
      return buff.toString('base64');
    }
    refernceIdandViewAhead(mapData) {
        let output = this.encode();
        for (const element of this.viewAhead(mapData)) {
          output = output + "," + element;
        } 
        return output;
    }
}

const trolleyFrom = (referenceId) => {
      const buff = new Buffer.from(referenceId, 'base64');
      const decoded =  buff.toString('ascii');
      const parts = decoded.split(",");
      return new Trolley(new Position(Number(parts[0]),Number(parts[1])), new Orientation(parts[2])  );
}

const map = "*******" + newLine + "**    *" + newLine + "** ** *";

const getInitialTrolley = () => {
  const trolley = new Trolley(startingPosition(map),new Orientation("E"));
  return trolley.viewAheadAndReferenceId(map);
}

const moveTrolley = (command, referenceId, map) => {
    const trolley = trolleyFrom(referenceId);
    const movedTrolley = trolley.moveOrRotate(command, map);
    return movedTrolley.viewAheadAndReferenceId(map);
}

module.exports = {getInitialTrolley, moveTrolley};