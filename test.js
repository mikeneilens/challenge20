
var assert = require('assert');
const { contentAt, Position, Orientation, Trolley, viewAheadAt, getInitialTrolley, moveTrolley} = require("./app.js");

describe('contentAt', function(){
    it('should return a fixture for any position out of bounds', function(){
        const mapOfShop = ' ';
        assert.equal('*', contentAt(mapOfShop, new Position(-1,0)));
        assert.equal('*', contentAt(mapOfShop, new Position(+1,0)));
        assert.equal('*', contentAt(mapOfShop, new Position(+0,+1)));
        assert.equal('*', contentAt(mapOfShop, new Position(+0,-1)));
        assert.equal(' ', contentAt(mapOfShop, new Position(0,0)));
    });
    it('should return a fixture for any stars on the map and an open space for any spaces on the map', function(){
        const mapOfShop =  
            "***\n"
         +  "* *\n" 
         +  "  *\n"
        assert.equal('*', contentAt(mapOfShop, new Position(0, 0)));
        assert.equal('*', contentAt(mapOfShop, new Position(1, 0)));
        assert.equal('*', contentAt(mapOfShop, new Position(2, 0)));
        assert.equal('*', contentAt(mapOfShop, new Position(0, 1)));
        assert.equal('*', contentAt(mapOfShop, new Position(2, 1)));
        assert.equal('*', contentAt(mapOfShop, new Position(2, 2)));

        assert.equal(' ', contentAt(mapOfShop, new Position(1, 1)));
        assert.equal(' ', contentAt(mapOfShop, new Position(0, 2)));
        assert.equal(' ', contentAt(mapOfShop, new Position(1, 2)));
    })
});

describe('Trolley viewAhead', function() {
    it('should return empty array if map is one character',function() {
        const mapOfShop = ".";
        const trolley = new Trolley(new Position(0,0) ,new Orientation('E'));
        assert.deepEqual( [], trolley.viewAhead(mapOfShop));
    });
    it('shoud return one "O" if map is two characters and trolley is facing towards a space from any direction',function() {
        const eastTrolley = new Trolley(new Position(0,0),new Orientation('E'));
        const westTrolley = new Trolley(new Position(1,0),new Orientation('W'));
        const southTrolley = new Trolley(new Position(0,0),new Orientation('S'));
        const northTrolley = new Trolley(new Position(0,1),new Orientation('N'));
        assert.deepEqual(['O'], eastTrolley.viewAhead('..'));
        assert.deepEqual(['O'], westTrolley.viewAhead('..'));
        assert.deepEqual(['O'], southTrolley.viewAhead("..\n" + ".*"));
        assert.deepEqual(['O'], northTrolley.viewAhead(".*\n" + "..")  );
    })
    it('should return more than one "O" if trolley is facing into a dead end corridor of more than one space',function() {
        const mapOfShop =   "*.*\n" +
                            "*.*\n" +
                            "*.*\n" +
                            "*.*\n";
        const trolley = new Trolley(new Position(1,0) ,new Orientation('S'));
        assert.deepEqual( ['O','O','O'], trolley.viewAhead(mapOfShop));
    });
    it('should return a left turn if there is a left turn',function() {
        const mapOfShop =   "*.*\n" +
                            "*.*\n" +
                            "*..\n" +
                            "*.*\n";
        const trolley = new Trolley(new Position(1,0) ,new Orientation('S'));
        assert.deepEqual( ['O','OL','O'], trolley.viewAhead(mapOfShop));
    });
    it('should return a right turn if there is a right turn',function() {
        const mapOfShop =   "*.*\n" +
                            "*.*\n" +
                            "..*\n" +
                            "*.*\n";
        const trolley = new Trolley(new Position(1,0) ,new Orientation('S'));
        assert.deepEqual( ['O','OR','O'], trolley.viewAhead(mapOfShop));
    });
    it('should return a left and right turn if there is both',function() {
        const mapOfShop =   "*.*\n" +
                            "*..\n" +
                            "..*\n" +
                            "*.*\n";
        const trolley = new Trolley(new Position(1,0) ,new Orientation('S'));
        assert.deepEqual( ['OL','OR','O'], trolley.viewAhead(mapOfShop));
    });
    it('should return a left and right turn and cross roads if there all three',function() {
        const mapOfShop =   "*.*\n" +
                            "*..\n" +
                            "..*\n" +
                            "...\n";
        const trolley = new Trolley(new Position(1,0) ,new Orientation('S'));
        assert.deepEqual( ['OL','OR','OLR'], trolley.viewAhead(mapOfShop));
    });


});

describe('viewAheadAt(mapData,position,orientation)', function() {
    it('shoud return one "O" if map is two characters is facing towards a space from any direction',function() {
        assert.deepEqual(['O'], viewAheadAt( '..' , new Position(0,0), new Orientation('E')));
        assert.deepEqual(['O'], viewAheadAt('..', new Position(1,0),new Orientation('W')));
        assert.deepEqual(['O'], viewAheadAt("..\n" + ".*", new Position(0,0),new Orientation('S')));
        assert.deepEqual(['O'], viewAheadAt(".*\n" + "..", new Position(0,1),new Orientation('N'))  );
    });   
});

describe('Trolley.moveOrRotate()', function() {
    it('create a trolley in the same position as the original if its way ahead is blocked by a fixture',function() {
        const originalTrolley = new Trolley(new Position(0,0), new Orientation('E'));
        const mapData = ".*";
        const newTrolley =  originalTrolley.moveOrRotate('M',mapData);
        assert.equal(originalTrolley.position, newTrolley.position);
    }); 
    it('craete a trolley facing North if the original trolley facing East is rotated left',function() {
        const originalTrolley = new Trolley(new Position(0,0), new Orientation('E'));
        const mapData = ".*";
        const newTrolley =  originalTrolley.moveOrRotate('L',mapData);
        assert.deepEqual(new Orientation('N'), newTrolley.orientation);
    });   
    it('create a trolley in a new position and a view that is one space shorter than before if the trolley can be moved',function() {
        var originalOutput  = getInitialTrolley().split(",");
        const referenceId = originalOutput[0];
        const outputAfterMove = moveTrolley('M', referenceId).split(",");
        assert.equal(1, originalOutput.length - outputAfterMove.length)
    });   
});

