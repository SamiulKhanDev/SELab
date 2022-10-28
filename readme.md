The Architecture of this system has three major fields.
1)SuperUser - This user can create new admin for the system.
2)Admin - created by SuperUser has ability to Add or delete any book in the database.
3)User - students who wants to get or return books.

End points
For SuperUser
1) /superuser/:id
For a new Admin to sign up in the system, they need to have a unique id generated by a SuperUser. Whenever someone hits the end point with proper SuperUser id as variable paremeters they will get back a unique identifcation String Now this unique identification String can be given to the "would be" Admin by the college ,so they can complete there sign up. Validation for a SuperUser will be done through a middleware called validateSuperUser.js. Where it will try to find the SuperUser which has a superUserId:id in the superusers collections in the db. If found validation successfull , otherwise invalid authentication error will be provided.In case the genarated String is already present in the db associated with another Admin, it will return status 500.In the front-end using INTERCEPTORS we can relaunch the req until we get a unique string.

SuperUser model Structure
const superUserSchema = new mongoose.Schema(
  {
    superUserId: { type: String, requird: true },
  },
  {
    timestamps: true,
  }
);

Every SuperUser has a superUserId of type String and which is required. Along side the superUSerID, the timestapms of document creation and updation will be store in the db.

For Admin
1)/admin/signup
With the Unique Identification String provided by the college(SuperUser) , they also need to give some additional information about themselves. Along with the information a new Admin doument will be created inside admins collections in the database. And the registration will be completed.
The password provided will be enrypted using NODE.JS internal module called CRYPTO.
The encrypted password is stored in the db.

Admin model Structure
const adminSchema = new mongoose.Schema({
  name: { type: String, requird: true },
  uniqueId: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

every filed is of type String and they all are required. The uniqueId is the id provided by the superUser.

2)/admin/signin
If a already signed up admin wants to sign in , they need to provide the email along the password.
If validation is done,the admin will be provided with ACCESSTOKEN and REFRESHTOKEN in a cookie.
Whenever the admin will do some adminly stuff his ACCESSTOKEN will be verified, and the token
has a time to live filed of 24hrs ,so every 24hrs the token will be expired and now 2 things can be done
from the frontend. That is after receiving 401 from the backend again using a INTERCEPTOR and relaunch
the req to refresh the accesstoken using the refreshtoken or you can logout the user , so they can sign in again.
The cookie itself has a time to live of 30 days. To refresh the accesstoken the i already have given couple of function at the backend but corresponding routes are not made yet, if the requirement ask for that,we can add the routes, otherwise it might make the crwler heavy and an decrese in performance.

2)/admin/addbook
If a Admin wants to addbook to the books collections in the db, first the accesstoken for the admin will be verified.
If the requested user a admin then the req will be forwared to correspoing handler.
Where the book with all the information will be uploded to the books collection.

Book model Structure
const BookModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  bookId: {
    type: String,
    required: true,
  },
  authors: {
    type: [String],
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  genre: {
    type: [String],
    required: true,
  },
});

bookId is a filed that is not required by the admin to provide,but it will be genareated at the backend.
authors is a array of type String as there can be multiple authors of a single book.
count is the number of the same  book admin wants too add.
genre is a type of string array, a book can belong to multiple genre so array is required.

3)/admin/deletebook
similer to addbook but here you will be able to delete the entire set of a particuler book or some number of it.
4)/admin/returnbook
When ever a user returns a book to the reception,admin can initialze this route with bookId and userId.
So in books collections to this bookId books a book will be added but increseing the count.
And using the userId field the user will be removed from the list of users who have taken a book.

BookThatAreTakenModel model structure
const BookThatAreTakenModel = new mongoose.Schema({
  bookId: {
    type: String,
    required: true,
  },
  userIDValue: {
    type: String,
    required: true,
  },
});


so the the db there is a collection called BookThatAreTakenModels where when ever a user gets a book a new documents will be generated thet this user with userIdValue has taken a book with bookId.
After returning the book ,the count of the book will be incresed and this document will be removed from the bookthataretakens collection.

5)/admin/logout

If it is a valid admin, upon hiting this end point corresponding accesstoken and refreshtoken will be deleted.
So now to do all the above tasks now admin needs to sign in again.


For User

1)Similer /user/signup and /usersignin routes are impleted for the user as well

UserModel model structure
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userIDValue: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  book1: { type: String, required: false, default: null },
  book2: { type: String, required: false, default: null },
  book3: { type: String, required: false, default: null },
});
Every user can have at most three books with them, no user can have multiple copy of the same book

2)Similer /user/logout routes also added.



Routes that are not added to this iterations are

/admin/userswithbook

Upon hiting this api end point admin will be validated,and if found true then a list of JSON will provided about all the users who have taken a book from the library

/books
to get the list of all the books that are present in the library

This backend can be connedted with any frontend ,be it react ,vue or anguler js or normal html css js based.
But in the frontend we also need to use some provate routing technique along with global context handler 
to store the infromation of the user or admin. Technologies such as redux toolkit can be a great help here.
But if the choise of frontend is react the react-context combining with useReducer hook can simulate the redux toolkit.

Along side we also need to understnd the CROSS ORIGIN RESOUCE SHARING policy , as both the front end and backend will run of diffrenret PORTS. At backend w can use then cors middile where with origin set to "*"

The entire testing has been done using postman.


Tools and Technologies that are been used

JAVASCRIPT
NODE JS(JS RUNTIME BASED ON CHROME V8 ENGINE)
EXPRESS JS(NODE'S EXTERNAL MODULE TO BUILT HTTP BASED SERVERS,AND TO HANDLE ROUTES)
JSONWEBTOKEN(ANOTHER NODE'S EXTERNAL MODULE TO CREATE THE ACCESSTOKEN AND REFRESHTOKEN FOR BOTH USER AND ADMIN)
BODY-PARSER(ANOTHER NODE'S EXTERNAL MODULE/MIDDLEWARE TO PARSE JSON BASED REQ BODY)
COOKIE-PARSER(ANOTHER NODE'S EXTERNAL MODULE/MIDDLEWARE TO PARSE VALUES IN THE COOKIE)
MONGOOSE(THIS IS A ODM USED FOR MONGODB DATABSE,AND ALSO IT USES MONGOCLIENT DRIVER TO CONNECT WITH THE  MONGODB DATABASE)
MONGODB(A DOCUMENT ORIENTED DATABASE THAT EXCEPTS JSON DATA STORES THEM AS BINARY JSON(BSON) AND RELEASES THEM AS EXTENDED JSON(EJSON),THIS NOSQL DATABASE ALSO SUPPORTS ACID PROPERTIES AND HIGHLY OPTIMIZED TO WORK WITH NODE BASED APPLICATION)

NODEMON(A DEV DEPENDENCY TO AUTOMATICALLY START THE SERVER UPON UPDATING THE CODE)
DOTENV(TO STORE THE PRIVATE KEYS THE PRIVATE ENVIROMENT SO UPON UPLODING THE CODES , SECURITY DOESN'T GETS COMPROMISED)


