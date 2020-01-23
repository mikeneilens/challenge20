# challenge20

This is a webservice which reveals a route through a maze.`
If you call it using a GET with no query params it will return a commma separated list. The first item in the list is a referenceid. Other items in the list show you what is in each position ahead of you, starting with the space closest to you.

+ O means there is an empty space you can move into.

+ OL means there is an empty space with an empty space to the left of it.

+ OR means there is an empty space with an empty space to the right of it.

+ OLR means there is an empty space with empty spaces to the left and right of it.

+ there is also an X instead of an O which represents the end of the maze.

e.g. on your first call to the webservice you may have `abcded,O,OL,OR,O` returned. This means the referenceid is abcded and you have 4 spaces ahead of you. At the second space you could move left and at the thirds space you coud turn right.

If only a referenceid is returned you cannot move forward as you are up against a wall.

You may call the webservice with these query parms to move around the maze.

+ `command=<command>` where `<command>` is either M (to move forward), L (to rotate 90 degrees left) or R (to rotate 90 degrees right).

+ `referenceid=<referenceid>` where the `<referenceid>` is the value returned the last time you called the service.

+ `repeat=<repeat>` where `<repeat>` is an integer between 1 and 50 used to repeat the command. This is an optional query parm with a default of 1.

If you try to move forward when you are up against a wall you won't move. If you enter an invalid referenceid you will return to the start of the maze.  

A sample request could be: https://challenge20.appspot.com/?command=M&referenceid=MTEsOCxF&repeat=2

This would attempt to move you 2 positions forward in whatever direction you are facing and return a new referenceid and the view ahead from your new position. n.b. this may return the start of the maze if you try it as the referenceid may not be correct or it may not move you forward if you are facing a wall.

The challenge is to determine the requests needed to arrive at the end of the maze.

For example, suppose the maze looks like this (`*` are walls and `.` are open space):
