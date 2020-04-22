# databases-skill
Cover databases skill

To test POST, PUT and DELETE methods' work I used "curl" command line tool. This is how i did it:

1) curl -d "name=User10&email=User10%40gmail.com&password=10_User10" -X POST http://localhost:8080/users/ (for creating a user)

2) curl -X DELETE http://localhost:8080/users/10 (for deleting a user)

3) curl -X PUT -d 'name=User20&email=User20%40gmail.com&password=20_User20' http://localhost:8080/users/5 (for updating a user)
