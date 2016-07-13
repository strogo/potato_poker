============
Potato Poker
2015-06-03
Uppsala University
Course: User Interface Design II

By:
Staffan
Max
Sverrir
Elif
============

===========
Description
===========
A texas hold'em poker server written in Erlang that communicates
with the client web browser through TCP. The web server that handles 
the communication between the browser and the Erlang server is
written in Nodejs.

===============
Run the program
===============
Run the erlang Poker server by going to /assets/logic
>erl
>server:start().
The server will start running on port 3547

Run app.js in nodejs
>nodejs app.js
The webserver will start running on port 8080 by default

Reset the server by writing "reset" in the chat/console in the web browser