## Dota2 Stats

The project was a part of the course CSCE 608 .
The project was primarily a Database Design project and the database have been normalised to Boyce–Codd normal form.

Project Description
===================

The GitHub repo for this web application is https://github.com/stjiao13/Dota2Stats and the URL is https://mighty-badlands-64864.herokuapp.com/ .

Background
----------

Dota 2 is a well known multiplayer online battle arena (MOBA) video game developed and published by Valve Corporation. A typical dota 2 match is played between two teams of five players, with each team occupying and defending their own separate base on the map. For each player, they control a powerful character, known as a “hero”. During a match, players may collect experience points and items to increase the power of their hero and a team will win if it first destroys the opponents’ base.

Noteworthy, a large amount of data will be generated during a dota 2 match. Therefore, data analysis for those data becomes increasingly important for players to increase their skill and also for determining if a balance update is needed. Luckily we have perfect access to these data. The detailed process of collecting data will be discussed in next section but considering this fact, it occurs to me that it would be great if we could have a website that shows recent high-level matches.

Functions and services of my application
----------------------------------------

### Displaying all matches

All of the matches in our web application is listed in a page. User could find many interesting statistics of a match such as duration,tower state, barrack state and match result. Besides, users could also sort matches based on all the column titles, which help user quickly find the match that they are interested in. Further, the matches table serve as an entry point as users would navigate to other tables form matches table.

### Displaying players profile in a match

Like I have mentioned above, user can check players profile in a match from matches table, which is very intuitive and user-friendly. These profile includes hero name, play slot (indicate the side of a player in a match),gold, gold per minute and etc. Likewise users could also sort players based on these profile. With this information users could know more about the game and easily judge the performance of any player. Moreover, the purchase log of any player in this match is also available for user through this table.

### Displaying purchase log of a player in a given match

Also, user may be curious about how a player spend his gold in a game so the purchase log is provided which consist of the name of an item and the time of purchase. This is a very useful function because this data is very important but hard to find from Dota 2 client(You need view the entire replay to find that).

### Displaying teamfights in a match

Besides, teamfights in a match is also available for user. Users could find the start and end time as well as deaths in any given teamfights. If a user wants watch the replay, he could quickly locate the period for teamfights.

### Leave comment for a match

Users after viewing so many information mentioned above may want to leave a comment and luckily our website provides such application. Users could as well edit or delete a comment.

Data Collection
===============

Data Source
-----------

All of the data used in this project comes from Opendota, which is a volunteer-developed, open source platform providing Dota 2 data. Some of the data they provide is from the Steam WebAPI and some is from replay parsing of .dem files, which costs more time than the former.

Devin from Kaggle has collected a dataset containing 50000 ranked ladder matches from OpenDota. Considering the capacity of database i am using, only a small fraction of the dataset are used in my project. But it is surely effortless to import more matches into my project.

Data Preprocessing
------------------

Firstly, the initial dataset 19 different tables and not many of them are suitable for my web application. For example, ’ablility\_upgrade.csv’ contains information about the ability a player choose once level up. As the maximum of level is 25 and a match has 10 players, we could expect one match have 250 corresponding entries.But usually one kind of hero has only few choices of choosing ability and thus it is meaningless to store ability upgrades with so many spaces. Another example is ’chat.csv’, which is chat content per match. It does not have many unique contents (bacause chat is usually simple commands) and does not contribute much to match outcomes.

Then as a result, we have 6 datasets for our web application. ’matches.csv’ contains top level information about each match. ’players.csv’ contains totals for kills, deaths, denies, etc and player action count is also included in this dataset.’teamfights.csv’ contains start and end time as well as result for every teamfights in a match. ’purchase\_log.csv’ lists every item a player has purchased in a single match and this is the largest dataset in out program. ’item\_name.csv’ and ’hero\_name.csv’ are simply for transferring ids of item and hero to their actual name.

Lastly, the raw dataset contains some invalid data like duplicated ones and those are aslo excluded in the preprocessing step.

Entity Relationship Diagram
===========================

I created the entity relationship diagram (E-R diagram) using DbSchema. The E-R diagram is shown below and I will discuss later about each table in the diagram

<img src="erd2.png" alt="Entity Relationship Diagram" style="width:100.0%" />

Matches
-------

The matches table records many key statistics of a match and it has a primary key ’match\_id’, which is also foreign key in tables players, purchase\_log, comments and teamfights.

Players
-------

The players table in fact set one tuple for ever player in every match. So ’account\_id’ along is not a primary key. The primary key here used is (’match\_id,player\_slot’). For clarification, a dota 2 match has 10 players and ’player\_slot’ indicates which slot a player is in. Another way of selecting primary key is (’match\_id,account\_id’). Theoretically, this would also work but in fact we have anonymous players in a match and the ’account\_id’ is set to 0 for them. As a result, in a match there may be more than one players with ’account\_id’ 0. And this is part of the reason why ’player\_slot’ is very important. The ’match\_id’ is also a foreign key referring to matches table.

Besides, item and hero name are represented as separate id in players table so that ’item\_0 - item\_5’ and ’hero\_id’ is also foreign key referring to item\_id and hero\_name table. We will discuss more in later corresponding part.

Purchase\_log
-------------

The purchase\_log table contains record for one player in a match. It stores the time and ’item\_id’. Because a player could buy multiple items at same time, the primary key here are all four attributes(match\_id, player slot, time and item\_id). Besides, match\_id and player slot is also a foreign key referring to players table.

Teamfights
----------

The teamfights table contains record for every teamfight in a match. Its primary key is ’match\_id’ and ’start\_time’. ’match\_id’ and ’end\_time’ is also a key. Even ’match\_ id’ and ’last\_death\_time’ could form a key. But we select the first one as primary key because it is more natural. Its foreign key is also ’match\_id’ referring to matches table.

Hero\_name
----------

The hero\_name table simply describes mapping between hero\_id and the localized name. Its primary is simply ’hero\_id’. And the ’hero\_id ’ attribute in players table is a foreign key referring to this table.

Item\_id
--------

The item\_id table , like hero\_name table, is a mapping between item\_id and item name. Its primary is simply ’id’. And any attribute from ’item\_0,...,item\_5 ’ in players table is also a foreign key referring to this table.

Comments
--------

The comments table stores records of every comment. The primary key is ’id’ and also ’match\_id’ is a foreign key referring to the matches table.

Table Normalization
===================

The table normalization process does not change the structure of the table. Boyce-Codd normal form means that the left side of any non-trivial FD must contain a key. The reasons for why these tables are in Boyce-Codd normal form are given below:

Matches
-------

We could easily observe that the left side of any FDs must contain ’match\_id’.

Players
-------

Although players contains many attributes, all of the FDs have left side which is ’match\_id’ and ’player\_slot’.

Purchase\_log
-------------

Because the primary key of purchase\_log is all four attributes, BCNF condition is automatically met.

Teamfights
----------

Apparently the left side of FDs could not only contain ’death’, so this is in BCNF.

Comment
-------

Also it is easy to see that the FDs in comments are *i**d* → *o**t**h**e**r* *a**t**t**r**i**b**u**t**e**s*.

Item\_id and hero\_name
-----------------------

Any two-attribute relation is in BCNF so these two tables are in BCNF.

User Interface
==============

Tools and Framework
-------------------

### Backend - Node.js

Node.js is a widely used javascript based backend framework and it includes many helpful modules for developing. The modules I used are:

1.  body-parser. This module is for making the body of incoming requests possible.

2.  ejs. Known as embedded javascript templates, ejs is used as template engine for generating dynamic pages in my application.

3.  node-postgres. This is a collection of node.js modules for interfacing with PostgreSQL database.

### Development Environment - Cloud 9

I developed the web application through the IDE provided by Cloud 9, which is also a wide used cloud IDE.

### Frontend - Express

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

### Deployment - Heroku

Along with making development on Cloud 9, I deploy my web application on Heroku. I also used Heroku addon Heroku postgre as my PostgreSQl database.

Interface
---------

### Landing Page

This is the home page of my web application and users could see how many records have been stored in this website. By clicking ’Begin by browsing recent matches’, user could enter the matches page.

<img src="landing.png" alt="[fig:fig1]Landing page of Dota2 Stats" style="width:100.0%" />

### Matches Page

In the matches page, recent dota2 matches are shown in table as shown below:

<img src="matches.png" alt="[fig:fig2]Matches page of Dota2 Stats" style="width:100.0%" />

By clicking the title of each column title, user may see the record in ascending or descending order like shown below:

<img src="matches_sort_byDuration.png" alt="[fig:fig3]Matches page in ascending order of duration" style="width:100.0%" />

<img src="matches_sort_byDuration2.png" alt="[fig:fig4]Matches page in descending order of duration" style="width:100.0%" />

Besides, user may see the details of a specific match in the show page by clicking the match id.

### Show page

The first table in the show page lists statistics about 10 players in this game. Also users could sort the data based on column titles as shown below:

<img src="show.png" alt="[fig:fig5]Show page of player statistics" style="width:100.0%" />

<img src="show_gold_sorted.png" alt="[fig:fig6]Show page of player statistics sorted by gold" style="width:100.0%" />

Moreover, by clicking the account id of any player, users can view the purchase log of this player in this match as shown below:

<img src="purchase.png" alt="[fig:fig7]Show page of player statistics sorted by gold" style="width:100.0%" />

The other table that users will see in this page is the table for teamfights statistics and users will also be able to sort this table based on column title in ascending or descending order.

<img src="teeamfight.png" alt="[fig:fig8]Show page of player statistics" style="width:100.0%" />

Users may leave a comment for this match at the end of page by clicking ’Add New Comment’ like shown below:

<img src="add_comment2.png" alt="[fig:fig9]Comment section in show page" style="width:100.0%" />

<img src="comment_add.png" alt="[fig:fig10]Add new comment page" style="width:100.0%" />

After leaving a comment, users will be automatically directed to the original show page and see the comment he just submitted.

<img src="comment1.png" alt="[fig:fig11]Add new comment page" style="width:100.0%" />

Users may also delete or edit a comment by clicking the corresponding button. Users will be directed to an edit page if edit button is clicked as shown below:

<img src="edit.png" alt="[fig:fig12]Edit page for an existing comment" style="width:100.0%" />

Once the edit is completed, users will also be redirected to the previous show page.

Project Source Code
===================

SQL script as DDL
-----------------

The way I use SQL script as DDL is as following:

First, create related tables. The CLI command is

    $ psql -h MYHOST  -p MYPORT -d MYDATABASE -U MYUSERNAME -f SQLSCRIPT

Then,import data from csv file use ’copy’ command. The CLI command for this step is

    $ PGPASSWORD=PWHERE psql -h HOSTHERE -U USERHERE DBNAMEHERE -c "\copy my_things FROM 'my_data.csv' WITH CSV;"

And a sample of such SQL script is like :

    DROP TABLE IF EXISTS comments
    CREATE TABLE comments
    (
      id serial NOT NULL,
      match_id serial NOT NULL,
      content text,
      author character varying(50),
      PRIMARY KEY (id),
      CONSTRAINT constraint_fk1 FOREIGN KEY (match_id) REFERENCES matches(match_id)
    )

You could also refer to

     /dota2stat/model/seed_step.txt

for more details.

SQL script as DML
-----------------

All the SQL query executed in my application is defined in app.js and its code will be pasted below. You could see that most of them are INSERT, UPDATE, DELETE,COUNT and WHERE clause.

Discussion
==========

Data collection
---------------

The data collection step is rather easy and the only challenge is to read though the document figuring the meaning of each attributes and deciding which to include;

Database Design
---------------

The original dataset are already in BCNF so I do not need to do table normalization. At first I was not very familiar with definition of primary key and foreign key and I made some mistakes. For example, I did not realize that ’match\_id’ and ’player\_slot’ is also a foreign key referring to players table. And i am pretty sure the current table structure is far from perfect. As I have more experience and dive deeper in database design I am sure that I am able to design a much better structure.

Seeding the database
--------------------

This should be a rather easy step as PostgreSQL has a very good support for importing csv file using copy command. But I actually I have met much challenges and the main reason for that is heroku postgre does not give me permission for using copy command. I have also found that many users met the same problem and the only solution I have found is using direct psql command rather than an script in command line.

Connecting to database
----------------------

I connect my web application to heroku postgre database using node-postgre. At first, the connection is done in a callback way and in the case of multiples queries the nested callback function is hard to read and maintain. This problem is also known as ’callback hell’. Node-postgre offers two other ways instead of callback function, the first is promise and the other is async/await. I choose promise because promise is easier and maintain.

Another issue I face is connection pooling. This is strongly recommended for web applications that make frequent queries, like ours. The reason for connection pooling is such:

1.  Greatly reducing the time cost by frequent queries.

2.  PostgreSQL server may crash if there are an unbounded number of connections

3.  PostgreSQL can only process one query at a time on a single connected client in a first-in first-out manner.

And luckily node-postgres has built-in connection pooling via the pg-pool module.

References
==========

1.  Dota 2. (2018, October 07). Retrieved from https://en.wikipedia.org/wiki/Dota\_2

2.  Dota 2 Matches. (n.d.). Retrieved from https://www.kaggle.com/devinanzelmo/dota-2-matches/home

3.  B. (2018, October 03). Brianc/node-postgres. Retrieved from https://github.com/brianc/node-postgres


