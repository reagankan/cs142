"use strict";

/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

/*Add these 3 modules for project 7*/
// ExpressJS has a middleware layer for dealing with the session state
// ○ Stores a sessionID safely in a cookie
// ○ Store session state in a session state store
// ○ Like Rails, handles creation and fetching of session state for your request handlers
// from Sessions slide 11.
var session = require('express-session');
var bodyParser = require('body-parser');
//for photo upload
var multer = require('multer');
var processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto'); 
var fs = require("fs");

// Project 7 EC: Salted passwords
// Get salted password functions.
var cs142password = require('./cs142password.js').cs142password;
var makePasswordEntry = cs142password.makePasswordEntry;
var doesPasswordMatch = cs142password.doesPasswordMatch;

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var async = require('async');

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var express = require('express');
var app = express();

// XXX - Your submission should work without this line. Comment out or delete this line for tests and before submission!


mongoose.connect('mongodb://localhost/cs142project6', { useNewUrlParser: true, useUnifiedTopology: true });

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));

//add middleware for project 7
app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));  //for ecrypt session cookie later.
app.use(bodyParser.json());


app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

/*
    Project 7::Problem 1: get(/admin/login), a REST API called by LoginRegister component.
    /admin/login: Provides a way for the photo app's LoginRegister view to login in a user.
        - The POST request JSON-encoded body should include a property login_name (no passwords for now)
            and reply with information needed by your app for logged in user.
        - An HTTP status of 400 (Bad request) should be returned if the login failed
            (e.g. login_name is not a valid account).
        - A parameter in the request body is accessed using request.body.parameter_name.
            Note the login register handler should ensure that there exists a user
            with the given login_name. If so, it stores some information in the Express
            session where it can be checked by other request handlers that need to know
            whether a user is logged in.
 */
app.post('/admin/login', async function (request, response) {
    console.log('/admin/login called with login user: ', request.body.login_name);

    let user = await User.findOne({login_name: request.body.login_name}).exec();
    if (user === null) {
        response.status(400).send("User not found: " + request.body.login_name); //send = write/end
        return;
    }

    let userJS = JSON.parse(JSON.stringify(user));

    console.log(userJS)

    let passwordOk = doesPasswordMatch(userJS.password_digest, userJS.salt, request.body.password);
    if (!passwordOk) {
        console.log("Incorrect password for: ", request.body.login_name);
        response.status(400).send("Incorrect password for: " + request.body.login_name);
        return;
    }

    request.session.userIsLoggedIn = true; //add isLoggedIn flag to cookie.
    request.session.login_name = request.body.login_name;
    request.session.user = user;

    // delete user.login_name;
    user.save();
    // console.log("POST(/admin/login)::express session state: ", request.session);

    //here since valid login_name provided in request and password OK.
    //OK to store session state in PhotoShare component state
    //src::slide11:https://web.stanford.edu/class/cs142/lectures/StateManagement.pdf
    //
    //...so, need to respond with boolean flag userIsLoggedIn.
    response.status(200).send(JSON.stringify(user));
});
/*
Project 7::Problem 1: /admin/logout
    /admin/logout
        - A POST request with an empty body to this URL will logout the user by clearing
          the information stored in the session.
        - An HTTP status of 400 (Bad request) should be returned in the user
          is not currently logged in.
*/
app.post('/admin/logout', function (request, response) {
    // console.log('/admin/logout called with login user: ', request.session.login_name);

    if (!request.session.userIsLoggedIn) {
        let err_msg = '/admin/logout error::cannot_logout:' + request.session.login_name + " was never logged in.";
        console.log(err_msg);
        response.status(400).send(JSON.stringify(err_msg));
        return;
    }

    //save login name before session is destroyed
    let login_name = request.session.login_name;

    //destroy session
    request.session.destroy(function (err) { 
        if (err) {
            let err_msg = "/admin/logout error::cookie_destroy_failed: " + JSON.stringify(err);
            console.log(err_msg);
            response.status(500).send(err_msg);
            return;
        }
    });

    //respond with success.
    let msg = "admin/logout::success: " + login_name + " is logged out.";
    // console.log(msg);
    response.status(200).end(msg);
});

app.post("/commentsOfPhoto/:photo_id", async function(request, response) {
    /*
    /commentsOfPhoto/:photo_id
    - Add a comment to the photo whose id is photo_id.
    - The body of the POST requests should be a JSON-encoded body with a single property comment
        that contains the comment's text. The comment object created on the photo must include
        the identifier of the logged in user and the time when the comment was created.
    - Your implementation should reject any empty comments with a status of 400 (Bad request).

    Example Comment Object
    var comment13 = {
      _id: "57231f1a30e4351f4e9f4bf5",
      date_time: "2016-01-04 2:04:01",
      comment: "The tall one.",
      user: pt,
      photo_id: photo9._id
   };
    */

    if (!request.session.userIsLoggedIn) {
        let err_msg = '//commentsOfPhoto/'+ request.params.photo_id +'::cannot_get_comments:' + request.session.login_name + " was never logged in.";
        console.log(err_msg);
        response.status(400).send(err_msg);
        return;
    }

    if (request.body.comment.length === 0) {
        let err_msg = "/commentsOfPhoto/" + request.params.photo_id +"::cannot add empty comment.";
        console.log(err_msg);
        response.status(400).send(err_msg);
    }

    // get photo object
    console.log("Finding photoObj by ID", request.params.photo_id)
    let photoObj = await Photo.findById(request.params.photo_id).exec();

    if (photoObj === null) {
        console.log("Could not find photo with id", request.params.photo_id)
        return;
    }
    /**

    comment objects have the following properties:
    _id:    The ID for this comment.
    photo_id:   The ID of the photo to which this comment belongs.
    user:   The user object of the user who created the comment.
    date_time   The date and time when the comment was created.
    comment The text of the comment.


    example request.seession.user
    { _id: '5ffe2e6e978bb5e2d94f35ee',
      first_name: 'Peregrin',
      last_name: 'Took',
      location: 'Gondor',
      description:
       'Home is behind, the world ahead... And there are many paths to tread. Through shadow, to the edge of night, until the stars are all alight... Mist and shadow, cloud and shade, all shall fade... all... shall... fade... ',
      occupation: 'Thain',
      login_name: 'took',
      __v: 0 
    }

    **/

    let newComment = {
        user_id: request.session.user._id,
        photo_id: photoObj._id,
        user: {
            _id: request.session.user._id,
            first_name: request.session.user.first_name,
            last_name: request.session.user.last_name,
        },
        date_time: new Date(),
        comment: request.body.comment,
    };
    photoObj.comments.push(newComment);


    let newPhotoObj = await photoObj.save();
    if (newPhotoObj !== photoObj) {
        let err_msg = "Save Photo ERROR!!.";
        console.log(err_msg);
        response.status(500).end(err_msg);
        return;
    }

    let msg = "new msg saved";
    console.log(msg, newComment, "added by", request.session.user, "to: ", newPhotoObj);
    response.status(200).end(msg);
});

app.post("/photos/new", async function(request, response) {
    /**
    /photos/new
    - Upload a photo for the current user.
    - The body of the POST request should be the file (see hint below).
    - The uploaded files should be placed in the images directory under
        an unique name you generated.
    - The unique name, along with the creation data and logged in user id,
        should be placed in the new Photo object you create.
    - A response status of 400 should be returned if there is no file
        in the POST request. See the Hint section for help with this.
    **/
    processFormBody(request, response, function (err) {
        if (err || !request.file) {
            // XXX -  Insert error handling code here.
            response.status(500).send(JSON.stringify(err));
            return;
        }
        // request.file has the following properties of interest
        //      fieldname      - Should be 'uploadedphoto' since that is what we sent
        //      originalname:  - The name of the file the user uploaded
        //      mimetype:      - The mimetype of the image (e.g. 'image/jpeg',  'image/png')
        //      buffer:        - A node Buffer containing the contents of the file
        //      size:          - The size of the file in bytes
        console.log("/photos/new/request.file", request.file)

        // XXX - Do some validation here.
        if (request.file.size === 0) {
            let msg = "/photos/new/ error: cannot load empty file.";
            // console.log(msg);
            response.status(400).send(msg);
            return;
        }

        console.log("/photos/new/", "size validation passed:", request.file.size);

        // We need to create the file in the directory "images" under an unique name. We make
        // the original file name unique by adding a unique prefix with a timestamp.
        var timestamp = new Date().valueOf();
        var filename = 'U' +  String(timestamp) + request.file.originalname;

        console.log("/photos/new/", "filename created:", filename);


        fs.writeFile("./images/" + filename, request.file.buffer, function (err) {
          // XXX - Once you have the file written into your images directory under the name
          // filename you can create the Photo object in the database
          if (err) {
            let msg = "writing to ./images/" + filename + " failed.";
            response.status(500).send(msg);
            return;
          }


        });

        //if fs.writeFile is successful, continue to create a new PhotoObj in backend.
        /*
            var photoSchema = new mongoose.Schema({
                file_name: String, //   Name of a file containing the actual photo (in the directory project6/images).
                date_time: {type: Date, default: Date.now}, //  The date and time when the photo was added to the database
                user_id: mongoose.Schema.Types.ObjectId, // The ID of the user who created the photo.
                comments: [commentSchema] // Array of comment objects representing the comments made on this photo.
            });

            hint: https://mongoosejs.com/docs/models.html
            See: Constructing Documents section
        */
        let newMongoosePhotoObject = new Photo({
            file_name: filename,
            date_time: Date(timestamp),
            user_id: request.session.user._id,
            comments: []
        });

        newMongoosePhotoObject.save(function (err) {
            if (err) {
                let msg = "saving new Mongoose PhotoObject failed.";
                response.status(500).send(msg);
                return;
            }
            // saved!
            // send back OK response 
            let msg = "/photos/new/. New file(" + filename + ") was created!"
            response.status(200).end(msg);
        });
        
    });
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            {name: 'user', collection: User},
            {name: 'photo', collection: Photo},
            {name: 'schemaInfo', collection: SchemaInfo}
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.countDocuments({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {
    console.log("user/list::userLoggedIn: ", request.session.userIsLoggedIn);
    if (!request.session.userIsLoggedIn) {
        let err_msg = "/user/list/::error: " + request.body.login_name + " is not logged in.";
        console.log(err_msg);
        response.status(401).send(err_msg);
        return;
    }
    User.find({}, function(err, users) {
        if (err) {
            // Query returned an error.  We pass it back to the browser with an Internal Service
            // Error (500) error code.
            console.error('Doing /user/list error:', err);
            response.status(500).send(JSON.stringify(err));
            return;
        }
        if (users.length === 0) {
            // Query didn't return an error but didn't find the SchemaInfo object - This
            // is also an internal error return.
            response.status(500).send('Missing UserList');
            return;
        }

        // remove Mongoose schema restrictions.
        // console.log("ALL USERS");
        for (let i = 0; i < users.length; i++) {
            users[i] = JSON.parse(JSON.stringify(users[i]));
            // setup user property according to fetch API.
            delete users[i].location;
            delete users[i].description;
            delete users[i].occupation;
            delete users[i].__v;

            delete users[i].login_name;
            // console.log(users[i]);
        }
        
        console.log('/user/list::num_users_retrieved: ', users.length);
        response.status(200).end(JSON.stringify(users));
    });
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
    if (!request.session.userIsLoggedIn) {
        let err_msg = "/user/list/::error: " + request.body.login_name + " is not logged in.";
        console.log(err_msg);
        response.status(401).send(err_msg);
        return;
    }

    var id = request.params.id;
    User.findOne({_id: id}, function(err, user) {
        if (err) {
            if (user === undefined) {
                // console.error('/user/' + id, '::invalid_user_detected_error: ', err);
                response.status(400).send(JSON.stringify(err));
                return;
            }
            // Query returned an error.  We pass it back to the browser with an Internal Service
            // Error (500) error code.
            console.error('Doing /user/' + id, err);
            response.status(500).send(JSON.stringify(err));
            return;
        }

        if (user === null) {
            console.log('User with _id:' + id + ' not found.', user);
            response.status(400).send('Not found');
            return;
        }
        // remove Mongoose schema restrictions.
        let convertedUser = JSON.parse(JSON.stringify(user));

        // setup user property according to fetch API.
        delete convertedUser.__v;
        delete convertedUser.login_name;

        console.log('/user/', convertedUser._id + "/::full_name: " + convertedUser.first_name + " " + convertedUser.last_name);
        response.status(200).end(JSON.stringify(convertedUser));
    });
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', async function (request, response) {
    if (!request.session.userIsLoggedIn) {
        let err_msg = "/user/list/::error: " + request.body.login_name + " is not logged in.";
        console.log(err_msg);
        response.status(401).send(err_msg);
        return;
    }
    
    var id = request.params.id;
    // console.log(O)
    //NOTE user_id === Mongo Id of User Schema.
    //Note _id is the Mongo Id of the Photo Schema.
    Photo.find({user_id: id}, async function(err, photos) {
        if (err) {
            if (photos === undefined) {
                // console.error('/photosOfUser/' + id, '::invalid_user_detected_error: ', err);
                response.status(400).send(JSON.stringify(err));
                return;
            }
            // Query returned an error.  We pass it back to the browser with an Internal Service
            // Error (500) error code.
            // console.error('Doing /photosOfUser/' + id, ' error:', err);
            response.status(500).send(JSON.stringify(err));
            return;
        }

        if (photos === null) {
            console.log('photosOfUser with _id:' + id + ' not found.', photos);
            response.status(400).send('Not found');
            return;
        }

        photos = JSON.parse(JSON.stringify(photos));
        for (let i = 0; i < photos.length; i++) {
            // remove Mongoose schema restrictions.
            photos[i] = JSON.parse(JSON.stringify(photos[i]));
            photos[i].comments = JSON.parse(JSON.stringify(photos[i].comments));

            // setup photos and photos.comments property according to fetch API.
            delete photos[i].__v;
            for (let j = 0; j < photos[i].comments.length; j++) {
                let commenterId = photos[i].comments[j].user_id;
                // console.log("PHOTO COMMENT", photos[i].comments[j]);
                if (commenterId === undefined) {
                    // console.log(commenterId);
                    // console.log(photos[i].comments[j]);
                    // console.log(request.session.user);
                    commenterId = photos[i].comments[j].user._id;
                }
                let commenter = await User.findById(commenterId).exec();
                if (commenter === null) {
                    // console.log("CANNOT FIND user with ID: ", photos[i].comments[j].user_id);
                    // console.log("CANNOT FIND user: ", request.session.user);
                    // console.log(photos[i].comments[j].comment);
                    return;
                }
                // console.log("\tcommenter", commenter)
                photos[i].comments[j].user = {
                    _id: photos[i].comments[j].user_id,
                    first_name: commenter.first_name,
                    last_name: commenter.last_name,
                };
                delete photos[i].comments[j].user_id;
            }
        }
        // remove Mongoose schema restrictions.
        let convertedPhotos = JSON.parse(JSON.stringify(photos));

        console.log('/photosOfUser/' + id + "::num_photos: ", photos.length);
        response.status(200).end(JSON.stringify(convertedPhotos));
    });
});


app.post("/user", async function (request, response) {
    /*
    /user to allow a user to register. The registration POST takes a JSON-encoded body with the following properties: ( login_name, password,
    first_name, last_name, location, description, occupation ). The post request handler must make sure that the new login_name is
    specied and doesn't already exist. The rst_name, last_name, and password must be non-empty strings as well. If the information is valid, then a
    new user is created in the database. If there is an error, the response should return status 400 and a string indicating the error.
    */
    let login_name = request.body.login_name;
    let password = request.body.password;
    let first_name = request.body.first_name;
    let last_name = request.body.last_name;
    let location = request.body.location;
    let description = request.body.description;
    let occupation = request.body.occupation;

    User.find({}, "login_name", async function (error, users) {
        if (error) {
            console.error('Doing /user. checking for login_name conflicts: error:', error);
            response.status(500).send(JSON.stringify(error));
            return;
        }

        for (let u of users) {
            let user = JSON.parse(JSON.stringify(u));
            console.log(user)
            if (user.login_name === login_name) {
                let msg = "/user::duplicate login_name";
                console.log(msg);
                response.status(400).send(JSON.stringify(msg));
                return;
            }
        }
    });

    if (first_name === "" || last_name === "" || password === "") {
        let msg = "/user::must have non-empty first/last name and password.";
        console.log(msg);
        response.status(400).send(JSON.stringify(msg));
        return;
    }

    var saltedPassword = makePasswordEntry(password);

    let newUser = new User({
        login_name: login_name,
        password_digest: saltedPassword.hash,
        salt: saltedPassword.salt,

        first_name: first_name,
        last_name: last_name,
        location: location,
        description: description,
        occupation: occupation,
    });

    newUser.save(function (err) {
        if (err) {
            let msg = "/user::saving new Mongoose User failed.";
            response.status(500).send(msg);
            return;
        }
        // saved!
        // send back OK response 
        let msg = "/user. New User(" + login_name + ") was created!"
        response.status(200).end(msg);
    });
});


var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});


