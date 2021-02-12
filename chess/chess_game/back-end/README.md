# KiVa Back-End

KiVa is a powerfull online key-value store. Sort of…
You can use this initial setup to bootstrap any `flask` `anodb` project.

Authors: *Fabien* and *Claire*, MINES Paris, Université PSL.

## Practice start

Finalize your [CRI Gitlab https://gitlab.cri.mines-paristech.fr/](https://gitlab.cri.mines-paristech.fr/)
account creation by connecting to the server, and recovering the account based on your email
address and by following the lost password procedure.

Start your MobApp VM.

Generate (or possibly copy an existing) standard SSH RSA public/private key pair
protected by an incredible password (BUT DO NOT CHANGE THE DEFAULT DIRECTORY AND
FILE NAME!):

```sh
ssh-keygen -t rsa -b 2048
```

The upload the *public* key (which is `.ssh/id_rsa.pub` file contents) to your
[CRI Gitlab](https://gitlab.cri.mines-paristech.fr/) account
(Your account / Settings / SSH Keys), so as to allow cloning, pulling and pushing
git repositories to the server.

Configure `git` global settings:

```sh
git config --global --add user.name "YourFirstName YourLastName"
git config --global --add user.email "firstname.lastname@mines-paristech.fr"
git config --global --add pull.rebase true
…
```

In the CRI Gitlab interface, fork the
[kiva-zero](https://gitlab.cri.mines-paristech.fr/coelho/kiva-zero/) project as
a private repository (Fork / Select your name space and validate),
and then clone it locally in the VM by replacing `<your-id>` with your gitlab account name:

```sh
git clone git@gitlab.cri.mines-paristech.fr:<your-id>/kiva-zero.git kiva-zero
```

You will be authenticated with your SSH public/private key pair created above.

## Back-End Development

This initial working app only implements `/version` which returns a JSON with a few
data, including the time taken from the database. Wow.

Let us develop it further to provide a key-value store available to permitted users.


### Initial Setup

The following files are available in the `back-end` directory:

- [Makefile](Makefile) which wondefully automate tasks by running `make something`
- [app.py](app.py) a marvellous [Flask](https://flask.palletsprojects.com/) application which gives the time
- [queries.sql](queries.sql) SQL queries for [AnoDB](https://github.com/zx80/anodb)
- [pg.conf](pg.conf) app configuration for [Postgres](https://postgresql.org/)
- [create.sql](create.sql) create application schema
- [drop.sql](drop.sql) drop application schema
- [data.sql](data.sql) insert initial test data
- [truncate.sql](truncate.sql) cleanup schema contents
- [test.py](test.py) [pytest](https://docs.pytest.org/) script

Look at carefully and understand these files.
Do not hesitate to ask questions if in doubt.


### Useful Make Targets

The [Makefile](Makefile) automates some common targets.
Check that you understand how these targets and commands work.

- cleanup generated files, stop everything:

```sh
make clean
```

- generate the python virtual environment, and use it:

```sh
make venv
source venv/bin/activate
```

Beware that you will have to reactivate the virtual environment in each new terminal.

- start app in dev mode on local port 5000, and check:

```sh
make run
curl -i -X GET http://0.0.0.0:5000/version
```

You can also check this URL from a web brower in the VM.

- install a REST web brower extension (eg
Chrome's [Advanced REST Client](https://install.advancedrestclient.com/install),
Firefox's [Rester](https://addons.mozilla.org/fr/firefox/addon/rester/)
or [RESTClient](https://addons.mozilla.org/fr/firefox/addon/restclient/)).

And perform a `GET /version` request your local flask test server.

- stop running app:

```sh
make stop
```

In some cases the flask back-end may still be running…
Try `make clean` and/or manually kill the running back-end
with `pkill flask`.

- run tests: all, type checking (`mypy`), style checking (`flake8`) or with
a run check against a postgres database (`pytest`)…

```sh
# run all available tests
make check

# available tests
make check-types
make check-style
make check-pg
```

Example manual sessions: start the Flask development server, and make HTTP
requests from the command line... this will be useful to test new features
when they are developed *LATER*.

```sh
# start flask backend with a Postgres database
make run

# GET request, authenticated as `hobbes` with password `calvin`
curl -i -u hobbes:calvin http://0.0.0.0:5000/version

# GET authenticated request
curl -i -u calvin:hobbes http://0.0.0.0:5000/store/calvin

# POST request with 2 parameters
curl -i -X POST -d key=calvin -d val=hobbes -u calvin:hobbes http://0.0.0.0:5000/store

# DELETE request as `hobbes` with password `calvin`
curl -i -X DELETE -u hobbes:calvin http://0.0.0.0:5000/store/calvin

# PATCH request with 1 parameter
curl -i -X PATCH -d val=susie http://0.0.0.0:5000/store/calvin

# stop running back-end
make stop
```

File `app.log` contains flask logs, which are useful. Look at them!
In development, it is also possible to do some debugging in the browser.


### Development Method

Develop the micro-services described in the next section incrementaly,
using a [TDD - Test-driven development](https://en.wikipedia.org/wiki/Test-driven_development)
approach.

For each addition, proceed as follow:

1. add new success *and* failure tests to
[test.py](test.py), in a *new* test function `test_N`
for each added feature.

2. run new test, checking whether it works or fails as expected.

3. alter the database schema if needed ([create.sql](create.sql),
[drop.sql](drop.sql),
[data.sql](data.sql) and [truncate.sql](truncate.sql)).

4. add relevant queries to [queries.sql](queries.sql).

5. add or update path handling to [app.py](app.py), ensuring that db
queries are committed on return.

6. run tests, iterating on 3-4-5 till they work.

7. `git commit -a` and `git push` to [gitlab](https://gitlab.cri.mines-paristech.fr/).

8. refactor code from time to time to improve quality.

Note: the following TDD oriented exercise is somehow too fine grain.
In real life, one test would probably encompass all methods related
to a given path.


### KiVa Micro Services

The provided kiva-zero version implements `GET /version` to return some information.
Look at the [app.py](app.py) and [queries.sql](queries.sql) files to understand
how this is implemented.

Develop the following services, in this order, issuing a commit entitled
*Kiva N* where *N* the addition number when the *N*-th feature tests work.

All services must accept HTTP or JSON parameters and return JSON data, if any.
The already predefined `PARAMS` dictionnary allows to manage such parameters
transparently, how nice!

Calls must return HTTP success (2XX) or error (4XX) status appropriately.

1. `GET /store` returns the store contents, as a list of tuples.
For this first question, follow these detailed steps:

    1. Edit the existing `test_1` function in `test.py`:

       ```python
       def test_1():
           # check that http://.../store returns something:
           check_api('GET', '/store', 200, r'.')
       ```

       and check that this new test *fails* as expected, as the feature is not implemented yet:

       ```sh
       make check-pg
       ```

       Spend some time reading and understanding the `check_api` documentation in `test.py`.

    2. Add a table to `create.sql`:

       ```sql
       CREATE TABLE Store(
         key TEXT PRIMARY KEY,
         val TEXT NOT NULL);
       ```

    3. Add the corresponding cleaning in `drop.sql`:

       ```sql
       DROP TABLE IF EXISTS Store;
       ```

    4. Add some initial data in `data.sql`:

       ```sql
       INSERT INTO Store(key, val) VALUES (…, …), (…, …), …;
       ```

    5. Add cleaning up the table contents in `truncate.sql`:

       ```sql
       TRUNCATE Store;
       ```

    6. Append a new query to `queries.sql`, after an empty line, at the end of the file:

       ```sql
       -- name: get_store_all
       SELECT key, val FROM Store ORDER BY 1;
       ```

       Note that the comment is **MANDATORY**, as it defines the name
       of the Python function which will be generated by AnoSQL.

    7. Add a function to `app.py` to answer to `GET /store`:

       ```python
       # GET /store
       @app.route("/store", methods=["GET"])
       def get_store():
           # this calls the function defined from "queries.sql"
           res = db.get_store_all()
           # release locks…
           db.commit()
           # before returning the result
           return jsonify(res)
       ```

    8. Check that it works **manually** with Postgres:

       ```sh
       make run-pg
       curl -i http://0.0.0.0:5000/store
       make stop
       ```

       You should see the json-ified `Store` table contents in the output.

    9. Check that the added test now works:

       ```sh
       make check-pg
       ```

    9. If all is well, `git commit -a` and `git push`!

1. `PUT /store` is not implemented, aka HTTP status 405.

   Just adding a test should be enough.

1. `PATCH /store` is not implemented.

   Idem.

1. `POST /store (key, val)` add a new entry, return HTTP status 201.

   1. Add a new `test_2` test function to `test.py`:

   ```python
   def test_2():
       # paramètres HTTP
       check_api('POST', '/store', 201, data={"key":"ajout1","val":"un"})
       check_api('GET', '/store', 200, r'ajout1')
       # paramètres en JSON
       check_api('POST', 'store', 201, json={"key":"ajout2","val":"deux"})
       check_api('GET', '/store', 200, r'ajout2')
   ```

   And check that it *fails* as expected

   2. Append a new query to `queries.sql`.
      The `!` indicates that the generated function does not return anything.
      IT MUST BE THERE.

   ```sql
   -- name: add_to_store!
   INSERT INTO Store(key, val) VALUES (:key, :val);
   ```

   3. Add the query handling to `app.py`. It first checks for the required parameters, then calls the database function.

   ```python
   # POST /store (key, val)
   @app.route("/store", methods=["POST"])
   def post_store():
       # the PARAMS dictionnary contains request parameters
       if not "key" in PARAMS or not "val" in PARAMS:
           return "missing parameter…", 400
       db.add_to_store(key=PARAMS["key"], val=PARAMS["val"])
       # end of transaction
       db.commit()
       # we are done
       return "", 201
   ```

   4. Check that it works *manually*:

   ```sh
   # start server
   make run-pg
   curl -i -X POST -d key="manuel1" -d val="un" http://0.0.0.0:5000/store
   # should show the 201 result
   curl -i http://0.0.0.0:5000/store
   # should show the added data…
   curl -i -X POST -d key="manuel2" http://0.0.0.0:5000/store
   # should show a 400 error because of the missing "val" parameter
   # stop server
   make stop
   ```

   5. Check that automated tests work:

   ```
   make check
   ```

   6. If all is well, commit and push.

1. `DELETE /store` empty store, HTTP status 204.

    Obviously this feature should be restricted to application admins.

1. `GET /store (filter)` show store contents whose keys match the `LIKE` filter.

    Modify the existing `GET /store` handling function to use an optional `filter` parameter.

1. `DELETE /store (filter)` delete store contents whose keys match the `LIKE` filter.

1. `GET /store/<key>` returns the corresponding value as a simple JSON scalar string,
or HTTP status 404 if the key does not exist.

1. `POST /store/<key>` is not implemented.

1. `PATCH /store/<key> (val)` update associated value.
Return HTTP status 404 if the resource does not exist,
and 400 if the required parameter is missing.

1. `PUT /store/<key> (val)` update associated value.
Return HTTP status 404 if the resource does not exist,
and 400 if the required parameter is missing.
Only write 7 characters to implement this feature.

1. `DELETE /store/<key>` delete value.
Return HTTP status 404 if the resource does not exist.

1. Add a new users concept which will be authorized to perform
some tasks on `/store`: either admin (for `DELETE /store`),
read-only permissions (`GET`) or write (all others) permissions.

   This requires a new table defining users and their associated authorizations,
and then to query this table from each request. Also, authentication needs a
password field which typically holds the salted hash of the user password.
As local tests do not perform an actual authentication, the field value
is not actually used by them. Ensure that authorizations are consistent:
an admin can read and write, write imply read permissions…

   Tests (`test.py`) defines four users: `kiva` who is admin, `calvin` with write,
`hobbes` with read-only and `moe` without access permissions. You initial data (`data.sql`)
*must* define them.  Tests written for previous questions probably assumed admin
rights (the default), so only failure *forbidden* HTTP status code 403 tests need
to be added.

   In `app.py`, define three helper functions `can_read`, `can_write` and `is_admin`
for checking authorizations, that are then called when processing a request:

    ```python
    def get_version():
        if not can_read(LOGIN):
            return Response(status=403)
        …
    ```

1. Using the flask *after request* hook, ensure that all requests end on a `commit`.

1. Using a decorator, improve authorization checks so that the database is not
queried on each request for that purpose by caching positive results…

   ```python
    @CacheOK
    def is_admin(login):
        …
    ```

1. `GET /stats` admin can see `db._count` stats, which is a dictionnary.

1. `GET /users` admin can list users.

1. `GET /users (filter)` admin can list users matching a criteria.

1. `POST /users (login, pw[, is_admin, can_write, can_read])` admin can create a new user,
with default values for the permissions.

1. `PATCH /users/<login> (pw, is_admin, can_write or can_read)` admin can update user data.

1. `PUT /users/<login> (pw, is_admin, can_write or can_read)` admin can update user data.

1. `DELETE /users/<login>` admin can remove a user.

1. All other methods on `/users` and `/users/<login>` are not implemented.

1. Using a decorator, improve authorization checks so that they are declared
on each function rather than explicitely implemented…

   ```python
    @app.route("/version", methods=["GET"]) 
    @RequirePerm(role=READ)
    def get_version():
        …
   ```

1. Review and improve your code…

1. Compare the length of app and test codes. What do you think?
